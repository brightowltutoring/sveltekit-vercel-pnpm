<script>
  import katex from "katex";
  import { onMount } from "svelte";

  onMount(() => {
    // window.addEventListener("popstate", () => {
    //   MathJax.typeset();
    // });

    // mathjax observer
    let mathjaxObserver = new IntersectionObserver(callback1, {
      root: null,
      threshold: 0,
      rootMargin: "0px",
    });

    let myMathjaxEntries = document.querySelectorAll("[m]");

    // lazy renders all math greater than 800 pixels from top
    // immediately renders otherwise
    for (let e of myMathjaxEntries) {
      if (e.offsetTop > 800) {
        mathjaxObserver.observe(e);
      } else {
        let d = e.hasAttribute("d");
        let m = e.getAttribute("m");
        e.style.color = "orange";
        e.innerHTML = d ? `$$ ${m} $$` : `$ ${m} $`;
      }
    }

    function callback1(entries, observer) {
      for (let e of entries) {
        if (e.isIntersecting) {
          // console.log(e.target.offsetTop);
          let target = e.target;
          let d = target.hasAttribute("d");
          let m = target.getAttribute("m");
          target.innerHTML = d ? `$$ ${m} $$` : `$ ${m} $`;
          MathJax.typeset([target]);

          observer.unobserve(target);
        }
      }
    }

    // katex observer
    let myKatexEntries = document.querySelectorAll("[k]");

    let katexObserver = new IntersectionObserver(callback2, {
      root: null,
      threshold: 0,
      rootMargin: "500px",
      // rootMargin: "-200px", //shows the lag effect
    });
    for (let el of myKatexEntries) {
      katexObserver.observe(el);
    }

    // definition of callback; entries is a placeholder for myKatexEntries element array
    function callback2(entries, observer) {
      for (let entry of entries) {
        if (!entry.isIntersecting) {
          return;
        }
        // code below done when IS intersecting

        let target = entry.target;
        // console.log(target);
        let k = target.getAttribute("k");
        let d = target.hasAttribute("d");
        katex.render(k, target, { displayMode: d });

        observer.unobserve(entry.target);
      }
    }
  });
</script>

<!-- This file lazy renders both mathjax and katex math based on either one of two custom HTML
properties ... as  used in the querySelectors below
-->

<svelte:head>
  <!-- katex part -->
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css"
    integrity="sha384-bYdxxUwYipFNohQlHt0bjN/LCpueqWz13HufFEV1SUatKs1cm4L6fFgCi1jT643X"
    crossorigin="anonymous"
  />

  <!-- mathjax part -->
  <script>
    MathJax = {
      // startup: { typeset: false },
      // startup: { elements: ["[m]"] },
      loader: { load: ["[tex]/physics", "[tex]/cancel"] },
      tex: {
        packages: {
          "[+]": ["physics", "cancel"],
        },
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"],
        ],
      },
      svg: {
        fontCache: "global",
      },
    };
  </script>
  <script
    type="text/javascript"
    id="MathJax-script"
    async
    src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js">
  </script>
</svelte:head>
