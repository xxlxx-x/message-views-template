<template>
  <div id="message-body" @click="emitClick">
    <template v-if="message.MsgType === 'text'">
      <div class="text" v-html="message.Text"></div>
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
    <template v-if="message.MsgType === 'map'">
      <div class="map">
        <img class="map-img" src="../images/map.png" />
        <div>
          <div class="map-desc">{{ message.Title }}</div>
          <div class="map-desc">{{ message.Summary }}</div>
        </div>
      </div>
    </template>
    <template v-if="message.MsgType === 'web'">
      <div class="web">
        <div class="web1">
          <div class="web1-desc">
            <a v-if="message.Url" :href="message.Url" class="web-title">{{
              message.Title
            }}</a>
            <span v-else class="web-title">{{ message.Title }}</span>
            <h5>{{ message.Summary }}</h5>
          </div>
          <div v-if="message.PictureUrl" class="web1-img-content">
            <img class="web1-img" :src="message.PictureUrl" />
          </div>
        </div>
        <div class="desc">
          {{ message.Content }}
        </div>
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
  },
  methods: {
    emitClick(event) {
      this.$emit("messageClick", this.message, event);
    }
  }
};
</script>

<style lang="scss" scoped>
#message-body {
  .text {
    text-align: left;
  }

  .map {
    display: flex;
    padding-bottom: 10px;

    .map-img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }

    .map-desc {
      text-align: left;
      max-width: 250px;
    }
  }

  .desc {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    margin-left: -5px;
    margin-right: -5px;
    padding: 0 5px;
    color: #999;
    font-size: 12px;
    padding-top: 5px;
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

  .redenvelope {
    background-color: rgb(251, 153, 42);
    padding: 10px 10px;
    display: flex;

    .redenvelope-img {
      max-width: 50px;
      min-width: 50px;
      margin-right: 10px;
    }

    .redenvelope-desc {
      max-width: 170px;
      width: 170px;
      color: #fff;

      h5 {
        margin-bottom: 5px;
      }

      h3 {
        font-weight: 400;
      }
    }
  }

  .card {
    display: flex;
    padding-bottom: 20px;

    .card-img {
      max-width: 50px;
      min-width: 50px;
      margin-right: 10px;
    }

    .card-desc {
      // min-width: 150px;
      margin-right: 20px;

      h3 {
        font-weight: 400;
        margin-bottom: 10px;
      }

      h5 {
        font-weight: 400;
      }
    }
  }

  .image {
    img {
      max-height: 100px;
    }
  }

  .transferaccount {
    background-color: rgb(44, 168, 237);
    padding: 10px 10px;
    display: flex;

    .transferaccount-img {
      max-width: 50px;
      min-width: 50px;
      margin-right: 10px;
    }

    .transferaccount-desc {
      max-width: 170px;
      width: 170px;
      color: #fff;

      h5 {
        margin-bottom: 5px;
      }

      h3 {
        font-weight: 400;
      }
    }
  }

  span {
    img {
      margin-right: 10px;
      object-fit: cover;
    }
  }

  .imsnsinfo {
    .imsnsinfo-say {
      margin-bottom: 20px;
    }

    .imsnsinfo-time {
      font-size: 12px;
      margin-bottom: 10px;
    }

    .imsnsinfo-res-info {
    }

    .imsnsinfo-like-info {
      position: relative;
      height: 40px;
      background: rgba(0, 0, 0, 0.05);
      padding-left: 40px;
      display: flex;
      line-height: 40px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      .like-icon {
        position: absolute;
        left: 15px;
        top: 13px;
        width: 15px;
      }

      .num-name.wrapper {
        display: flex;
        max-width: 100px;
      }

      .num-name {
        margin-right: 5px;
      }

      .num-like {
        font-size: 12px;
      }
    }

    .imsnsinfo-res-comment {
      position: relative;
      background: rgba(0, 0, 0, 0.05);
      padding: 20px 20px 10px 40px;

      .like-icon {
        position: absolute;
        left: 15px;
        top: 30px;
        width: 15px;
      }

      .comment-item {
        display: flex;
        margin-bottom: 10px;

        .comment-item-img {
          width: 35px;
          height: 35px;
          margin-right: 5px;
        }

        .comment-item-desc {
          font-size: 12px;
        }
      }
    }
  }
}

.mb-blob {
  font-weight: 700;
}
</style>
