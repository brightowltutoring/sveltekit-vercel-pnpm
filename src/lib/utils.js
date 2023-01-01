import { browser } from "$app/environment";
import { scale } from "svelte/transition";

// export function persistDarkModeFromLastSession() {
//   const isDarkModeLS = localStorage.getItem("isDarkModeLS").toString();

//   if (isDarkModeLS == "true") {
//     document.body.classList.add("dark-mode");
//   } else {
//     document.body.classList.remove("dark-mode");
//   }
// }

// modified on nov29,2022 from: https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
// TODO: might need to add 'browser &&' if this function is not called inside an onMount
// TODO: on xcode simulator the ipad 10th and ipad air 5th returns as 'macos' not 'ios'
export function getOS() {
  let userAgent = browser && navigator.userAgent;
  let platform = browser && navigator.platform;
  let macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  let windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  let iosPlatforms = ["iPhone", "iPad", "iPod"];
  let os = null;

  // if (macosPlatforms.indexOf(platform) !== -1) {
  if (macosPlatforms.includes(platform)) {
    os = "Mac OS";
  } else if (iosPlatforms.includes(platform)) {
    os = "iOS";
  } else if (windowsPlatforms.includes(platform)) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (/Linux/.test(platform)) {
    os = "Linux";
  }

  // alert(os);
  return os;
}

export function disableZoomGestures() {
  for (let eventName of ["gesturestart", "dblclick"]) {
    browser &&
      document.addEventListener(eventName, (e) => {
        e.preventDefault();
        return false;
      });
  }
}

export function isRunningStandalone() {
  return browser && window.matchMedia("(display-mode: standalone)").matches;
}

// custom easing functions
export function scaleYN(node, args) {
  return args.noTransition ? null : scale(node, args);
  // This conditionally returns scale or no transition
  // Alternatively can use the following code to produce the same effect:
  //  <div
  //     in:scale={{
  //       duration: noTransition ? 0 : 1000,
  //       delay: noTransition ? 0 : 100 * i,
  //       easing: elasticOut,
  //     }}
  //     >
  //   </div>
}

// export function moduloScale(node, {easing = elasticOut, duration = 1000}) {

//   return {
//     easing,
//     duration,
//     css: (t,u) =>
//     ` filter: hue-rotate(${10*u}turn) blur(${t*4}px);
//     `
//   }
// }

export function customEase(t) {
  // supercon function
  // let a = 0.344
  // let b = 1.4
  // let a = 1
  // let b = 2.7
  // return b*Math.exp(-a/t)

  // curtain effect created on: https://www.desmos.com/calculator/kr2w0zv092
  // return 2*Math.tanh(t)*Math.sin(8*t)

  let u = t;
  return (1 / 8) * (8 * u) * Math.sin(8 * u); // less dramatic takeoff

  // ... i think this reproduces sineOut svelte easing
  // let τ = 4
  // return Math.sin( (2 * Math.PI / τ ) * t );
  // with period of 4, goes from 0 to 1 when t∈[0,1]

  // step function
  // if (t < 0.3) return 0;
  // if (t < 0.6) return 0.3;
  // if (t < 0.9) return 0.6;
  // return 1;
}

export function customFade(
  node,
  { delay = 0, easing = elasticOut, duration = 3000 }
) {
  return {
    delay,
    easing,
    duration,
    css: (t, u) =>
      ` opacity: ${0.8 * u + t};
        filter: hue-rotate(${0.15 * u}turn) 
                blur(${u}px);
      `,
  };
}

export function slider(
  node,
  { X = 0, Y = -100, easing = quintOut, duration = 300 }
) {
  return {
    X,
    Y,
    easing,
    duration,
    css: (t, u) =>
      ` transform: translate(${X * u}px, ${Y * u}px);
        opacity: ${t};
      `,
  };
}

// As of nov18 2022, dynamically importing css failed for dropzone.css when combining with InView.svelte; this seems to be a known bug with vite (https://github.com/vitejs/vite/issues/4237; I updated vite as well) and 'npm run prod' as things works fine on 'npm run dev'. Either way the code here is straightforward, vanilla way of achieving dynamic import of js/css should module bundlers fail awkwardly.
export function cssToHead(id = "dropzoneCSS", path = "/dropzone.css") {
  if (!document.getElementById(id)) {
    const element = document.createElement("link");
    element.id = id;
    element.href = path;
    element.rel = "stylesheet";
    document.head.appendChild(element);
  }
}
export function jsToHead(
  id = "calendlyJS",
  path = "external-website.com/calendly.js"
) {
  if (!document.getElementById(id)) {
    const element = document.createElement("script");
    element.id = id;
    element.src = path;
    element.type = "text/javascript";
    document.head.appendChild(element);
  }
}
