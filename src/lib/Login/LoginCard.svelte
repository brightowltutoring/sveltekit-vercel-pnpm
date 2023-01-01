<script>
  import TwitterLoginButton from "$lib/Login/TwitterLoginButton.svelte";
  import GoogleLoginButton from "$lib/Login/GoogleLoginButton.svelte";
  import MagicLinkSection from "$lib/Login/MagicLinkSection.svelte";
  import PhoneAuthSection from "$lib/Login/PhoneAuthSection.svelte";
  // import CloseButton from "$lib/CloseButton.svelte";

  // TODO: commented out on dec12, 2022  due to code splitting / dynamic importing
  // import { app, auth } from "$lib/Login/firebase";

  // import { auth } from "$lib/Login/firebase";
  // import { onAuthStateChanged, isSignInWithEmailLink } from "firebase/auth";

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { slide } from "svelte/transition";
  import { quintOut, elasticOut } from "svelte/easing";
  import { isRunningStandalone } from "$lib/utils";
  import { logoutFunction } from "$lib/Login/loginFunctions";
  import {
    isLoggedIn,
    isDarkMode,
    elementColor,
    showLoginModal,
    // lessThan768,
  } from "$lib/store";

  export let noTransition = false;

  let loginWelcomeText;

  // Allows to convert infinite 'animate-ping' tailwind animation to short animation;
  // logic in 'signinWithLinkAndStop' function. Normally would do this with svelte and keyed block,
  // however the destruction/creation of the element interferes with event fire logic I want to maintain

  let loggedInEmail;

  // these were previously store variables, but the reactive statement below takes care of things
  let redirectAfterLoginTimeOut;
  let redirectSetInterval;

  // !$showLoginModal just means when unclicking login button ... rename at a future date?
  $: if (!$showLoginModal) {
    clearInterval(redirectSetInterval);
    clearTimeout(redirectAfterLoginTimeOut);
  }

  $: if ($showLoginModal && $isLoggedIn) {
    showLoginModalRedirect(loggedInEmail);
  }

  async function onMountFirebase() {
    const { auth } = await import("$lib/Login/firebase");
    const { onAuthStateChanged, isSignInWithEmailLink } = await import(
      "firebase/auth"
    );

    // Confirm the link is a sign-in with email link.

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }

      const { signInWithEmailLink } = await import("firebase/auth");
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
          $showLoginModal = true;
        })
        .catch((error) => console.log("signInWithEmailLink:", error));
    }

    // window.localStorage.removeItem("previouslySignedIn");
    // let previouslySignedIn = JSON.parse(
    //   window.localStorage.getItem("previouslySignedIn")
    // );
    // if (previouslySignedIn === true) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // window.localStorage.setItem("previouslySignedIn", true);
        $isLoggedIn = true;
        loggedInEmail = user.email;

        loginWelcomeText = user.displayName
          ? `Hey ${user.displayName}!`
          : `Hey ${user.email}!`;
      } else {
        localStorage.removeItem("redirectUrlFromLS"); // clears on logout only; stays even on refresh/exit!
        $isLoggedIn = false;
        $showLoginModal = false;
        loggedInEmail = "";
      }
    });
    // }
  }

  onMount(() => onMountFirebase());

  //  Hoisted Functions

  // this function needs to detect logout too to reset store
  function redirectLogic(userRedirectUrl = "/login") {
    let redirectTimeInMS = 3000;
    let seconds = parseInt(redirectTimeInMS / 1000); // i.e. 3

    // redirectSetInterval and redirectAfterLoginTimeOut are global variables, the state of which is also controlled above via a reactive statement

    redirectSetInterval = setInterval(() => {
      if (seconds > 0) {
        seconds += -1;
        document.getElementById("timeLeft").innerHTML = ` ${seconds}`;
      }
    }, 1000);

    redirectAfterLoginTimeOut = setTimeout(() => {
      $showLoginModal = false;
      document.getElementById("timeLeft").innerHTML = 3;
      goto(userRedirectUrl);
    }, redirectTimeInMS);
  }

  async function showLoginModalRedirect(userEmail) {
    let redirectUrlFromLS = localStorage.getItem("redirectUrlFromLS");
    console.log("redirectUrlFromLS", redirectUrlFromLS);

    if (redirectUrlFromLS) {
      redirectLogic(redirectUrlFromLS);
    } else {
      const { getFirestore, collection, getDocs } = await import(
        "firebase/firestore/lite"
      );

      // TODO:dynamic importing added on dec12,2022
      const { app } = await import("$lib/Login/firebase");

      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, "email"));
      const querySnapshotSize = querySnapshot.size;
      const docs = querySnapshot.docs; // forEach can use querySnapshot directly, however 'break' logic becomes convoluted with try-catch block and throwing 'BreakException={}' (see: https://stackoverflow.com/questions/2641347/short-circuit-array-foreach-like-calling-break)
      for (const i in docs) {
        const doc = docs[i];

        if (userEmail === doc.id) {
          localStorage.setItem("redirectUrlFromLS", doc.data().redirectUrl);
          redirectUrlFromLS = localStorage.getItem("redirectUrlFromLS");
          redirectLogic(redirectUrlFromLS);
          return; // break;
        }
        // without parseInt(i) this math conditional breaks
        if (parseInt(i) === querySnapshotSize - 1) {
          localStorage.setItem("redirectUrlFromLS", "/");
          redirectUrlFromLS = localStorage.getItem("redirectUrlFromLS");
          redirectLogic(redirectUrlFromLS);
        }
      }
    }
  }
</script>

<!-- TODO: when doing w-screen this component on '/login' route is off-center -->
<main class="w-full flex justify-center items-center ">
  {#if !$isLoggedIn}
    {#key !noTransition && $showLoginModal}
      <login-card
        in:slide={{ duration: 400, easing: quintOut }}
        class="card-styles text-xl {$isDarkMode
          ? 'hover:shadow-xl '
          : 'hover:shadow-lg'}"
      >
        <!-- style={`background:${$elementColor}`} -->
        {#if isRunningStandalone()}
          <PhoneAuthSection />
        {:else}
          <MagicLinkSection />

          <p class="py-3" />
          <PhoneAuthSection />
        {/if}

        <GoogleLoginButton />

        <TwitterLoginButton />
      </login-card>
    {/key}
  {/if}

  {#if $isLoggedIn}
    {#key !noTransition && $showLoginModal}
      <logout-card
        in:slide={{ duration: noTransition ? 0 : 1000, easing: elasticOut }}
        class="text-xl card-styles {$isDarkMode
          ? 'hover:shadow-xl'
          : 'hover:shadow-lg'}"
      >
        <!-- style={`background:${$elementColor} `} -->
        <p>{loginWelcomeText}</p>

        <div>
          Redirecting in
          <div class="text-5xl p-5" id="timeLeft">3</div>
        </div>

        <button
          class="text-2xl font-medium bg-rose-300 text-white rounded-lg p-4 hover:scale-110 hover:rounded-xl duration-200 ease-in"
          on:click={logoutFunction}>Logout</button
        >
      </logout-card>
    {/key}
  {/if}
</main>

<style>
  .card-styles {
    @apply relative block font-Poppins mx-auto py-10 px-5 sm:p-10 w-[90vw] sm:w-[500px] shadow-md hover:scale-[1.01] rounded-2xl hover:rounded-3xl duration-300;
  }

  login-card,
  logout-card {
    background: rgb(242, 247, 250);
  }

  :global(body.dark-mode) login-card {
    background: rgb(38, 35, 51);
  }
  :global(body.dark-mode) logout-card {
    background: rgb(38, 35, 51);
  }
</style>
