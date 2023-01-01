<script>
  import GalleryScale from "$lib/GalleryScale.svelte";
  const reviewers = ["tj", "ben", "miranda", "efe", "paola", "rob", "zaara"];
</script>

<!-- <div class="font-Poppins text-center sm:text-5xl text-4xl py-20 ">
  TESTIMONIALS
</div> -->

<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 p-4 ">
  {#each reviewers as name}
    <GalleryScale
      Src={`/reviews/review-${name}-bare.webp`}
      Alt={`review ${name}`}
    />
  {/each}
</div>
