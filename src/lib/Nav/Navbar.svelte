<script>
  import { browser } from "$app/environment";
  import LightDarkMode from "$lib/LightDarkMode.svelte";
  import { scale } from "svelte/transition";
  import { elasticOut } from "svelte/easing";
  import Navitem from "$lib/Nav/Navitem.svelte";
  import { goto } from "$app/navigation";
  import { isRunningStandalone, getOS } from "$lib/utils";
  import {
    isLoggedIn,
    routes,
    scrollY,
    isDarkMode,
    navAppClicked,
    clearNavModals,
    elementColor,
    // lessThan768,
    showLoginModal,
    showHomeworkModal,
  } from "$lib/store";
  import { spring } from "svelte/motion";

  let scaleRocket = spring(1, { stiffness: 0.1, damping: 0.25 });
  let hueRocket = 0;

  $: if ($isLoggedIn && !isRunningStandalone()) {
    hueRocket = $isDarkMode ? 0.75 : 0;
    scaleRocket.set(1 + 0.5 * Math.sin($scrollY));
  }

  $: $isLoggedIn ? ($routes.login.name = "🚀") : ($routes.login.name = "Login");

  let resetLogoClick;
  function clickLogo() {
    clearNavModals();
    goto("/");

    resetLogoClick = !resetLogoClick;

    for (let key in $routes) {
      $routes[key].isCurrent = false;
    }

    $routes.home.isCurrent = true;
  }

  function handleAppNavClick() {
    clearNavModals();
    $navAppClicked = true;
    // setTimeout(() => clearNavModals(), 15000);
  }

  let btnColor = "sm:bg-red-300 rounded";
  let btnColorHover = "hover:bg-red-300 ";

  $: bgGradientColor = `bg-gradient-to-r from-[rgba(0,0,0,0)] via-[rgba(0,0,0,0)]  ${
    $isDarkMode ? "to-[rgb(37,35,91)]" : "to-red-200"
  }`;

  // These two conditional tailwind classes work together; 'hideIfRunningStandalone' hides part of the navbar ui if accessing in standalone mode (i.e. from the app) ... however the change in content flickers. To remedy the flicker I have the navbar start with zero opacity and then 'fadeInToFullOpacity' transitions to max opacity using sveltekit's 'browser' check.
  // TODO: i wonder if app splashscreen would make 'fadeInToFullOpacity' unneeded
  // let hideIfRunningStandalone = $lessThan768 && "hidden";

  let hideIfNotIOS = getOS() !== "iOS" && "hidden"; // added dec4,2022 after noticing that the PWA download popup shows on android already

  let hideIfRunningStandalone = isRunningStandalone() && "hidden";
  let fadeInToFullOpacity =
    browser && "opacity-100 transition-opacity duration-1000 ease-in";
</script>

<!-- gap-x-24 -->
<logo-and-navbar
  class="opacity-0 {fadeInToFullOpacity} flex items-center justify-center gap-x-32 md:justify-between w-full"
>
  {#key resetLogoClick}
    <button
      class=" p-2 md:translate-y-[0.1rem] md:translate-x-3 hidden md:block text-xl font-Poppins 
    md:text-[min(5.5vw,40px)] active:text-red-600 hover:scale-110 transition-transform selection:bg-transparent"
      in:scale={{ duration: 1200, easing: elasticOut }}
      on:click={clickLogo}
    >
      THINKSOLVE
    </button>
  {/key}

  <!-- TODO: for some reason 'grid grid-flow-col place-items-center w-screen' works but 'flex flex-row items-center justify-center w-screen' does not. Noticed that adding 'justify-center' with flex here clips the navbar, disallowing the expected overflow-x-scroll behaviour -->
  <ul
    class="text-xl grid grid-flow-col place-items-center w-full gap-1 p-2 rounded-md md:rounded-xl md:ml-24 md:p-1 md:w-auto  {bgGradientColor} hideScrollBar overflow-x-scroll overflow-y-hidden"
  >
    <!-- py-3 px-5 -->
    <!-- <ul
    class="flex flex-row items-center justify-center w-screen text-xl  {bgGradientColor} hideScrollBar overflow-x-scroll rounded-md md:rounded-xl  md:ml-24 md:p-1 py-3 px-5 "
  > -->
    <li class={hideIfRunningStandalone || hideIfNotIOS}>
      <button
        class=" font-Nunito font-thin text-2xl md:text-xl hover:rounded py-1 px-2 duration-300 hover:shadow-lg  {$elementColor} hover:bg-indigo-400 hover:text-white  active:animate-pulse duration-200
      border-b-1 rounded "
        on:click={handleAppNavClick}
      >
        App
      </button>
    </li>

    <!-- {#each Object.keys($routes).slice(0, 6) as KEY} -->
    {#each Object.keys($routes).slice(1, 5) as KEY}
      <!-- class={(KEY == "home" || KEY == "faq") && hideIfRunningStandalone} -->
      <!-- class={KEY == "home" && hideIfRunningStandalone} -->
      <li
        style={KEY == "login" &&
          $isLoggedIn &&
          `transform:scale(${$scaleRocket}); filter:hue-rotate(${hueRocket}turn)`}
      >
        <Navitem
          href={$routes[KEY].href}
          content={$routes[KEY].name}
          bind:routes={$routes}
          bind:btnColor
          bind:btnColorHover
          icon={$routes[KEY].icon}
          navIconClicked={($routes[KEY].href == "/homework" &&
            $showHomeworkModal) ||
            ($routes[KEY].href == "/login" && $showLoginModal) ||
            $routes[KEY].isCurrent}
        />
        <!-- TODO: do all these need to be 'bind:' -->
      </li>
    {/each}

    <li
      class="py-2 translate-y-1 scale-125 md:scale-100 {hideIfRunningStandalone} "
    >
      <LightDarkMode />
    </li>
  </ul>
</logo-and-navbar>
