<template>
  <div class="home">
    <h1>Spot2Gether</h1>
    <p>
      listen to music with your friends
    </p>
    <router-link v-if="!$api.isAuthorized()" to="/auth" class="btn btn-primary">Get started</router-link>
    <router-link v-else to="/me" class="btn btn-primary">Go to my profile</router-link>
  </div>
</template>
