<template>
  <div id="message-body">
    <template v-if="message.MsgType === 'text'">
      <span>{{ message.Text }}</span>
    </template>
    <template v-if="message.MsgType === 'image'">
      <div class="image"><img :src="message.Url" /></div>
    </template>
    <template v-if="message.MsgType === 'voice'">
      <div class="voice">
        <audio :src="message.Url" controls></audio>
      </div>
    </template>
    <template v-if="message.MsgType === 'video'">
      <div class="audio">
        <video :src="message.Url" controls></video>
      </div>
    </template>
    <!-- {{ message }} -->
  </div>
</template>

<script>
export default {
  name: "message-body",

  props: {
    message: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
#message-body {
  .image {
    img {
      max-height: 100px;
    }
  }
}
</style>
