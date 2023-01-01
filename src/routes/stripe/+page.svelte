<script>
  import { onMount } from "svelte";
  import { PUBLIC_STRIPE_KEY } from "$env/static/public";
  // const PUBLIC_STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY;
  import { fly } from "svelte/transition";
  import { elasticOut } from "svelte/easing";

  let slideKey = false;

  // variables related to url parameters
  let urlSearch, service, extra, quantity, email;
  $: firstName = "";

  import { app } from "$lib/Login/firebase";
  import { getFunctions, httpsCallable } from "firebase/functions";
  const functions = getFunctions(app);

  onMount(async () => {
    slideKey = true;

    urlSearch = window.location.search.slice(1); // gets everything after "?" in url
    window.history.replaceState({}, "", `/${btoa(urlSearch)}`); // shows url parameters in base64
    stripeRedirectToCheckout();

    async function stripeRedirectToCheckout() {
      try {
        const USP = new URLSearchParams(urlSearch);

        const invitee_full_name = USP.get("invitee_full_name");
        const firstNameLowerCase = invitee_full_name
          .split(" ")[0]
          .toLowerCase();

        firstName =
          firstNameLowerCase.charAt(0).toUpperCase() +
          firstNameLowerCase.slice(1);

        email = USP.get("invitee_email");

        // converts answer_1 from 1.25 hr to 1.25 to 75 .. representing 75 minutes, say
        quantity = USP.get("answer_1").match(/\d+(\.\d{1,2})/)[0] * 60;

        // answer_2 relates to adding digital session notes
        if (USP.get("answer_2")) {
          // USP.get("answer_2").toLowerCase().includes("yes");
          // since this quesiton only has "yes" as an optoin then don't need to check anything other than existence
          extra = true;
        }

        // event_type_name sets session as classico or mock
        for (let el of ["classico", "mock"]) {
          if (USP.get("event_type_name").toLowerCase().includes(el)) {
            service = el;
            break;
          }
        }

        if (service && quantity) {
          // create checkout session using url params ... but only if some actually exist
          const stripeSessionIdGCF = httpsCallable(
            functions,
            "stripeSessionIdGCF"
          );
          const { data } = await stripeSessionIdGCF({
            email,
            extra,
            service,
            quantity,
            // dollar_hourly_rate,
          });

          // create checkout session; Stripe() comes from head script
          Stripe(PUBLIC_STRIPE_KEY).redirectToCheckout({ sessionId: data.id });
        }
      } catch (error) {
        console.log("stripeRedirectToCheckout failed", error);
      }
    }
  });
</script>

<svelte:head>
  <title>Stripe Checkout</title>
  <script src="https://js.stripe.com/v3/"></script>
</svelte:head>

<main>
  {#if slideKey && service && quantity}
    <div
      in:fly={{ y: -400, duration: 2000, easing: elasticOut }}
      class="font-Poppins text-5xl text-center pt-20 animate-bounce loading"
    >
      Almost there {firstName}
    </div>
  {/if}
</main>

<!-- OLD CODE: -->
<!-- const email = USP.get("email"); -->
<!-- const quantity = USP.get("quantity"); -->
<!-- const dollar_hourly_rate = USP.get("dollar_hourly_rate"); -->

<!-- const extra = USP.get("extra"); -->
<style>
  .loading:after {
    content: " . . .";
    animation: dots 1s steps(5, end) infinite;
  }

  @keyframes dots {
    0%,
    40% {
      color: rgba(0, 0, 0, 0);
    }
  }
</style>
