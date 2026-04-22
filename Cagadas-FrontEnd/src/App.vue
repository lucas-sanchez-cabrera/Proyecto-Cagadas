<template>
  <RouterView />
</template>

<script setup></script>
<style>
html,
body,
#app {
  margin: 0;
  min-height: 100%;
}

@media (min-width: 768px) {
  #app {
    width: 100%;
    margin: 0;
  }
}
</style>
