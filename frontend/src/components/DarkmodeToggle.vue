<template>
  <div class="form-check form-switch">
    <label class="custom-control-label" for="darkSwitch">
      <slot :state="sliderState" />
    </label>
    <input v-model="sliderState" type="checkbox" class="form-check-input" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { themeConfig } from '@/main';

let currentTheme;
currentTheme = themeConfig.getTheme() === 'dark'

const sliderState = ref(currentTheme);

watch(sliderState, (state) => {
  themeConfig.setTheme(state ? 'dark' : 'light');
});

themeConfig.themeChangeHandlers.push((newTheme) => {
  sliderState.value = newTheme === 'dark';
});
</script>
