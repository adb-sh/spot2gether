<template>
  <div class="Throbber">
    <img src="../assets/throbber.svg" alt="throbber" />
    <div class="info"><slot>loading</slot></div>
  </div>
</template>

<style scoped lang="scss">
.Throbber {
  padding: 0.5rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  img {
    height: 3rem;
    width: 3rem;
  }
}
</style>
