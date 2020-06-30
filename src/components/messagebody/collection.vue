<template>
  <div id="collections">
    <div
      v-for="(item, index) in parsedCollects"
      :key="`${item.Key}_${index}`"
      class="item"
      @click="event => collectClick(item, event)"
      @contextmenu="event => collectContexted(item, event)"
    >
      <div class="main">
        <img
          :src="item.AvatarUrl"
          :title="`第${item.DatatableIndex}条`"
          class="avatar"
        />
        <!-- @click="event => messageClick(item, event)" -->
        <div class="main-content">
          <div class="name-wrapper">
            <div class="name">
              {{ item.Name }}
              <span v-if="item.UserAccount">({{ item.UserAccount }})</span>
              <template v-if="item.Delete">
                <img src="../images/deleted.png" class="delete-image" />
              </template>
            </div>
          </div>
          <div
            class="collect-content"
            @contextmenu="event => $emit('itemContext', { item, event })"
          >
            <div v-if="item.Selected" class="item-selected">
              <i class="iconfont iconselected"></i>
            </div>
            <div class="text">{{ item.Content }}</div>
            <template v-for="(collect, index) in item.items">
              <collect-body :key="index" :collect="collect"></collect-body>
            </template>
            <p v-if="item.LocationName" class="location-name">
              <i class="iconfont iconditu2"></i>
              {{ item.LocationName }}
            </p>
            <p class="collect-time">{{ item.Time }}</p>
            <template v-if="item.Counts.length">
              <div class="collect-status">
                <template v-for="(Counter, index) in item.Counts">
                  <span :key="index" :title="Counter.Title">
                    <i :class="['iconfont', Counter.Icon]"></i>
                    ({{ Counter.Value }})
                  </span>
                </template>
                <template v-if="item.LikeNames">
                  <div class="like-names">
                    <i class="iconfont iconlike"></i>
                    <span
                      v-for="(Name, index) in item.LikeNames"
                      :key="`name_${index}`"
                    >
                      {{ Name }}
                      <span v-if="index + 1 < item.LikeNames.length"> , </span>
                    </span>
                  </div>
                </template>
              </div>
            </template>
            <template v-if="item.Comments">
              <div class="collect-comments">
                <template
                  v-for="({ Author, Target, Content, Time },
                  index) in item.Comments"
                >
                  <div :key="index" class="comment-item">
                    <span class="name"> {{ Author }} </span>
                    <span v-if="Author !== Target">
                      回复
                      <span class="name">{{ Target }} </span>:</span
                    >
                    <span class="time">({{ Time }})</span>
                    <div class="content">{{ Content }}</div>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import collectbody from "./collectbody";

export default {
  name: "collections",
  components: {
    "collect-body": collectbody
  },
  provide() {
    return {
      root: this
    };
  },
  props: {
    collections: {
      type: Array,
      default: () => {}
    },
    adapter: {
      type: Function,
      default: null
    }
  },
  data() {
    return { parsedCollects: [] };
  },
  // computed: {
  //   parsedCollects() {
  //     return this.collections.map(collect => {
  //       if (this.adapter) {
  //         return this.adapter(collect);
  //       }
  //       return collect;
  //     });
  //   }
  // },

  watch: {
    collections() {
      this.buildCollections();
    }
  },
  created() {
    this.buildCollections();
  },
  methods: {
    buildCollections() {
      this.parsedCollects = this.collections.map(collect => {
        if (this.adapter) {
          return this.adapter(collect);
        }
        return collect;
      });
    },
    collectClick(collect, event) {
      this.$emit("viewClick", { item: collect, event });
    },
    collectContexted(item, event) {
      this.$emit("collectContext", item, event);
    }
  }
};
</script>

<style lang="scss" scoped>
#collections {
  .item {
    min-height: 60px;
    margin-bottom: 20px;
    .main {
      display: flex;
      position: relative;
      padding: 5px 20px;

      &:hover {
        background-color: rgba(228, 228, 228, 0.5);
      }
      &:hover .delete-image {
        opacity: 0.2;
      }
      .avatar {
        margin-top: 5px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .main-content {
        max-width: calc(100% - 200px);
        display: flex;
        flex-direction: column;

        .name-wrapper {
          display: flex;

          .name {
            font-size: 14px;
            white-space: nowrap;
            position: relative;

            .delete-image {
              position: absolute;
              top: -10px;
              right: 0;
              z-index: 2;
            }
          }
        }
        .collect-content {
          font-size: 1rem;
          position: relative;
          .location-name {
            color: rgb(58, 120, 255);
          }
          .item-selected {
            color: red;
            position: absolute;
            top: 0px;
            right: -45px;
            // padding: 0 10px;
            i {
              font-size: 40px;
            }
          }
        }
        .collect-time {
          text-align: left;
          color: rgb(58, 120, 255);
        }
        .collect-status {
          text-align: left;
          margin-bottom: 10px;
          .like-names {
            font-size: 14px;
            i {
              margin-right: 5px;
            }
            span {
              // padding-left: 5px;
              color: rgb(58, 120, 255);
            }
          }
        }
        .collect-comments {
          text-align: left;
          font-size: 14px;

          .comment-item {
            span.name {
              color: rgb(58, 120, 255);
            }
          }
          .content {
            white-space: pre-wrap;
            margin: 0 0 10px;
          }
        }
      }
    }
  }
}
</style>
