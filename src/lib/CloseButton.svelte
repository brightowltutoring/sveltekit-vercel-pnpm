<script>
  import { elementColor, showLoginModal, isDarkMode } from "$lib/store";
</script>

<close-button
  style={`border-color:${$elementColor}`}
  class="hover:scale-125 duration-300 rounded-full p-4 flex justify-center items-center border {$isDarkMode
    ? 'bg-[#8f86b8] '
    : 'bg-red-200'}  "
  on:click={() => {
    $showLoginModal = false;
  }}
  on:keydown={() => {
    $showLoginModal = false;
  }}
>
  <div
    class="absolute w-1/2 h-[2px] rounded rotate-45"
    style={`background:${$elementColor}`}
  />
  <div
    class="absolute w-1/2 h-[2px] rounded -rotate-45"
    style={`background:${$elementColor}`}
  />
</close-button>
