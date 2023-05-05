<script lang="ts" setup>
const props = defineProps<{
  url: string
  text?: string
}>()
console.log(props)
</script>

<template>
  {{props}}
  <iframe
    src="https://www.bing.com/images/create?partner=sydney&re=1&showselective=1&sude=1&kseed=7000&SFX=&q=a+dog&iframeid=d3755684-d0e1-4658-b764-5497fa382fa5"
    frameborder="0"
    w-full
    h-auto
    allowfullscreen
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  />
  <!-- <iframe -->
  <!--   class="frame" -->
  <!--   role="presentation" -->
  <!--   style="width:475px;height:520px;" -->
  <!--   src="https://www.bing.com/images/create?partner=sydney&amp;re=1&amp;showselective=1&amp;sude=1&amp;kseed=7000&amp;SFX=&amp;q=a+cat&amp;iframeid=5263d23e-5688-47de-a923-54e857d94e2f" -->
  <!--   data-bm="0" -->
  <!-- /> -->
</template>
