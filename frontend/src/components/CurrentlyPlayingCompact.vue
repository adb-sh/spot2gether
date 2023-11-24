<script setup lang="ts">
import { defineProps } from "vue";
import TrackProgressBar from "@/components/TrackProgressBar.vue";

defineProps({
  currentlyPlaying: Object,
});
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-3 col-md-2">
          <img :src="currentlyPlaying.item.album.images[0].url" alt="album cover" class="card-img">
        </div>
        <div class="col">
          <b>{{ currentlyPlaying?.item.name }}</b>
          <div>
            {{ currentlyPlaying?.item.artists.map(artist => artist.name).join(', ') }}
          </div>
          <TrackProgressBar
            :duration="currentlyPlaying?.item.duration"
            :progress="currentlyPlaying.progress"
            :isPlaying="currentlyPlaying.isPlaying"
          />
        </div>
      </div>
    </div>
  </div>
</template>
