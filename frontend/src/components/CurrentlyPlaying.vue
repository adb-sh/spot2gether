<script setup lang="ts">
import { defineProps } from "vue";
import TrackProgressBar from "@/components/TrackProgressBar.vue";

defineProps({
  currentlyPlaying: Object
});
</script>

<template>
  <div class="currentlyPlaying card">
    <div class="card-header">
      <b>{{ currentlyPlaying?.item.name }}</b>
      <div>
        {{ currentlyPlaying?.item.artists.map(artist => artist.name).join(", ") }}
      </div>
    </div>
    <div class="card-body">
      <div class="row justify-content-center">
        <div class="col coverGroup">
          <img :src="currentlyPlaying.item.album.images[0].url" alt="album cover" class="card-img">
          <TrackProgressBar
            :duration="currentlyPlaying?.item.duration"
            :progress="currentlyPlaying.progress"
            :isPlaying="currentlyPlaying.isPlaying"
          />
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="">
        <a
          :href="currentlyPlaying?.item.externalURL.spotify"
          target="_blank"
          rel="noopener norefferrer"
          class="btn btn-outline-dark m-1"
        >
          view track on Spotify
        </a>
        <a
          v-if="currentlyPlaying?.context"
          :href="currentlyPlaying?.context.externalURL.spotify"
          target="_blank"
          rel="noopener norefferrer"
          class="btn btn-outline-dark m-1"
        >
          view {{ currentlyPlaying?.context.type }} on Spotify
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.currentlyPlaying {
  .coverGroup {
    max-width: 20rem;
  }
}
</style>
