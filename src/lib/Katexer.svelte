<!-- currently, this component has to be used in conjunction with KatexDataProp component,
where the myKatexEntries class element is used... 
-->
<script>
  import katex from "katex";
  import { onMount } from "svelte";

  onMount(() => {
    let myKatexEntries = document.querySelectorAll("[k]");
    let observer = new IntersectionObserver(callback, {
      root: null,
      threshold: 0,
      rootMargin: "200px",
      // rootMargin: "-200px", //shows the lag effect
    });
    for (let el of myKatexEntries) {
      observer.observe(el);
    }

    // definition of callback; entries is a placeholder for myKatexEntries element array
    function callback(entries, observer) {
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

<!-- TODO: NOTE: Using the data on https://www.intmath.com/cg5/katex-mathjax-comparison.php, 
the body of which has a clientHeight of 9701 pixels, it takes 382ms to render the 
latex for the document — i.e. a render rate of 25000 pixels per second.

On my laptop the viewport on brave is ~800 pixels (i.e. window.innerHeight) — in other words 
the previous render rate is about 3 pages of latex per second, on my laptop.
-->

<!-- TODO: append this on the first observation event and check to not re-append -->
<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css"
    integrity="sha384-bYdxxUwYipFNohQlHt0bjN/LCpueqWz13HufFEV1SUatKs1cm4L6fFgCi1jT643X"
    crossorigin="anonymous"
  />
</svelte:head>
