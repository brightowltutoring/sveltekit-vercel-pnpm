<script>
  let smsCode;
  let countryCode = "+1";

  import {
    regexPhoneChecker,
    generateRecaptchaVerifier,
    sendCodeToPhone,
    verifySMSCode,
  } from "$lib/Login/loginFunctions";
  import IconPhone from "$lib/Icons/LoginIcons/IconPhone.svelte";
  import { isDarkMode } from "$lib/store";

  let phoneCodeSent = false;
  let emptyPhoneInputAnimated;
  $: shortPing = !phoneCodeSent && emptyPhoneInputAnimated && "animate-ping";

  let sendPhoneCodeBtn;
  let phoneField;
  let phoneFieldValue = "";
  let isPhoneNumber = false;

  async function submitPhoneNumber(e) {
    // phoneInputVisible alone allows for immediate change in dom; globalThis.phoneInputVisible allows for persistence given that the component is destroyed (logincard is destroyed when modal closes)
    phoneInputVisible = globalThis.phoneInputVisible = true;

    let clickOrEnterFired = e.type == "click" || e.key == "Enter";

    if (clickOrEnterFired && phoneFieldValue == "") {
      emptyPhoneInputAnimated = true;
      setTimeout(
        () => (emptyPhoneInputAnimated = !emptyPhoneInputAnimated),
        100
      );
    }
    if (clickOrEnterFired && isPhoneNumber) {
      let formattedPhoneNumber =
        countryCode + phoneFieldValue.replace(/\D/g, "");

      let recaptchaVerifier = await generateRecaptchaVerifier(
        "recaptcha-container"
      );
      sendCodeToPhone(formattedPhoneNumber, recaptchaVerifier);

      phoneStatusMessage.style.display = "block";
      phoneStatusMessage.innerHTML = `Code sent to ${formattedPhoneNumber} `;

      phoneField.style.opacity = "0.5";
      phoneField.style.pointerEvents = "none";

      sendPhoneCodeBtn.style.opacity = "0.5";
      sendPhoneCodeBtn.style.pointerEvents = "none";

      phoneCodeSent = true;
    }
  }

  function onInputPhoneField(PHONE) {
    isPhoneNumber = regexPhoneChecker(PHONE);
    if (PHONE == "") {
      phoneField.style.border = "1px solid #aaa";
      phoneField.style.color = "#aaa";
      phoneField.style.fontSize = "16px";
    } else if (!isPhoneNumber) {
      phoneField.style.border = "1.5px solid red";
      phoneField.style.color = "red";
      phoneField.style.fontSize = "20px";
    } else if (isPhoneNumber) {
      phoneField.style.border = "2px solid #59d0ae";
      phoneField.style.backgroundColor = "white";
      phoneField.style.color = "#10bb8a"; // green-ish colour
    }
  }

  // import { browser } from "$app/environment";
  // $: phoneInputVisible = browser && window.phoneInputVisible;
  // phoneInputVisible controls the visibility of an input dom element; starts as false, but then persisted as true even when the component is destroyed ...thanks to storing the truthiness globally in window.phoneInputVisible (which is set to true on an onclick). Note: using 'window.phoneInputVisible' alone does not update DOM immediately (updates only on the next closing-openining of the modal), therefore need phoneInputVisible as well.

  // Update: using the modern 'globalThis' instead of 'window' means I don't need to use the sveltekit browser check
  let phoneInputVisible = globalThis.phoneInputVisible;
</script>

<!-- dec1,2022: changed 'button' to div ..since it flashes through the hidden modal on pageload -->
{#if !phoneCodeSent}
  <button
    bind:this={sendPhoneCodeBtn}
    on:click={submitPhoneNumber}
    class=" group bg-rose-400 hover:scale-[1.01]  hover:shadow-md  duration-200 rounded-md p-4 {$isDarkMode
      ? 'group-hover:bg-opacity-80'
      : 'group-hover:bg-opacity-80'}  text-white flex w-full justify-center items-center gap-5"
  >
    <span class="group-hover:scale-[1.15] duration-500">
      <IconPhone />
    </span>
    <!-- <span class="font-bold">Get SMS Code</span> -->
    <span>Get SMS Code</span>
  </button>

  <div class="grid grid-cols-6 w-full text-black">
    {#if phoneInputVisible}
      <input
        bind:value={countryCode}
        class="col-span-1 text-center p-3 mt-3 focus:outline-none border-r-2"
      />
      <input
        on:keydown={(e) => submitPhoneNumber(e)}
        on:paste={onInputPhoneField(phoneFieldValue)}
        on:keyup={onInputPhoneField(phoneFieldValue)}
        bind:this={phoneField}
        class="col-span-5 text-center p-3 mt-3 focus:outline-none {shortPing}"
        bind:value={phoneFieldValue}
        type="phone"
        placeholder="phone"
      />
    {/if}
  </div>
{/if}

<div id="recaptcha-container" />
<div
  id="phoneStatusMessage"
  class="p-3 font-Poppins {$isDarkMode ? 'text-lime-100' : 'text-rose-600'}"
/>

{#if phoneCodeSent}
  <!-- {#if true} -->
  <div class="grid grid-cols-3 pb-5">
    <!-- on:keydown={(e) => verifySMSCode(smsCode, e)} -->
    <!-- col-span-2 -->
    <input
      on:keyup={verifySMSCode(smsCode)}
      on:paste={verifySMSCode(smsCode)}
      bind:value={smsCode}
      class="col-span-3 text-center p-3 mt-3 focus:outline-none "
      placeholder="enter sms code"
    />

    <!-- <button
    on:click={(e) => verifySMSCode(smsCode, e)}
      class="col-span-1 text-center p-3 mt-3 bg-rose-300 text-white font-bold"
      >Enter
    </button> -->
  </div>
{/if}
