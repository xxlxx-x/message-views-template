<template>
  <div id="message-content">
    <p>Scroll2Load load</p>
    <div id="scroll2load">
      <messagebody></messagebody>
    </div>
  </div>
</template>

<script>
import messagebody from "components/messagebody/messagebody.vue";

export default {
  name: "Scroll2Load",
  components: {
    messagebody
  }
};
</script>

<style lang="scss" scoped>
#message-content {
  width: 100%;
  #scroll2load {
    width: 700px;
    height: 700px;
    border: 1px solid #aaaaaa44;
    margin: auto;
  }
}
</style>
