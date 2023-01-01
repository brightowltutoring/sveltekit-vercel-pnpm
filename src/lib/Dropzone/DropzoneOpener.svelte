<script>
  import {
    // isDarkMode,
    showHomeworkModal,
  } from "$lib/store";
  // $: boxShadowColor = $isDarkMode ? "#1d1c43" : "#ddd";
</script>

<!-- style="box-shadow: inset 0 -10px 10px {boxShadowColor}; border-radius: 50px; border-color: transparent; background-color: transparent" -->
<button
  on:click={() => ($showHomeworkModal = true)}
  class="flex justify-center items-center flex-wrap overflow-scroll backdrop-blur-3xl  text-3xl w-[65vw] sm:w-[60vw] h-[60vh] mx-auto group"
>
  <div class="font-Nunito group-hover:animate-pulse text-2xl">
    Drop it like it's 🔥
  </div>
</button>

<style>
  :root {
    --light-box-shadow-color: #ddd;
    --dark-box-shadow-color: #1d1c43;
  }
  button {
    box-shadow: inset 0 -10px 10px var(--light-box-shadow-color);
    border-radius: 50px;
    border-color: transparent;
    background-color: transparent;
  }

  :global(body.dark-mode) button {
    box-shadow: inset 0 -10px 10px var(--dark-box-shadow-color);
  }
</style>
