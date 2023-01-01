<!-- dec14,530pm: havent yet figured out the passed bounded props  -->
<script>
  import InView from "$lib/Wrappers/InView.svelte";

  export let Import = async () => {};
  let Component;
  const getComponent = async () => (Component = await Import());

  // import { onMount } from "svelte";
  // onMount(() => getComponent());
  // TESTING: Comment in this onMount section and comment out the InView wrapper below, to test website when components are not lazy Mounted
  // RESULTS:
  // > no lazy mount: pagespeedinsights-86/97/100/100  (firefox); lighthouse-98/97/100/100
  // > lazy mount:    pagespeedinsights-98/100/100/100 (firefox); lighthouse-100/100/100/100
  // DISCUSSION:
  // > lighthouse for no lazy explainable since inview is already built into many components ... even without lazymount i'm not getting a true baseline. I think chrome might also have some memory of previous version since safari and firefox load noticeably slow with the no lazy version
</script>

<InView onview={getComponent}>
  {#if Component}
    <Component.default {...$$props} />
  {/if}
</InView>

<!-- ALTERNATIVE: using svelte:component ... I find it less readable -->
<!-- 
<script>
  export let Import = async () => {};
  let Component;

  const getComponent = async () => (Component = (await Import()).default);

  import InView from "$lib/Wrappers/InView.svelte";
</script>

<InView onview={getComponent}>
  <svelte:component this={Component} {...$$props} />
</InView>  
-->
