<script>
  // Since this entire component is lazyMounted, I don't have to dynamically import modules (e.g. inside the hydrateDropzoneDomEls 'inview callback function')
  import Dropzone from "dropzone";
  import "$lib/Dropzone/dropzone.css";

  import { PUBLIC_UPLOAD_ENDPOINT } from "$env/static/public";
  // const PUBLIC_UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT;

  import PostDummyOnce from "$lib/Dropzone/PostDummyOnce.svelte";

  import InView from "$lib/Wrappers/InView.svelte";
  import {
    // isDarkMode,
    showHomeworkModal,
  } from "$lib/store";
  // $: boxShadowColor = $isDarkMode ? "#1d1c43" : "#ddd";

  // Alternative to the vanilla-y eventListener logic commented out above.
  // TODO: Note: using {once:true} inside an event listener attached to 'querySelector('a[href="/homework"]')' would not produce the desired of effect of firing 'dropzonePopUpOnce()' once per SESSION ... since when the component is destroyed between route changes so too is the logic in this .svelte file. The work around is done with the global variable logic inside 'dropzonePopUpOnce()'
  $: $showHomeworkModal && dropzonePopUpOnce();

  export let text = "🔥";
  export let textSizeTW = "text-3xl";
  export let dimensionsTW = "w-[65vw] sm:w-[60vw] h-[60vh]";
  export let brightnessTW = "brightness-100";
  let dropzone;

  async function hydrateDropzoneDomEls(target) {
    console.log("drop it like its 🌶️");

    dropzone = new Dropzone(target, {
      url: PUBLIC_UPLOAD_ENDPOINT,
      acceptedFiles: ".heic,.jpeg,.jpg,.png,.txt,.pdf,.docx,.doc",
    });

    dropzoneHandleErroredUploads();
  }

  // Collect 'errored' files, which are of the acceptable type ... and reprocess files when internet comes back.
  // Tested use cases: internet cuts out mid-upload, and internet off when upload started.
  function dropzoneHandleErroredUploads() {
    let filesToRetry = [];
    dropzone.on("error", (file) => file.accepted && filesToRetry.push(file));

    dropzone.on("queuecomplete", () => {
      setTimeout(() => ($showHomeworkModal = false), 1000);
    });

    window?.addEventListener("online", () => {
      if (filesToRetry.length > 0) {
        for (const file of filesToRetry) {
          dropzone.processFile(file);

          // removes error mark css after the files have been processed
          file.previewElement.querySelector(".dz-error-mark").style.visibility =
            "hidden";
          // removes error message css after the files have been processed
          file.previewElement.querySelector(
            ".dz-error-message"
          ).style.visibility = "hidden";
        }

        // reset collected files array when done
        filesToRetry.length == 0;
      }
    });
  }

  function dropzonePopUpOnce() {
    // This code fires once since 'globalThis.popUpOnceBoolean' starts out as undefined, then switched to true inside
    if (!globalThis.popUpOnceBoolean) {
      setTimeout(() => {
        document
          .querySelector(".dropzone")
          .dispatchEvent(new CustomEvent("click"));
      }, 75);
      globalThis.popUpOnceBoolean = true;
    }
  }
</script>

<PostDummyOnce />

<!-- <input
      style="text-align: center"
      type="text"
      id="gdf"
      name="gdf"
      placeholder="1nQLtENA2318gXFsNbPklccxA-oz8Anfz"
    /> -->
<InView
  single
  onview={(target) => hydrateDropzoneDomEls(target)}
  once
  margin={"0px"}
>
  <!-- style="box-shadow: inset 0 -10px 10px {boxShadowColor}; border-radius: 50px; border-color: transparent; background-color: transparent" -->
  <form
    method="post"
    class="dropzone flex justify-center items-center flex-wrap overflow-scroll backdrop-blur-3xl {brightnessTW} {textSizeTW} {dimensionsTW} mx-auto group"
  >
    <div
      class="dz-message font-Nunito group-hover:animate-pulse"
      data-dz-message
    >
      {text}
    </div>
  </form>
</InView>

<style>
  /* Oddly without specifying this css as global, the white background on uploaded images isn't removed for all dropzone instances (e.g. for the nav modal dropzone)  */
  :global(.dropzone .dz-preview.dz-image-preview) {
    background-color: transparent !important;
  }

  :root {
    --light-box-shadow-color: #ddd;
    --dark-box-shadow-color: #1d1c43;
  }
  form {
    box-shadow: inset 0 -10px 10px var(--light-box-shadow-color);
    border-radius: 50px;
    border-color: transparent;
    background-color: transparent;
  }

  :global(body.dark-mode) form {
    box-shadow: inset 0 -10px 10px var(--dark-box-shadow-color);
  }
</style>
