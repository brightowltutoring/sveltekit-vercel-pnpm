<script>
  import ReviewCreator from "$lib/Reviews/reviewCreator.svx";
  import { reviews } from "$lib/Reviews/reviews";
</script>

<div class="scale-90">
  <!-- <div
    class="grid grid-cols-dynamic gap-x-10  gap-y-[80vw] sm:gap-y-[55vw] md:gap-y-[65vw] lg:gap-y-[45vw] -translate-y-60 sm:translate-y-0"
  > -->

  <div
    class=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10  gap-y-[500px] lg:gap-y-[700px] -translate-y-60 sm:translate-y-0"
  >
    {#each reviews as { name, title, date, body }}
      <ReviewCreator {title} {name} {date}>
        {body}
      </ReviewCreator>
    {/each}
  </div>
</div>
