<template>
  
</template>

<script>
export default {
  name: 'Redirect',
  mounted() {
     this.$electron.send("IS_USER_CONNECTED")
     this.$electron.once("IS_USER_CONNECTED_REPLY", (event, arg) => {
        if(arg.isConnected) {
           this.$router.push("passwords")
        } else {
           this.$router.push("login")
        }
     })
  }
}
</script>
