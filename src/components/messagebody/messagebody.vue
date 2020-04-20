<template>
  <div id="message-body">
    <div
      v-for="(message, index) in parsedMessages"
      :key="`${message.key}_${index}`"
    >
      {{ message.key }} {{ index }}
    </div>
  </div>
</template>

<script>
export default {
  name: "message-wraper",

  props: {
    messages: {
      type: Array,
      default: () => []
    },
    adapter: {
      type: Function,
      default: null
    }
  },
  computed: {
    parsedMessages() {
      return this.messages.map(message => {
        if (this.adapter) {
          return this.adapter(message);
        }
        return message;
      });
    }
  }
};
</script>

<style scoped></style>
