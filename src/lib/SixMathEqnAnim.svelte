<script>
  import K from "$lib/Katex.svelte";
  import { isDarkMode } from "$lib/store";
  import { blur, scale, fly, fade } from "svelte/transition";
  import { elasticOut, quintOut } from "svelte/easing";
  let equations = [
    "\\int_{M}d\\omega=\\int_{\\partial M}\\omega",
    "G_{\\mu\\nu}\\,+\\,\\Lambda g_{\\mu\\nu}\\,=\\,\\kappa T_{\\mu\\nu}",
    " (i\\hbar\\gamma^\\mu \\partial_\\mu  - mc) \\ \\psi = 0 ",
    "\\left\\langle{e^{-\\beta\\,W}}\\right\\rangle = \\,{e^{-\\beta\\,\\triangle\\,F}}",
    "z_{n+1}\\,=\\,z_{n}^{2}\\,+\\,c",
    "e^{i x}=\\cos x+i\\sin x",
  ];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
  {#each equations as eqn, i}
    <!-- note: the animation speeds up since the delay is given by a log function ...
    and the change in logarithm DECREASES with increasing input (subsequent delays get smaller)-->
    <p
      class={$isDarkMode ? "text-blue-100" : "text-indigo-900"}
      in:scale={{
        delay: 350 * Math.log(i + 1),
        easing: quintOut,
        duration: 1000,
      }}
    >
      <K d m={eqn} />
    </p>
  {/each}
</div>
