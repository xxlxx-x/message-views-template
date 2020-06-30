<template>
  <div class="collect-body">
    <template v-if="collect.Text">
      <div class="text" v-html="collect.Text" />
      <!-- #{{ collect.MsgType }}# -->
    </template>
    <template v-if="collect.MsgType === 'image'">
      <div class="image">
        <template v-for="(Url, index) in collect.Urls">
          <img
            :src="Url"
            :key="index"
            @click="
              event =>
                root.$emit('viewClick', {
                  url: Url,
                  item: collect,
                  event
                })
            "
          />
        </template>
      </div>
    </template>
    <template v-if="collect.MsgType === 'audio'">
      <div class="voice">
        <template v-for="(Url, index) in collect.Urls">
          <audio :src="Url" :key="index" controls />
        </template>
      </div>
    </template>
    <template v-if="collect.MsgType === 'video'">
      <div class="video">
        <template v-for="(Url, index) in collect.Urls">
          <video :src="Url" :key="index" controls />
        </template>
      </div>
    </template>
    <template v-if="collect.MsgType === 'file'">
      <div class="file">
        <p v-if="collect.Url" class="file-link" target="blank">
          {{ collect.Name }}
        </p>
        <p v-else>{{ collect.Name }}</p>
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
            <p
              v-if="collect.Url"
              class="web-title"
              @click.stop="
                event => {
                  root.$emit('clickLink', { item: collect, event });
                }
              "
            >
              {{ collect.Title }}
            </p>
            <span v-else>{{ collect.Title }}</span>
            <div
              class="web-content"
              @click="
                event => {
                  root.$emit('clickLink', { item: collect, event });
                }
              "
            >
              <img v-if="collect.Icon" :src="collect.Icon" />
              {{ collect.Summary }}
            </div>
          </div>
          <div v-if="collect.PictureUrl" class="web1-img-content">
            <img :src="collect.PictureUrl" class="web1-img" />
          </div>
        </div>
      </div>
    </template>
    <!-- {{ collect }} -->
  </div>
</template>

<script>
export default {
  name: "CollectBody",
  inject: ["root"],
  props: {
    collect: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
.collect-body {
  text-align: left;
  .text {
    font-size: 1rem;
    white-space: pre-wrap;
    text-align: left;
    margin-bottom: 5px;
  }
  .image {
    max-width: 350px;
    img {
      width: 100px;
      height: 100px;
      object-fit: scale-down;
      background-color: rgb(209, 209, 209);
      margin-right: 5px;
    }
  }
  .video {
    video {
      max-width: 300px;
      max-height: 300px;
    }
  }
  .file {
    .file-link {
      color: rgb(74, 122, 255);
      cursor: pointer;
      font-size: 16px;
      font-weight: 400;
    }
  }
  .map {
    display: flex;
    padding: 10px;
    background-color: rgb(212, 212, 212);

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
        padding: 10px;
        background-color: rgba(212, 212, 212, 0.5);
        .web-title {
          color: rgb(74, 122, 255);
          cursor: pointer;
          font-size: 16px;
          font-weight: 400;
        }
        .web-content {
          max-width: 400px;
        }
      }
    }
  }
}
</style>
