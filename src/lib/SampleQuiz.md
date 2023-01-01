<KatexIntersectionObserver/>
<script>
    import KatexIntersectionObserver from "$lib/KatexIntersectionObserver.svelte";
    import K from "$lib/KatexDataProp.svelte";
</script>


{#each Array(1000) as _,i }
    
<div class="bg-red-100">

$$
E=mc^3
$$

</div>
{/each}



