import { auth } from "$lib/Login/firebase";
import { goto } from "$app/navigation";

// import { get } from "svelte/store";
// import { lessThan768 } from "$lib/store";
// import { isRunningStandalone } from "$lib/utils";

export function regexEmailChecker(EMAIL) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(EMAIL);
}
export function regexPhoneChecker(PHONE) {
  return /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(PHONE);
}

export async function magicLinkToEmail(EMAIL) {
  // const auth = await import("$lib/Login/firebase");
  const {
    sendSignInLinkToEmail,
    // EmailAuthProvider
  } = await import("firebase/auth");

  await sendSignInLinkToEmail(auth, EMAIL, {
    url: "https://thinksolve.io/",
    handleCodeInApp: true,
  })
    .then(() => {
      window.localStorage.setItem("emailForSignIn", EMAIL);
      console.log("success with sendSignInLinkToEmail!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errorCode", errorCode);
      console.log("errorMessage", errorMessage);
    });
}

// nov29.2022 : google login didnt work with 'signInWithRedirect' logic, so assuming the same for twitter login .. getting rid of the if-else logic and keeping only the 'signInWithPopup' logic
// UPDATE:  dec17,2022: 'https://firebase.google.com/docs/auth/web/redirect-best-practices' explains how and why 'signInWithRedirect' fails .. seems like just using 'signInWithPopup' is easiest option
export async function TwitterLogin() {
  // const auth = await import("$lib/Login/firebase");

  const { TwitterAuthProvider, browserPopupRedirectResolver } = await import(
    "firebase/auth"
  );
  const provider = new TwitterAuthProvider();

  // if (get(lessThan768)) {
  // if (isRunningStandalone()) {
  //   const { signInWithRedirect } = await import("firebase/auth");
  //   signInWithRedirect(auth, provider, browserPopupRedirectResolver)
  //     .then((result) => {
  //       // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
  //       // You can use these server side with your app's credentials to access the Twitter API.
  //       const credential = TwitterAuthProvider.credentialFromResult(result);
  //       const token = credential.accessToken;
  //       const secret = credential.secret;

  //       // The signed-in user info.
  //       const user = result.user;
  //       // ...
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = TwitterAuthProvider.credentialFromError(error);
  //       // ...
  //     });
  // } else {
  const { signInWithPopup } = await import("firebase/auth");
  signInWithPopup(auth, provider, browserPopupRedirectResolver)
    .then((result) => {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret;

      // The signed-in user info.
      const user = result.user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = TwitterAuthProvider.credentialFromError(error);
      // ...
    });
  // }
}

// TODOnov29.2022 noticed that 'signinWithRedirect' logic did not sign me in ... furthermore 'signInWithPopup' worked perfectly on both the PWA and on the mobile version of the website ... It appears firebase has consolidated the two??
// UPDATE:  dec17,2022: 'https://firebase.google.com/docs/auth/web/redirect-best-practices' explains how and why 'signInWithRedirect' fails .. seems like just using 'signInWithPopup' is easiest option
export async function GoogleLogin() {
  // const auth = await import("$lib/Login/firebase");

  const {
    GoogleAuthProvider,
    // setPersistence,
    // browserSessionPersistence,
    // inMemoryPersistence,
    browserPopupRedirectResolver,
  } = await import("firebase/auth");

  const provider = new GoogleAuthProvider();

  // if (get(lessThan768)) {
  // if (isRunningStandalone()) {
  //   const { signInWithRedirect } = await import("firebase/auth");
  //   signInWithRedirect(auth, provider, browserPopupRedirectResolver)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential.accessToken;
  //       // The signed-in user info.
  //       const user = result.user;
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //     });
  // } else {
  const { signInWithPopup } = await import("firebase/auth");

  // setPersistence(auth, browserSessionPersistence).then(() => {
  signInWithPopup(auth, provider, browserPopupRedirectResolver)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  // }); // set persistence block
  // }
}

export async function generateRecaptchaVerifier(RECAPTCHA_CONTAINER_ID) {
  const { RecaptchaVerifier } = await import("firebase/auth");

  // Could also do 'window.recaptchaVerifier = new RecaptchaVerifier ..' and return nothing, however using this function modularly elsewhere it is more readable to return the desired 'verifier' variable as the output of this called function
  const recaptchaVerifier = new RecaptchaVerifier(
    RECAPTCHA_CONTAINER_ID,
    {
      size: "invisible",
      callback: (response) => {},
    },
    auth
  );

  return recaptchaVerifier;
}

export async function sendCodeToPhone(PHONE_NUMBER, RECAPTCHA_VERIFIER) {
  const { setPersistence, browserSessionPersistence, signInWithPhoneNumber } =
    await import("firebase/auth");

  // dec1,2022: added this unchecked 'setPersistence' wrapper to log user out once the session is closed; for phone authentication this is desirable to discourage multiple people sharing one account

  setPersistence(auth, browserSessionPersistence).then(() => {
    signInWithPhoneNumber(auth, PHONE_NUMBER, RECAPTCHA_VERIFIER)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
      });
  }); // setPersistence block
}

// export function verifySMSCode(SMS_CODE, e) {
// let clickOrEnterFired = e.type == "click" || e.key == "Enter";
export function verifySMSCode(SMS_CODE) {
  let code = SMS_CODE;
  let confirmationResult = window.confirmationResult;

  // sms code is 6 digits-long as of dec1,2022
  // if (clickOrEnterFired && code.length >= 5 && confirmationResult) {
  if (code.length >= 6 && confirmationResult) {
    confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        // const user = result.user;
        // ...
        console.log("result", result);
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        console.log("error", error);
      });
  }
}

export async function logoutFunction() {
  const { signOut } = await import("firebase/auth");
  signOut(auth)
    .then(() => {
      console.log("logged out");
      goto("/");
    })
    .catch((error) => {
      console.log("logoutFunction failed", error);
    });
}
