<script>
  // import InView from "$lib/Wrappers/InView.svelte";
  import PlansCard from "$lib/Plans/PlansCard.svelte";
  import { elasticOut } from "svelte/easing";
  import {
    scale,
    //  slide ,fade, fly,
  } from "svelte/transition";
  import { plansCardArray } from "$lib/Plans/plansCardArray";
  // import { onMount, createEventDispatcher } from "svelte";
  // import { cssToHead, jsToHead } from "$lib/utils";
  // let dispatch = createEventDispatcher();

  // export let plansCards = plansCardArray;

  // export let noTransition = false; // when user does include noTransition as a prop then this is rewritten to 'true'
  // let ready = noTransition;
  // onMount(() => (ready = true));
  // the 'ready' variable logic allows the in:scale div to animate (svelte transition) when going directly to this plans route ..otherwise only works when navigating from another route
  // function addCalendlyCSSandJS() {
  //   console.log("📅");
  //   jsToHead(
  //     "calendlyJS",
  //     "https://assets.calendly.com/assets/external/widget.js"
  //   );
  //   cssToHead(
  //     "calendlyCSS",
  //     "https://assets.calendly.com/assets/external/widget.css"
  //   );
  // }

  // This 'boop-function' dispatches a 'boop-event' when called; below, it's called as soon as the element is created with 'use:boop'.  An alternative to 'use:boop' logic is 'use={ dispatch("boop", OBJECT) }' ... but I think the former is more html-readable
  // function boop() {
  //   dispatch("boop", { plansCardArray, message: "n i boop" });
  // }
</script>

<!-- <InView once margin={"200px"} onview={addCalendlyCSSandJS}> -->
<!-- use:boop -->
<plans-section
  class="grid grid-cols-1 sm:grid-cols-dynamic sm:px-4 px-[7%] md:m-7"
>
  <!-- class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 sm:px-4 px-10 md:m-7" -->
  <!-- {#if ready} -->

  {#each plansCardArray as { card, payNowUrl, payLaterUrl, cardTitle, cardText }, i}
    <div
      in:scale={{
        delay: 100 * i,
        duration: 1000,
        easing: elasticOut,
      }}
    >
      <PlansCard {card} {payNowUrl} {payLaterUrl}>
        <span slot="cardTitle"> {cardTitle} </span>
        <span slot="cardText"> {cardText} </span>
      </PlansCard>
    </div>
  {/each}
  <!-- {/if} -->
</plans-section>
<!-- </InView> -->

<!-- <style>
    .dynamic-col {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  } 
</style> -->
<!-- The above grid logic now achieved with the custom 'grid-cols-dynamic' as speficifid in tailwind.config.cjs  -->

<!-- <svelte:head>
  <script
    type="text/javascript"
    src="https://assets.calendly.com/assets/external/widget.js"
    async
  ></script>
  <link
    href="https://assets.calendly.com/assets/external/widget.css"
    rel="stylesheet"
  />
</svelte:head> -->
