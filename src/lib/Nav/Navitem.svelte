<script>
  // import InView from "$lib/Wrappers/InView.svelte";
  export let href,
    content,
    routes,
    btnColorHover,
    icon,
    navIconClicked = false;
  // bool, btnColor,

  import { isRunningStandalone } from "$lib/utils";
  import {
    showLoginModal,
    showHomeworkModal,
    clearNavModals,
    // lessThan768,
  } from "$lib/store";
  import { page } from "$app/stores";

  // this allows going back and button click matching with route
  // could've done this in if/else but the boolean nature here made it unnecessary
  $: for (let key in routes) {
    routes[key].isCurrent = routes[key].href === $page.url.pathname;
  }

  function handleNavButtonClicks(e) {
    // resets all modals (so modals don't continuously pile up)
    // e.preventDefault();
    clearNavModals();

    // sets the correct modal
    if (href == "/homework") {
      e.preventDefault();
      $showHomeworkModal = true;
      return;
    }
    if (href == "/login") {
      e.preventDefault();

      $showLoginModal = true;

      return;
    }
  }
</script>

<a
  on:click={handleNavButtonClicks}
  data-sveltekit-preload-data
  {href}
  class="block font-Nunito font-thin 

  {!isRunningStandalone() &&
    ` ${btnColorHover}  hover:rounded py-1 px-2 duration-300 ease-in-out text-2xl md:text-xl`} "
>
  <!-- {#if $lessThan768} -->
  {#if isRunningStandalone()}
    <div
      class="flex flex-col justify-between items-center w-[50px] h-[50px] mt-1 md:px-10"
    >
      <svelte:component this={icon} bind:navIconClicked />
      <!-- <InView margin={"400px"}>
        <svelte:component this={icon} bind:navIconClicked />
      </InView> -->

      <span class="text-xs text-center">{content}</span>
    </div>
  {:else}
    {content}
  {/if}
</a>
