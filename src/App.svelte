<script>
import { onMount } from 'svelte';
import Button from './components/Button.svelte';
import { setTagsToCreatedDate } from './lib/setTagsToCreatedDate';

/** @type {any[]} */
$: items = [];
$: count = 0;
$: name = 'Eagle Inspector Plugin';

onMount(async () => {
    try {
        /** @ts-ignore */
        const selectedItems = await eagle.item.getSelected();
        if (selectedItems?.length > 0) {
            items = selectedItems;
            name = selectedItems[0].name;
        }
    } catch (error) {
        console.error('Failed to get selected items:', error);
    }
});


</script>

<main>
    <Button
        text="Set Tags to Created Date"
        onClick={() => {
            setTagsToCreatedDate(items);
        }}
    />
    <hr />
    <Button
        text="Reload"
        className="reload-button"
        onClick={() => window.location.reload()}
    />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 8px;
        text-align: center;
    }

    .row {
        display: flex;
        gap: 8px;
        justify-content: center;
    }
</style>
