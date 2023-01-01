<script>
  import JitsiUser from "$lib/Jitsi/JitsiUser.svelte";
  import { onMount, onDestroy } from "svelte";
  import { isDarkMode } from "$lib/store";

  onMount(() => {
    $isDarkMode = true;
    document.body.classList.add("dark-mode");
  });
  onDestroy(() => {
    $isDarkMode = false;
    window.document.body.classList.remove("dark-mode");
  });
</script>

<JitsiUser admin />
