<script>
  import { isDarkMode } from "$lib/store";
  import { browser } from "$app/environment";

  //TODO: NOTE: For dark mode I am persisting '$isDarkMode' (i.e. a reactive, global boolean variable) via a localStorage copy  'isDarkModeLS'. In order to avoid 'flash of content' when returning after a closed session, a script tag in app.html is inserted which uses localStorage 'isDarkModeLS' (i.e. the last value of '$isDarkMode') to reproduce css light/darkmode on body.

  // During the session the localStorage copy 'isDarkModeLS' is updated based on changes to '$isDarkMode'; 'browser' method is needed so that sveltekit doesn't attempt this logic on server-side (localStorage only exists on client-side).
  $: $isDarkMode, browser && localStorage.setItem("isDarkModeLS", $isDarkMode);

  // On returning to app, set the '$isDarkMode' based on the local storage copy 'isDarkModeLS' ... essentially persisting '$isDarkMode' from previous session
  if (browser && localStorage.getItem("isDarkModeLS") === "true")
    $isDarkMode = true;
  else $isDarkMode = false;

  //TODO: NOTE: For dark mode I am persisting '$isDarkMode' (i.e. a reactive, global boolean variable) via a localStorage copy  'isDarkModeLS'. In order to avoid 'flash of content' when returning after a closed session, a script tag in app.html is inserted which uses localStorage 'isDarkModeLS' (i.e. the last value of '$isDarkMode') to reproduce css light/darkmode on body.

  import "../app.css";
  import {
    scale,
    fly,
    // slide, fade, blur
  } from "svelte/transition";
  import { elasticOut, quintOut } from "svelte/easing";

  import { page } from "$app/stores";
  import { routes } from "$lib/store";
  import LazyMount from "$lib/Wrappers/LazyMount.svelte";

  // import LoginCard from "../lib/Login/LoginCard.svelte"; //TODO: remove
  import InView from "$lib/Wrappers/InView.svelte";
  import Modal from "$lib/Wrappers/Modal.svelte";

  import Navbar from "$lib/Nav/Navbar.svelte";
  import Dropzone from "$lib/Dropzone/Dropzone.svelte";

  // this component is not 'LazyMount-ed' since LazyMount cannot handle bounded props..yet?
  let FooterComponent;

  import {
    instDeltaY,
    scrollY,
    setInnerWidthViaMatchMedia,
    lessThan768,
    showLoginModal,
    showHomeworkModal,
    navAppClicked,
    // isDarkMode,
    isLoggedIn,
  } from "$lib/store";

  import { disableZoomGestures, getOS, isRunningStandalone } from "$lib/utils";

  import { onMount } from "svelte";

  onMount(() => {
    // $lessThan768 && disableZoomGestures();
    (isRunningStandalone() || $lessThan768) && disableZoomGestures();
    setInnerWidthViaMatchMedia();

    // TODO: on xcode simulator the ipad 10th and ipad air 5th returns as 'macos' not 'ios' ... Main use case is for downloading PWA on ios/android phones, so as long as that works, it's fine.
  });

  // $: console.log("$instDeltaY", $instDeltaY);
  let jankytown;

  // sets jankytown for bigger than med.

  let verticalThreshold = 800;
  let verticalThresholdMobile = 400;

  $: if (!$lessThan768) {
    if ($scrollY < 10) jankytown = "top-0";

    if ($scrollY > 10 && $scrollY < verticalThreshold)
      jankytown = "top-0 backdrop-blur-3xl duration-1000";

    if ($scrollY > verticalThreshold && $instDeltaY > 10) {
      jankytown = "-top-20 backdrop-blur-3xl duration-200";
    }

    if ($instDeltaY < -100) jankytown = "top-0 backdrop-blur-3xl duration-700";
  }
  // sets jankytown for smaller than med
  $: if ($lessThan768) {
    if ($scrollY >= 0 && $scrollY < verticalThresholdMobile) {
      // if ($scrollY <= verticalThresholdMobile) {
      jankytown =
        "bottom-0 backdrop-blur-3xl md:top-0 md:backdrop-blur-3xl duration-200";
    }
    if ($scrollY > verticalThresholdMobile && $instDeltaY > 20)
      jankytown = "-bottom-28 duration-400";
    if ($instDeltaY < -30)
      jankytown = "bottom-0 backdrop-blur-3xl duration-700";
  }

  let contactLinkClicked = false;

  // for logincard ui .. which is lazy loaded below
  const opacityEasingDelay = 100;
  let changeOpacityTo100;
  $: if ($showLoginModal && !$isLoggedIn) {
    setTimeout(() => {
      changeOpacityTo100 =
        "opacity-100 transition-opacity duration-100 ease-in";
    }, opacityEasingDelay);
  }
</script>

