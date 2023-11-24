<script setup lang="ts">
import PromiseResolver from "@/components/PromiseResolver.vue";
import CurrentlyPlaying from "@/components/CurrentlyPlaying.vue";
import CurrentlyPlayingCompact from "@/components/CurrentlyPlayingCompact.vue";
import { useRoute } from "vue-router";
import { onBeforeUnmount, ref } from "vue";
import { useApi } from "@/Api";

const route = useRoute();
const api = useApi();

const userInfo = ref(api?.getUserInfo(route.params.id as string));

let refreshUserInfo = setInterval(() => {
  userInfo.value = api?.getUserInfo(route.params.id as string);
}, 10000);

onBeforeUnmount(() => {
  clearInterval(refreshUserInfo);
});
</script>

<template>
  <div v-if="$route.query.embed === 'true'">
    <PromiseResolver
      :promise="userInfo"
      v-slot="{ data: { currentlyPlaying } }"
    >
      <CurrentlyPlayingCompact
        v-if="currentlyPlaying?.item"
        :currentlyPlaying="currentlyPlaying"
        :compact="true"
      />
      <p v-else class="alert alert-info">
        User is not listening to music.
      </p>
    </PromiseResolver>
  </div>
  <div v-else>
    <h1>User</h1>
    <PromiseResolver
      :promise="userInfo"
      v-slot="{ data: { user, currentlyPlaying } }"
      class="row"
    >
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            {{ user.displayName }}
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-4">
                <img :src="user.images[0]?.url" alt="user image" class="card-img">
              </div>
              <div class="col">
                <p>{{ user.totalFollowers }} followers on Spotify</p>
              </div>
            </div>
          </div>
        </div>
        <button
          v-if="$api.isAuthorized()"
          @click="$api.joinSession($route.params.id)"
          class="btn btn-primary my-2"
        >
          Join Session
        </button>
        <router-link
          v-else
          to="/auth"
          class="btn btn-primary my-2"
        >
          login with Spotify and join session
        </router-link>
      </div>
      <div class="col">
        <h2>Currently listening to:</h2>
        <CurrentlyPlaying v-if="currentlyPlaying?.item" :currently-playing="currentlyPlaying" />
        <p v-else class="alert alert-info">
          {{ user.displayName }} is not listening to music.
        </p>
      </div>
    </PromiseResolver>
  </div>
</template>
