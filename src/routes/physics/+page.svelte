<script>
  import E from "$lib/e-and-m.svx";
  import { isDarkMode } from "$lib/store";
  $: proseInvert = $isDarkMode ? "prose-invert" : "";
</script>

<div class="prose lg:prose-lg {proseInvert}">
  <E />
</div>
