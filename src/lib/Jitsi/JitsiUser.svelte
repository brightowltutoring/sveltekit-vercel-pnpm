<script>
  export let admin; // existence prop; used for '/classroomA' route

  import "$lib/Jitsi/jitsi_api";
  // using local copy of jitsi api instead of external link, imported via svelte:head tag (e.g. using: src="https://meet.jit.si/external_api.js")

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { lessThan768 } from "$lib/store";

  async function hangUpBtn() {
    await api.dispose();
    // await api.executeCommand("hangup");
    // await api.executeCommand("endConference");
    goto("/");
  }

  let api, par;
  let domain = "meet.jit.si";
  let options = {
    roomName: "ThinkSolve122822",
    configOverwrite: {
      startWithAudioMuted: true,
      startWithVideoMuted: true,
      // startWithVideoMuted: admin ? true : false,
      disabledSounds: [
        "ASKED_TO_UNMUTE_SOUND",
        "E2EE_OFF_SOUND",
        "E2EE_ON_SOUND",
        "INCOMING_MSG_SOUND",
        "KNOCKING_PARTICIPANT_SOUND",
        "LIVE_STREAMING_OFF_SOUND",
        "LIVE_STREAMING_ON_SOUND",
        "NO_AUDIO_SIGNAL_SOUND",
        "NOISY_AUDIO_INPUT_SOUND",
        "OUTGOING_CALL_EXPIRED_SOUND",
        "OUTGOING_CALL_REJECTED_SOUND",
        "OUTGOING_CALL_RINGING_SOUND",
        "OUTGOING_CALL_START_SOUND",
        "PARTICIPANT_JOINED_SOUND",
        "PARTICIPANT_LEFT_SOUND",
        "RAISE_HAND_SOUND",
        "REACTION_SOUND",
        "RECORDING_OFF_SOUND",
        "RECORDING_ON_SOUND",
        "TALK_WHILE_MUTED_SOUND",
      ],

      // TODO: do these actually do what I expect?
      hideConferenceTimer: !admin && true,
      hideConferenceSubject: !admin && true,
      hideParticipantsStats: !admin && true,
      // disablePolls: admin ? false : true,
      disablePolls: !admin && true,
      disableSelfView: !admin && true,
      // disableSelfViewSettings: true,
      deeplinking: { disabled: true }, // ADDED DEC 23,2022 as 'disableDeepLinking: true' stopped working in order to block 'add app/extension' in iframe on mobile
      disableRemoteMute: !admin && true,
      notifications: !admin && ["lobby.notificationTitle"],
      // TODO: still don't understand logic, but works; result: only admin can allow users in
      remoteVideoMenu: !admin && {
        disabled: true,
        // disableKick: true,
        // disablePrivateChat: true,
        // disableGrantModerator: true,
      },

      // TODO: get request still grabs all this mp3 data ... id rather not fetch this instead of disabling
    },
    interfaceConfigOverwrite: {
      // DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      DEFAULT_BACKGROUND: `#130e21`,
      SHOW_CHROME_EXTENSION_BANNER: false,
      VIDEO_QUALITY_LABEL_DISABLED: !admin && true,
      SETTINGS_SECTIONS: [
        "devices",
        admin && "moderator",
        admin && "language",
        admin && "profile",
        admin && "calendar",
        admin && "sounds",
      ],
      TOOLBAR_BUTTONS: [
        "desktop",
        "microphone",
        "camera",
        "fullscreen",
        "chat",
        "fodeviceselection",
        "etherpad",
        admin && "noisesuppression",
        admin && "settings",
        admin && "mute-video-everyone",
        admin && "mute-everyone",
        admin && "security",
        admin && "sharedvideo",
        admin && "videoquality",
        admin && "profile",
        admin && "raisehand",
        admin && "livestreaming",
        admin && "recording",
        admin && "closedcaptions",
        admin && "filmstrip",
        admin && "feedback",
        admin && "stats",
        admin && "shortcuts",
        admin && "tileview",
        // "hangup",
      ],
    },
  };

  // let changeOpacityTo100;

  onMount(() => {
    // setTimeout(() => {
    //   changeOpacityTo100 =
    //     "opacity-100 transition-opacity duration-500 ease-in-out";
    // }, 1000);
    try {
      // can only access dom element ("#meet") after 'onMount' ... therefore have to add this to the options object HERE before instantiating the jitsi api
      options.parentNode = document.querySelector("#meet");

      api = new JitsiMeetExternalAPI(domain, options);

      const pwd = "thnkslv";
      api.addEventListener("participantRoleChanged", function (event) {
        if (event.role === "moderator") {
          api.executeCommand("password", pwd);
          api.executeCommand("toggleLobby", true);
        }

        par = [...api.getParticipantsInfo()];
      });
    } catch (error) {
      console.log("onMount for JitsiMeetExternalAPI broken", error);
    }
  });
</script>

<div
  id="meet"
  class={`relative md:-translate-y-10 -translate-y-36 w-full h-[90vh] md:h-[670px]`}
  >
  <!-- class={`relative md:-translate-y-10 -translate-y-36 w-full h-[90vh] md:h-[670px] opacity-0 ${changeOpacityTo100}`} -->
  <button on:click={hangUpBtn}>
    <img
      alt="hangup button"
      class="absolute p-2 {!par && 'opacity-0'} {$lessThan768
        ? 'top-10 right-0'
        : 'bottom-5 right-10 '}  w-[50px] rounded-full content-[url('/phone.svg')] bg-[#2a1c44]  active:bg-red-900 rotate-90 hover:scale-[1.3] hover:rotate-0 transition-transform duration-300"
    />
  </button>
</div>
