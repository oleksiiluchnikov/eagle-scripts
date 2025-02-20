const ExifTool = require('exiftool-vendored').ExifTool;
const os = require('os');

// Enable Node.js optimizations
if (typeof gc === 'function') {
    // Explicitly run garbage collection between large operations
    global.gc();
}

/** @type {ExifTool|null} */
let exiftoolSingleton = null;

const dateTagPrefixes = {
    year: 'dy_',
    month: 'dm_',
    day: 'dd_'
};

/**
 * Gets date fields in priority order for EXIF data extraction
 * @returns {string[]} Array of date field names
 */
function getPriorityDateFields() {
    return [
        'DateTimeOriginal',    // Most reliable for photos
        'CreateDate',
        'FileCreateDate',
        'MediaCreateDate',      // For video files
        'TrackCreateDate',      // For video files
        'ModifyDate',
        'FileModifyDate',
        'DateTime',
        'GPSDateTime',         // GPS timestamp if available
        'DocumentTimeCreated',  // PDF/Document creation time
        'TimeStamp',           // Generic timestamp
        'DateCreated'          // Alternative date field
    ];
}

/**
 * Gets or initializes an ExifTool instance
 * @returns {Promise<ExifTool>} Configured ExifTool instance
 */
async function initializeExifTool() {
    if (exiftoolSingleton) {
        try {
            await exiftoolSingleton.version();
            return exiftoolSingleton;
        } catch (error) {
            console.log('Previous ExifTool instance unusable, creating new one');
            exiftoolSingleton = null;
        }
    }

    exiftoolSingleton = new ExifTool({
        taskTimeoutMillis: 10000,
        maxProcs: Math.max(require('os').cpus().length - 1, 1), // Use available CPU cores
        minDelayBetweenSpawnMillis: 50,
        maxRetries: 2,
        numbers: true, // Faster number parsing
        fast: true,   // Fast operation mode
        stay_open: true, // Keep ExifTool process running
    });

    return exiftoolSingleton;
}

/**
 * Extracts and validates dates from file info
 * @param {Object} fileMetadata - File info object from ExifTool
 * @param {string[]} targetDateFields - Array of date field names to check
 * @returns {Date[]} Array of valid dates
 */
function extractValidDates(fileMetadata, targetDateFields) {
    return targetDateFields
        .map(field => fileMetadata[field])
        .filter(Boolean)
        .map(dateStr => {
            try {
                const date = new Date(dateStr);
                return isNaN(date.getTime()) ? null : date;
            } catch (e) {
                return null;
            }
        })
        .filter(Boolean);
}

/**
 * Updates the date-related tags of an item based on its birth time
 * @param {Object} fileItem - The item to update
 * @param {Date} creationDate - The birth time date
 */
async function updateDateTags(fileItem, creationDate) {
    if (!fileItem.tags || !creationDate?.getTime || isNaN(creationDate.getTime())) {
        return;
    }

    const monthStr = String(creationDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(creationDate.getDate()).padStart(2, '0');
    const year = creationDate.getFullYear();

    const newDateTags = new Set([
        `${dateTagPrefixes.year}${year}`,
        `${dateTagPrefixes.month}${monthStr}`,
        `${dateTagPrefixes.day}${dayStr}`
    ]);

    const nonDateTags = fileItem.tags.filter(tag =>
        !Object.values(dateTagPrefixes).some(prefix => tag.startsWith(prefix))
    );

    fileItem.tags = [...new Set([...nonDateTags, ...newDateTags])];
    await fileItem.save();
}

/**
 * Processes a single item to extract and update its date information
 * @param {Object} fileItem - Item to process
 * @param {ExifTool} exifTool - ExifTool instance
 * @returns {Promise<void>}
 */
async function processFileMetadata(fileItem, exifTool) {

    const metadata = await exifTool.read(fileItem.filePath);
    const dateFields = getPriorityDateFields();
    const extractedDates = extractValidDates(metadata, dateFields);

    if (extractedDates.length === 0) {
        console.warn(`No valid date information found for: ${fileItem.filePath}`);
        return;
    }

    extractedDates.sort((a, b) => a.getTime() - b.getTime());
    const oldestDate = new Date(extractedDates[0]);
    await updateDateTags(fileItem, oldestDate);
}

/**
 * Simple implementation to modify birth time of files using ExifTool
 * @param {Array<{filePath: string}>} fileItems - Array of items with filePaths to process
 * @returns {Promise<void>}
 */
async function setTagsToCreatedDate(fileItems) {
    let exifTool = null;

    try {
        exifTool = await initializeExifTool();

        // Process files in batches for optimal performance
        const batchSize = 200; // Adjust based on your system's capabilities
        const batches = [];

        for (let i = 0; i < fileItems.length; i += batchSize) {
            batches.push(fileItems.slice(i, i + batchSize));
        }

        let processedCount = 0;
        const totalFiles = fileItems.length;

        for (const batch of batches) {
            // Process each batch concurrently
            await Promise.all(batch.map(async (fileItem) => {
                try {
                    await processFileMetadata(fileItem, exifTool);
                    processedCount++;
                    if (processedCount % 100 === 0 || processedCount === totalFiles) {
                        console.log(`Progress: ${processedCount}/${totalFiles} files processed`);
                    }
                } catch (error) {
                    console.error(`Error processing file ${fileItem.filePath}:`, error);
                }
            }));
        }

        console.log(`Completed processing ${processedCount} files`);
    } catch (error) {
        console.error('Error in updateFileDates:', error);
        throw error;
    } finally {
        if (exifTool) {
            try {
                await exifTool.end();
                console.log('ExifTool instance closed successfully');
            } catch (error) {
                console.error('Error closing ExifTool instance:', error);
            }
        }
    }
}

export { setTagsToCreatedDate as setTagsToCreateDate };
