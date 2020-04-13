<template>
  <div class="test">
    <h1>Hello message-views-template!</h1>
    <message-wraper></message-wraper>
    <input v-model="name" placeholder="Name" />
  </div>
</template>

<script>
import MessageWraper from "./message-wraper/MessageWrapers";

export default {
  name: "test",
  components: {
    MessageWraper: MessageWraper
  },
  data() {
    return {
      name: "world1"
    };
  }
};
</script>

<style scoped>
.test h1 {
  color: #40b883;
}
</style>
