<script>
  export let showModal = false;
  export let bgTint = "bg-[rgba(0,0,0,0.4)]";
  export let body;
  // default behaviour is to allow navbar through; when user declares 'body' prop then the modal is attached to the document's body ... such as with the calendly modals

  let container;
  import { onMount } from "svelte";
  // without this body append logic, the modal inherits strange padding when used inside other components; originally no issues when using modal at the layout level ... which makes sense as it is the top most level in sveltekit
  body && onMount(() => document.body.appendChild(container));
</script>

<!-- md:py-4 py-1 md:px-[7%] z-50 -->
<!-- grid place-items-center  --><!-- grid centering breaks on safari .. -->

<button
  bind:this={container}
  class=" z-50 fixed top-0 left-0 w-full h-full flex justify-center items-center  {showModal
    ? `${bgTint} `
    : 'hidden'} overflow-y-scroll overflow-x-clip"
  on:click|self={() => (showModal = false)}
>
  <slot />
</button>
