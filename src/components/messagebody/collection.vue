<template>
  <div id="collections">
    <div
      class="item"
      v-for="(item, index) in parsedCollects"
      :key="`${item.Key}_${index}`"
    >
      <div class="main">
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
            <template v-if="item.LikeNames || item.Comments">
              <div class="collect-status">
                <span>
                  <i class="iconfont iconlike"></i>({{ item.LikeNames.length }})
                </span>
                <i class="iconfont iconicon_message"></i>({{
                  item.Comments.length
                }})
              </div>
            </template>
            <template v-if="item.Comments">
              <div class="collect-comments">
                <template v-for="(comment, index) in item.Comments">
                  <div :key="index">{{ comment }}</div>
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
        .collect-status {
          text-align: left;
        }
        .collect-comments {
        }
      }
    }
  }
}
</style>
