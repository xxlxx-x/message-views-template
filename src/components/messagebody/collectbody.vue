<template>
  <div class="collect-body" @click="emitClick">
    <template v-if="collect.Text">
      <div class="text" v-html="collect.Text"></div>
    </template>
    <template v-if="collect.MsgType === 'image'">
      <div class="image">
        <template v-for="(Url, index) in collect.Urls">
          <img :src="Url" :key="index" />
        </template>
      </div>
    </template>
    <template v-if="collect.MsgType === 'audio'">
      <div class="voice">
        <template v-for="(Url, index) in collect.Urls">
          <audio :src="Url" :key="index" controls></audio>
        </template>
      </div>
    </template>
    <template v-if="collect.MsgType === 'video'">
      <div class="video">
        <template v-for="(Url, index) in collect.Urls">
          <video :src="Url" :key="index" controls></video>
        </template>
      </div>
    </template>
    <template v-if="collect.MsgType === 'file'">
      <div class="file">
        <a :href="collect.Url">{{ collect.Name }}</a>
      </div>
    </template>
    <template v-if="collect.MsgType === 'map'">
      <div class="map">
        <img class="map-img" src="../images/map.png" />
        <div class="map-desc">
          <div>{{ collect.Title }}</div>
          <div>{{ collect.Summary }}</div>
        </div>
      </div>
    </template>
    <!-- 不知道有没有 -->
    <!-- <template v-if="collect.MsgType === 'card'">
      <div class="card">
        <div class="card-main">
          <img class="card-img" src="../images/tx.svg" />
          <div class="card-desc">
            <div class="card-title">{{ collect.Name }}</div>
            <div class="card-info" :title="collect.Account">
              {{ collect.Account }}
            </div>
          </div>
        </div>
        <div class="card-flag">{{ collect.Flag }}</div>
      </div>
    </template> -->
    <template v-if="collect.MsgType === 'web'">
      <div class="web">
        <div class="web1">
          <div class="web1-desc">
            <a
              v-if="collect.Url"
              :href="collect.Url"
              class="web-title"
              target="blank"
              >{{ collect.Title }}</a
            >
            <span v-else class="web-title">{{ collect.Title }}</span>
            <h5>{{ collect.Summary }}</h5>
          </div>
          <div v-if="collect.PictureUrl" class="web1-img-content">
            <img class="web1-img" :src="collect.PictureUrl" />
          </div>
        </div>
        <div class="desc">
          {{ collect.Content }}
        </div>
      </div>
    </template>
    <!-- {{ collect }} -->
  </div>
</template>

<script>
export default {
  name: "collect-body",

  props: {
    collect: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    emitClick(event) {
      this.$emit("collectClick", this.collect, event);
    }
  }
};
</script>

<style lang="scss" scoped>
.collect-body {
  text-align: left;
  .text {
    white-space: pre-wrap;
    text-align: left;
  }
  .image {
    max-width: 350px;
    img {
      margin-right: 10px;
      max-height: 100px;
    }
  }
  .video {
    video {
      max-width: 300px;
      max-height: 300px;
    }
  }

  .web {
    .web1 {
      margin-bottom: 5px;

      .web1-img-content {
        display: flex;
        padding: 10px;
        justify-content: start;
        .web1-img {
          height: 70px;
          object-fit: scale-down;
          margin-right: 10px;
        }
      }
      .web1-desc {
        a {
          font-size: 16px;
          font-weight: 400;
        }

        h5 {
          font-weight: 400;
        }
      }
    }
  }
}
</style>
