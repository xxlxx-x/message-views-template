<template>
  <div id="collections">
    <div
      class="item"
      v-for="(item, index) in parsedCollects"
      :key="`${item.Key}_${index}`"
    >
      <div class="main" @click="event => collectClick(null, item, event)">
        <img class="avatar" :src="item.AvatarUrl" />
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
          <div class="collect-content">
            <template v-for="(collect, index) in item.items">
              <collect-body
                :key="index"
                :collect="collect"
                @collectClick="
                  (collectItem, event) => collectClick(collect, item, event)
                "
              ></collect-body>
            </template>
            <p class="collect-time">{{ item.Time }}</p>
            <template v-if="item.Counts.length">
              <div class="collect-status">
                <template v-for="(Counter, index) in item.Counts">
                  <span :key="index" title="Counter.Title">
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
                      >{{ Name
                      }}<span v-if="index + 1 < item.LikeNames.length"
                        >,</span
                      ></span
                    >
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
import collectbody from "components/messagebody/collectbody";

export default {
  name: "collections",
  components: {
    "collect-body": collectbody
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
  computed: {
    parsedCollects() {
      return this.collections.map(collect => {
        if (this.adapter) {
          return this.adapter(collect);
        }
        return collect;
      });
    }
  },
  methods: {
    collectClick(collect, collectItem, event) {
      console.log("collectionClick", collect, collectItem, event);
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
      padding: 5px 20px;
      &:hover {
        background-color: rgba(228, 228, 228, 0.5);
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
            position: relative;
            white-space: nowrap;

            .delete-image {
              position: absolute;
              top: -10px;
              right: 0;
              z-index: 10;
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
