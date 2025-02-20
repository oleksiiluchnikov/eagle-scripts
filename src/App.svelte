<script>
import { onMount } from 'svelte';
import Button from './components/Button.svelte';

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
    <h1>First item: {name} of {items.length} items</h1>
    <div class="row">
        <Button
            text="Increment"
            onClick={() => count += 1}
        />
        <Button
            text="Decrement"
            onClick={() => count -= 1}
        />
    </div>
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
