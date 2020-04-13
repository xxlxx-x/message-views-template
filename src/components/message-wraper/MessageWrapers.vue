<template>
  <div class="test">
    <h1>messages wraper</h1>
    <input v-model="name" placeholder="Name" />
  </div>
</template>

<script>
export default {
  name: 'message-wraper',

  data () {
    return {
      name: 'world',
    }
  },
}
</script>

<style scoped>
.test h1 {
  color: #40b883;
}
</style>
