<script>
  import { GoogleLogin } from "$lib/Login/loginFunctions";
  import { isDarkMode } from "$lib/store";
  import IconGoogle from "$lib/Icons/LoginIcons/IconGoogle.svelte";
  // import {pre}
</script>

<button
  on:keydown={GoogleLogin}
  on:click={GoogleLogin}
  class="group mb-6  bg-[#4285f4]  hover:shadow-md hover:scale-[1.01] duration-200 rounded-md p-4 {$isDarkMode
    ? 'group-hover:bg-opacity-90'
    : 'group-hover:bg-opacity-90'}  text-white  flex w-full justify-center items-center gap-5"
>
  <span class="group-hover:scale-[1.15] duration-500">
    <IconGoogle />
    <!-- {@html `<svg height="24" width="24">
      <path fill="${$isDarkMode ? "black" : "white"}"
        d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1Z"
      />
    </svg>`} -->
  </span>
  <!-- <span class="font-bold">Sign-in with Google</span> -->
  <span>Sign-in with Google</span>
</button>
