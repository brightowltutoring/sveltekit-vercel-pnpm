<script>
  export let navIconClicked;
  $: navIconClickedFill = navIconClicked && "fill-rose-300";
  // navIconClicked && (!$isDarkMode ? "fill-rose-300" : "fill-indigo-200");

  import { isDarkMode } from "$lib/store.js";
  $: fillColor = $isDarkMode ? "white" : "black";

  let size = 204.376;
</script>

<!-- I have no idea why 1/7 here ends up with the icon centered in the navbar -->

<svg height={size / 7} width={size / 7} viewBox="0 0 {size} {size}">
  <path
    class={navIconClickedFill}
    fill={fillColor}
    d="M171.247,204.376c2.484,0,4.5-2.015,4.5-4.5V61.35h-51.744c-7.502,0-13.605-6.107-13.605-13.614V0H33.13
	c-2.485,0-4.5,2.015-4.5,4.5v195.376c0,2.485,2.015,4.5,4.5,4.5H171.247z M74.999,94.627h79.5v10h-79.5V94.627z M74.999,119.627
	h79.5v10h-79.5V119.627z M74.999,144.626h79.5v10h-79.5V144.626z M57.999,92.627c3.865,0,7,3.134,7,7s-3.135,7-7,7s-7-3.134-7-7
	S54.134,92.627,57.999,92.627z M57.999,117.627c3.865,0,7,3.134,7,7s-3.135,7-7,7s-7-3.134-7-7S54.134,117.627,57.999,117.627z
	 M57.999,142.626c3.865,0,7,3.134,7,7c0,3.866-3.135,7-7,7s-7-3.134-7-7C50.999,145.761,54.134,142.626,57.999,142.626z
	 M120.397,47.736V10.396l43.802,40.953h-40.196C122.014,51.35,120.397,49.729,120.397,47.736z"
  />
</svg>
