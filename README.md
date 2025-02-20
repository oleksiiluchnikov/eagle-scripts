# Eagle Plugin Svelte Template

This is a template repository for creating plugins for [Eagle](https://en.eagle.cool/) using Svelte and Vite. It provides a solid foundation for building powerful and efficient Eagle plugins with modern web technologies.

## Features

- 🚀 Built with [Svelte](https://svelte.dev/) and [Vite](https://vitejs.dev/)
- 📦 Optimized build configuration for Eagle plugins
- 🔧 Ready-to-use development environment with hot reload
    <!-- - 📝 Well-documented template structure -->
- 🎨 Theme-aware components that match Eagle's UI
- 🛠️ TypeScript support out of the box
- 📚 Comprehensive component library
- 🧪 Testing setup with Vitest
- 🔍 ESLint and Prettier for code quality

## Getting Started

### Prerequisites

- Node.js 18+
- Eagle Application installed
- Basic knowledge of Svelte and JavaScript/TypeScript

### Use this template

1. Click the "Use this template" button on GitHub
2. Clone your new repository
3. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

This will:

- Start Vite dev server with hot module reloading
- Watch for file changes and automatically rebuild
- Provide hot reloading in Eagle when files change

### Building

Build your plugin for production:

```bash
npm run build
```

The built files will be in the `build` directory.

### Testing

Run tests using Vitest:

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

### Testing in Eagle
```

1. Launch Eagle application
2. Go to Plugins -> Developer Options
3. Click "Import Local Project"
4. Select your plugin directory
5. The plugin will appear in Eagle's plugin list

### TypeScript Support

This template includes TypeScript support out of the box. To use TypeScript:

1. Rename your .js/.svelte files to .ts/.svelte
2. Add types to your variables and functions
3. Use the built-in Eagle type definitions

Example:

```typescript

```

## Project Structure

```
/
├── src/
│   ├── components/    # Reusable UI components
│   │   ├── Button.svelte
│   │   └── ...
│   ├── lib/          # Utility functions and helpers
│   ├── types/        # TypeScript type definitions
│   ├── main.js       # Entry point
│   └── App.svelte    # Root component
├── tests/           # Test files
├── index.html       # HTML template
├── global.css       # Global CSS styles
├── logo.png         # Plugin logo
├── docs/            # Documentation
├── .github/         # GitHub workflows
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript configuration
├── manifest.json    # Eagle plugin manifest
└── package.json     # Project configuration
```

## Available Scripts

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
