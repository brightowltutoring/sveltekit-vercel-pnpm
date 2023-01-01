<script>
  import IconSun from "$lib/Icons/IconSun.svelte";
  import IconMoon from "$lib/Icons/IconMoon.svelte";
  import { scale, slide } from "svelte/transition";
  import { elasticOut, quintOut } from "svelte/easing";
  import { isDarkMode } from "$lib/store";

  // import { browser } from "$app/environment";

  function toggleDM() {
    $isDarkMode = !$isDarkMode;
    document.body.classList.toggle("dark-mode");
    // localStorage.setItem("darkMode", $isDarkMode);
  }
</script>

{#key $isDarkMode}
  <!-- Currently using nested 'divs' to compose two svelte transitions. This can be done with a custom function as well (TODO:) such as on: https://svelte.dev/repl/f5c42c6dc6774f29ad9350cd2dc2d299?version=3.38.3 -->
  <div in:slide={{ duration: 600, easing: quintOut }}>
    <button
      on:click={toggleDM}
      in:scale={{ duration: 1000, easing: elasticOut }}
    >
      {#if $isDarkMode}
        <IconSun />
      {:else}
        <IconMoon />
      {/if}
    </button>
  </div>
{/key}

<style>
  :root {
    --light: #f7f7f7;
    --dark: rgb(20, 13, 33);
    /* --light_darkened: rgb(224, 229, 232); */
    /* --dark_lightened: rgb(38, 35, 51); */
  }
  :global(body) {
    background: var(--light);
    color: var(--dark);
    transition: background-color 0.3s;
  }

  :global(body.dark-mode) {
    background: var(--dark);
    color: var(--light);
  }
</style>
