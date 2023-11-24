<script setup lang="ts">
import { defineProps, ref, watch, onBeforeUnmount } from "vue";
import TimeFormatter from "@/components/TimeFormatter.vue";

const props = defineProps({
  duration: Number,
  progress: Number,
  isPlaying: Boolean,
});

const estimatedProgress = ref(props.progress as number);

const updateInterval = setInterval(() => {
  if (props.isPlaying) estimatedProgress.value += 1000;
}, 1000);

watch(() => props.progress, (to) => {
  estimatedProgress.value = to as number;
});

onBeforeUnmount(() => {
  clearInterval(updateInterval);
});
</script>

<template>
  <div>
    <div class="progress my-2">
      <div
        class="progress-bar"
        role="progressbar"
        :style="{
          width: `${ Math.min(estimatedProgress / duration, 1) * 100 }%`
        }"
      />
    </div>
    <div class="row my-2">
      <div class="col">
        <TimeFormatter
          :seconds="
            Math.min(estimatedProgress, duration) / 1000
          "
        />
      </div>
      <div class="col-auto">
        <TimeFormatter :seconds="duration / 1000"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress {
  height: 0.5rem;
}
</style>