<svelte:head>
  <link rel="manifest" href="/manifest.json" />

  {#if $page.status == 200}
    {@const slashlessRoute = $page.route.id.slice(1)}

    {#if slashlessRoute == ""}
      <title>{$routes.home.title}</title>

      {@html $routes.home.meta}
      <!-- meta tag now included in store object -->
      <!-- for some reason without svelte's '@html', the meta tags break upon reloading certain routes (like plans) -->
    {:else}
      {#each Object.keys($routes).slice(1) as key}
        {@const title = $routes[key].title}

        {#if slashlessRoute.startsWith(key)}
          <title>{title}</title>
          <!-- //TODO: meta tags are not attaching uniquely on route changes -->
          {#if $routes[key].meta}
            {@html $routes[key].meta}
          {/if}
        {/if}
      {/each}
    {/if}
  {:else}
    <!-- {:else if $page.status == 404} -->
    <title>Oops 💩</title>
  {/if}
</svelte:head>

<svelte:window bind:scrollY={$scrollY} on:contextmenu|preventDefault />

<main>
  <Modal showModal={contactLinkClicked} bgTint={"backdrop-blur-3xl"}>
    {#key !contactLinkClicked}
      <ul
        in:scale={{
          duration: 1500,
          easing: elasticOut,
        }}
        class="text-center flex flex-col gap-y-2 font-Poppins sm:text-5xl text-3xl text-transparent bg-clip-text bg-gradient-to-r  {$isDarkMode
          ? 'from-teal-200 via-rose-300 to-pink-200 '
          : 'from-teal-700 via-rose-700 to-pink-700 '}"
      >
        <li>Email:</li>
        <li class="p-5">thinksolve.io@gmail.com</li>
      </ul>
    {/key}
  </Modal>

  <!-- although the 'app' button is also screened in Navbar.svelte, it's also a good idea to not render the popup here -->
  {#if getOS() == "iOS"}
    <Modal
      showModal={$navAppClicked}
      bgTint={"text-white bg-gradient-to-br from-[#6c79f4] to-rose-400"}
    >
      {#key !$navAppClicked}
        <ul
          in:scale
          class="p-10 flex flex-col gap-y-8 font-Poppins text-3xl sm:text-6xl"
        >
          <li
            in:scale={{
              x: 100,
              duration: 1300,
              easing: elasticOut,
            }}
          >
            <div class="text-6xl">1.</div>
            Open Safari
          </li>
          <li
            in:fly={{
              x: 100,
              delay: 1200,
              duration: 1000,
              easing: quintOut,
            }}
          >
            <div class="text-6xl">2.</div>
            <div class="flex flex-row justify-center items-center gap-x-2 pt-2">
              <span> Click share icon</span>
              <img
                class="w-7 h-7 -translate-y-1  invert"
                src="/safari-share-icon.png"
                alt="safari share icon"
              />
            </div>
          </li>

          <li
            class=" text-black"
            in:fly={{
              x: 200,
              delay: 2000,
              duration: 1200,
              easing: quintOut,
            }}
          >
            <div class="text-6xl ">3.</div>
            Click 'Add to Home Screen' 🚀
          </li>
        </ul>
      {/key}
    </Modal>
  {/if}

  <!--dec 16,2022: Logincard contains firebase modules and svg icon in svelte components ... lazy loading this yields a perfect lighthouse score (Logincard.svelte is loaded!), however due to the asynchronous nature of dynamic import the UI takes a hit ... which is why I also use 'opacity easing' in Modal.svelte. Seems so janky, however the alternative is much worse: granularly dynamic import everything inside Logincard. Oh and for some reason have to reset '$showLoginModal = true' ... haven't yet figured why it flicker to false when first clicking the login button -->

  <!-- UPDATE: the timeout here is 250ms and 100 ms and in opacity easing logic defined above. These are magic numbers as far as im concerned, up until now the logincard has been jittery on mobile -->

  <Modal
    body
    bind:showModal={$showLoginModal}
    bgTint={`backdrop-blur-md opacity-0 ${changeOpacityTo100}`}
  >
    <!-- <LoginCard /> -->
    <LazyMount
      Import={() => {
        setTimeout(() => ($showLoginModal = true), 2.5 * opacityEasingDelay); //opacityEasingDelay = 100ms
        return import("$lib/Login/LoginCard.svelte");
      }}
    />
  </Modal>

  <Modal bind:showModal={$showHomeworkModal} bgTint={"bg-[rgba(0,0,0,0.1)]"}>
    <Dropzone
      textSizeTW={"text-6xl"}
      dimensionsTW={"w-[80vw] h-[85vh]"}
      brightnessTW={"brightness-95"}
    />
    <!-- NOTE: luckily this one modal dropzone has no impact on the perfect lightscore .. having the Dropzone lazyMounted (which I had done before) would prevent the 'popupOnce' logic defined inside Dropzone.svelte; even WITH timeout delay it would not work -->

    <!-- <LazyMount
      Import={() => import("$lib/Dropzone/Dropzone.svelte")}
      textSizeTW={"text-6xl"}
      dimensionsTW={"w-[80vw] h-[85vh]"}
      brightnessTW={"brightness-95"}
    /> -->
  </Modal>

  <div class=" z-50 md:py-4 md:px-[7%] fixed {jankytown} ease-in-out w-full ">
    <Navbar />
  </div>

  <div class="px-[7%] pt-32 md:block">
    <slot />

    <!-- <Footer bind:contactLinkClicked /> -->

    <!-- without status 200 check, this breaks with error.svelte -->
    {#if $page.status == 200 && $page.route.id !== "/classroom"}
      <InView
        margin={"200px"}
        onview={async () =>
          (FooterComponent = await import("$lib/Footer.svelte"))}
      >
        {#if FooterComponent}
          <FooterComponent.default bind:contactLinkClicked />
        {/if}
      </InView>
    {/if}
  </div>
</main>
