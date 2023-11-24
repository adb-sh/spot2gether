<script setup lang="ts">
import { defineProps, watch, ref } from "vue";

const props = defineProps({
  seconds: Number,
});

const getHmsFromSeconds = (d: number) => ({
  hours: Math.floor(d / 3600),
  minutes: Math.floor(d % 3600 / 60),
  seconds: Math.floor(d % 3600 % 60),
});

const getLeadingZero = (a: number, digits: number) =>
  ('0'.repeat(digits) + a.toString())
    .substr(- digits);

const hms = ref(getHmsFromSeconds(props.seconds as number));

watch(() => props.seconds, (to) => {
  hms.value = getHmsFromSeconds(to as number);
});
</script>

<template>
  <span v-if="hms.hours" class="hours">{{ getLeadingZero(hms.hours, 2) }}:</span>
  <span class="minutes">{{ getLeadingZero(hms.minutes, 2) }}:</span>
  <span class="seconds">{{ getLeadingZero(hms.seconds, 2) }}</span>
</template>

