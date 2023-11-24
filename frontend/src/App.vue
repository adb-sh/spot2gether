<script setup lang="ts">
import DarkModeToggle from "@/components/DarkmodeToggle.vue";
</script>

<template>
  <div v-if="$route.meta.allowEmbed && $route.query.embed === 'true'" class="p-2">
    <router-view />
  </div>
  <div v-else>
    <div class="bg-darkmode-dark bg-light shadow sticky-top">
      <nav class="navbar px-2 container">
        <router-link class="d-flex btn" to="/">
          <div class="d-flex header-title flex-column justify-content-center">
            <b>spot2gether</b>
            <div>music connects</div>
          </div>
        </router-link>
        <div class="d-flex align-items-center">
          <router-link
            v-if="!$api.isAuthorized()"
            to="/auth"
            class="btn btn-outline"
          >
            login
          </router-link>
          <router-link
            v-if="$api.isAuthorized()"
            to="/me"
            class="btn btn-outline"
          >
            me
          </router-link>
          <DarkModeToggle class="mx-2" v-slot="{ state }">
            <i v-if="state" class="bi-moon"/>
            <i v-else class="bi-sun"/>
          </DarkModeToggle>
        </div>
      </nav>
    </div>
    <div class="container my-5">
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<style lang="scss">
nav {
  a {
    font-weight: bold;
    &.router-link-exact-active {
      text-decoration: underline;
    }
  }
}
</style>
