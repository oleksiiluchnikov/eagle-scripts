<script>
  export let text = '';
  export let className = '';
  export let onClick = () => {};

</script>

<button
  class={`button ${className}`}
  on:click={onClick}
>
  {text}
</button>

<style>
</style>
