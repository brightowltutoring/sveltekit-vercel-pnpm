<script>
  import {
    scrollY,
    lastScrollY,
    burgerBreakPoint,
    instDeltaY,
  } from "$lib/store";

  // export let hamburgerBtn
  export let mobileOpen;
  export let unique;
  // TODO: this variable only used in parent component ... not here

  function clickOnBurger() {
    mobileOpen = !mobileOpen;
    unique = !unique;

    // stores the last scroll position on hamburger open
    mobileOpen && ($lastScrollY = $scrollY);
    // ... then scrolls to this position on hamburger closed
    !mobileOpen &&
      requestAnimationFrame(() => window.scrollTo(0, $lastScrollY));
  }

  const hamburgerWidth = 35;
  const hamburgerHeight = Math.floor(0.7 * hamburgerWidth); // 24px
  const hamburgerPattyHeight = 2;
  const translY = Math.floor(0.5 * (hamburgerHeight - hamburgerPattyHeight)); // 11px
  const angle = 45 + 1 * 90;
  const hamburgerColor = "bg-red-500"; //bg-gray-500
  // let hamburgerBtn
  let variableTop = "top-6";
  $: if ($burgerBreakPoint && !mobileOpen) {
    // if($scrollY<250) variableTop = "top-6"
    if ($instDeltaY > 0 && $scrollY > 250) variableTop = "-top-20 ";
    if ($instDeltaY < 0 && $scrollY > 250) variableTop = "top-6";
  }
  // $: if($burgerBreakPoint && mobileOpen ) variableTop = "top-6"
</script>

<main>
  <!-- version: tailwind + svelte style (css) + js variables (~20 lines code)-->
  <!-- class="md:hidden z-50 text-4xl fixed right-6 {variableTop} transition-all duration-300" -->
  <hamburger-container
    class="md:hidden z-50 text-4xl fixed right-6 {variableTop} transition-all duration-300"
  >
    <hamburger
      style="width: {hamburgerWidth}px; height:{hamburgerHeight}px"
      class="relative flex flex-col justify-between"
      on:click={clickOnBurger}
    >
      <div
        style="height:{hamburgerPattyHeight}px; {mobileOpen &&
          `transform: translateY(${translY}px) rotate(-${angle}deg)`}
            "
        class="{hamburgerColor} transition duration-300 rounded "
      />

      <div
        style="height:{hamburgerPattyHeight}px;  {mobileOpen &&
          `transform: scale(0)`}"
        class="{hamburgerColor} transition duration-300 rounded"
      />

      <div
        style="height:{hamburgerPattyHeight}px; {mobileOpen &&
          `transform: translateY(-${translY}px) rotate(${angle}deg)`} "
        class=" {hamburgerColor} transition duration-300 rounded "
      />
    </hamburger>
  </hamburger-container>

  <!-- TODO: hamburger doesn't close on clicking some nav links -->
  <!-- version: tailwind + css variables (~28 lines code) -->
  <!-- <style>
            :root{
                    --hamburgerWidth: 35px;
                    --hamburgerHeight: calc( var(--hamburgerWidth) * 0.7 );
                    --hamburgerPattyHeight: 2px;
                    --translY: calc( 0.5 * (var(--hamburgerHeight) - var(--hamburgerPattyHeight))  );
                    --angle: 135deg
                }
        </style>

        <hamburger-positioner class="sm:hidden sm:fixed fixed top-6 right-6 text-4xl z-10 " >

            <hamburger-container class="relative flex flex-col justify-between h-[var(--hamburgerHeight)] w-[var(--hamburgerWidth)]"
            on:click={ clickOnBurger }>

                <input type="checkbox" bind:checked={hamburgerBtn} 
                class="peer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-[4] z-10 " />

                <div class=" bg-gray-500 transition duration-300 rounded 
                h-[var(--hamburgerPattyHeight)] peer-checked:translate-y-[var(--translY)]   peer-checked:rotate-[var(--angle)] peer-checked:bg-red-300"></div>

                <div class="bg-gray-500 transition duration-300 rounded 
                h-[var(--hamburgerPattyHeight)] peer-checked:scale-0 "></div>

                <div class=" bg-gray-500 transition duration-300 rounded 
                h-[var(--hamburgerPattyHeight)] peer-checked:-translate-y-[var(--translY)]  peer-checked:-rotate-[var(--angle)] peer-checked:bg-red-300"></div>
            </hamburger-container>
                
        </hamburger-positioner> -->

  <!-- pure css version (~54 lines code)-->
  <!-- <style>
            :root{
                    --hamburgerWidth: 35px;
                    --hamburgerHeight: calc( var(--hamburgerWidth) * 0.7 );
                    --hamburgerPattyHeight: 2px;
                    --translY: calc( 0.5 * (var(--hamburgerHeight) - var(--hamburgerPattyHeight))  );
                }

            #hamburgerContainer { 
                position: relative;
                width: var(--hamburgerWidth);
                height: var(--hamburgerHeight);
                display:flex;
                flex-direction: column;
                justify-content: space-between;
            }
            #hamburgerContainer input{
                top: 50%; 
                left: 50%;
                transform: translate(-50%, -50%) scale(4);
                position: absolute;
                opacity: 0;
                z-index: 1;
            }

            #hamburgerContainer div {
                background:gray;
                height: var(--hamburgerPattyHeight);
                border-radius:2px;
                transition: transform 0.3s;
            }
            
            #hamburgerContainer input:checked ~div:nth-of-type(2){
                transform: scale(0);
            }

            #hamburgerContainer input:checked ~div:nth-of-type(1){
                transform: translateY( var(--translY) ) rotate(45deg) scale(0.9);
            }

            #hamburgerContainer input:checked ~div:nth-of-type(3){
                transform: translateY( calc(-1*var( --translY)) ) rotate(-45deg) scale(0.9);
            }
        </style> 

        <button class="sm:hidden sm:fixed fixed top-6 right-6 text-4xl z-10" 
                on:click={ clickOnBurger }>

                <div id="hamburgerContainer">
                    <input bind:checked={hamburgerBtn} type="checkbox" >
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
        </button> -->
</main>
