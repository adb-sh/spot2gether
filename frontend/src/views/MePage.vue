<script setup lang="ts">
import PromiseResolver from "@/components/PromiseResolver.vue";
import CurrentlyPlayingCompact from "@/components/CurrentlyPlayingCompact.vue";
import { onBeforeUnmount, ref } from "vue";
import { useApi } from "@/Api";

const api = useApi();

const userInfo = ref(api?.getCurrentlyPlaying());

let refreshUserInfo = setInterval(() => {
  userInfo.value = api?.getCurrentlyPlaying();
}, 10000);

onBeforeUnmount(() => {
  clearInterval(refreshUserInfo);
});
</script>

<template>
  <div>
    <h1>Me</h1>
    <h2>Currently listening to</h2>
    <PromiseResolver
      :promise="userInfo"
      v-slot="{ data: { currentlyPlaying } }"
    >
      <CurrentlyPlayingCompact v-if="currentlyPlaying?.item" :currentlyPlaying="currentlyPlaying" />
      <div v-else class="alert alert-info">
        You are not listening to music.
      </div>
    </PromiseResolver>
    <h2>Session</h2>
    <PromiseResolver
      :promise="$api.getSession()"
    >
      <template #default="{ data: { session }, update }">
        <div class="card">
          <div class="card-header">
            Your session
          </div>
          <div class="card-body">
            <b>Host</b>
            <div class="row">
              <router-link
                class="col-auto my-2 btn"
                :to="`/user/${ session.host.id }`"
              >
                <img
                  v-if="session.host.images[0]?.url"
                  :src="session.host.images[0]?.url"
                  :alt="session.host.displayName"
                  :title="session.host.displayName"
                  class="rounded-circle userThumbnail"
                />
                <i v-else class="bi-person-circle userThumbnail" :title="session.host.displayName" />
              </router-link>
            </div>
            <b>Clients</b>
            <div class="row">
              <router-link
                v-for="client in session.clients"
                :key="client"
                class="col-auto btn"
                :to="`/user/${ client.id }`"
              >
                <img
                  v-if="client.images[0]?.url"
                  :src="client.images[0]?.url"
                  :alt="client.displayName"
                  :title="client.displayName"
                  class="userThumbnail rounded-circle"
                />
                <i v-else class="bi-person-circle userThumbnail" :title="client.displayName" />
              </router-link>
            </div>
          </div>
          <div class="card-footer">
            <button
              class="btn btn-danger mx-1"
              @click="$api.leaveSession().then(() => update($api.getSession()))"
            >
              leave Session
            </button>
            <button
              class="btn btn-danger mx-1"
              @click="$api.deleteSession().then(() => update($api.getSession()))"
            >
              delete Session
            </button>
          </div>
        </div>
      </template>
      <template #error="{ error, update }">
        <div v-if="error.response.status === 404">
          <div class="alert alert-info">
            You are not part of any session.
          </div>
          <button
            @click="$api.createSession().then(() => update($api.getSession()))"
            class="btn btn-success"
          >
            Create Session
          </button>
        </div>
      </template>
    </PromiseResolver>
  </div>
</template>

<style scoped lang="scss">
.userThumbnail {
  height: 2rem;
  font-size: 2rem;
}
</style>
