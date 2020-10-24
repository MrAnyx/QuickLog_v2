<template>
  <div>
    <router-link to="/">Home</router-link>
    <router-link to="/contact">Contact</router-link>
    <router-view />
  </div>
</template>

<script>
const { ipcRenderer } = window;

export default {
  name: "App",

  // mounted() {
  //   ipcRenderer.send("ready");
  //   ipcRenderer.once("ready-reply", (event, arg) => {
  //     console.log(arg);
  //   });
  // },
};
</script>
