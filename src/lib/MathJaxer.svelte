<script>
  import { onMount } from "svelte";

  onMount(() => {
    let observer = new IntersectionObserver(callback, {
      root: null,
      threshold: 0,
      rootMargin: "0px",
    });

    let myMathJaxEntries = document.querySelectorAll("[m]");

    // lazy renders all math greater than 2000 pixels from top
    // immediately renders otherwise
    for (let e of myMathJaxEntries) {
      if (e.offsetTop > 800) {
        observer.observe(e);
      } else {
        let d = e.hasAttribute("d");
        let m = e.getAttribute("m");
        e.style.color = "yellow";
        e.innerHTML = d ? `$$ ${m} $$` : `$ ${m} $`;
      }
    }

    function callback(entries, observer) {
      for (let e of entries) {
        if (e.isIntersecting) {
          let target = e.target;
          let d = target.hasAttribute("d");
          let m = target.getAttribute("m");
          target.innerHTML = d ? `$$ ${m} $$` : `$ ${m} $`;
          MathJax.typeset([target]);

          observer.unobserve(target);
        }
      }
    }
  });
</script>

<svelte:head>
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
  <!-- <script
    type="text/javascript"
    id="MathJax-script"
    async
    src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js">
  </script> -->
  <script
    id="MathJax-script"
    async
    src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</svelte:head>
