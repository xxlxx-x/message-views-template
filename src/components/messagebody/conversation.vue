<template>
  <div id="conversation-wraper">
    <div
      v-for="(item, index) in parsedMessages"
      :key="`${item.Key}_${index}`"
      class="item"
      @click="event => messageClick(item, event)"
    >
      <div class="time">
        <span>{{ item.Time }}</span>
      </div>
      <div v-if="item.MsgType === 'systemmsg'" class="main-systemmsg">
        <span>{{ item.Text }}</span>
      </div>
      <template v-else>
        <label class="item-checkbox">
          <input v-model="item.Selected" type="checkbox" />
          <span class="checkbox-marker"></span>
        </label>
        <div
          :class="[
            'main',
            { left: item.IsSend === 1, right: item.IsSend === 2 }
          ]"
        >
          <img
            :src="item.AvatarUrl"
            :title="`第${item.DatatableIndex}条`"
            class="avatar"
          />
          <div class="main-content">
            <div class="name-wrapper">
              <div class="name">
                <template v-if="item.IsSend === 1">
                  {{ item.Name }} ({{ item.UserAccount }})
                  <span style="color: #aaaaaa">({{ item.Time }})</span>
                  <!-- <span style="color:red">
                    {{ item.MsgType }}---{{ item.OriginMsgType }}
                  </span>-->
                </template>
                <template v-if="item.IsSend === 2">
                  <!-- <span style="color:red">
                    {{ item.MsgType }}---{{ item.OriginMsgType }}
                  </span>-->
                  <span style="color: #aaaaaa">({{ item.Time }})</span> ({{
                    item.UserAccount
                  }}) {{ item.Name }}
                </template>
                <template v-if="item.Delete">
                  <img src="../images/deleted.png" class="delete-image" />
                </template>
              </div>
            </div>
            <div
              :class="[
                'message',
                getMessageClasses(item.MsgType, item.IsSend === 2)
              ]"
              @contextmenu="event => $emit('itemContext', { item, event })"
            >
              <div class="relative-wrap">
                <!-- <div class="function-bar">
                  <div
                    v-if="item.Text && isMessageTranslatable(item.Text)"
                    class="item-flag item-transtale"
                    @click.stop="() => translateMessage(item)"
                  >
                    <div
                      v-if="item.translating"
                      class="loader-inner ball-clip-rotate-multiple"
                    >
                      <div></div>
                      <div></div>
                    </div>
                    <i v-else class="iconfont icontranslate"></i>
                  </div>
                  <div
                    v-if="item.MsgType === 'voice' && item.Url !== 'unknown'"
                    class="item-flag item-transtale"
                    @click.stop="() => translateMessage(item)"
                  >
                    <div
                      v-if="item.translating"
                      class="loader-inner ball-clip-rotate-multiple"
                    >
                      <div></div>
                      <div></div>
                    </div>
                    <i v-else class="iconfont icontranslate"></i>
                  </div>
                  <div v-if="item.Selected" class="item-flag item-selected">
                    <i class="iconfont iconselected"></i>
                  </div>
                </div> -->
                <message-body :message="item" class="message-back" />
              </div>
            </div>
            <div v-if="item.VoiceText">
              <div class="voice-text">
                <span
                  v-if="item.VoiceText.includes('#failed#')"
                  class="error-text"
                  >转换失败:</span
                >
                <span v-else>转换文字:</span>
                {{ item.VoiceText.replace("#failed#", "") }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import messagebody from "./messagebody";
// import { isMessageTranslatable } from "utils/util.translate";

export default {
  name: "ConversationWraper",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    "message-body": messagebody
  },
  provide() {
    return {
      root: this
    };
  },
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
  data() {
    return { parsedMessages: [] };
  },
  // computed: {
  //   parsedMessages() {
  //     return this.messages.map(message => {
  //       if (this.adapter) {
  //         return this.adapter(message);
  //       }
  //       return message;
  //     });
  //   }
  // },
  watch: {
    messages() {
      this.buildMessages();
    }
  },
  created() {
    this.buildMessages();
  },
  // media 媒体类型消息不显示背景
  methods: {
    // isMessageTranslatable,
    buildMessages() {
      this.parsedMessages = this.messages.map(message => {
        if (this.adapter) {
          return this.adapter(message);
        }
        return message;
      });
    },
    // translateMessage(message) {
    //   if (READER) return;
    //   this.$emit("translateMessage", message);
    // },
    getMessageClasses(type, IsSend) {
      if (["web", "map", "card", "file"].includes(type)) {
        return "message-regular";
      }
      return [
        "voice",
        "audio",
        "video",
        "image",
        "redenvelope",
        "transferaccount"
      ].includes(type)
        ? "message-media"
        : IsSend
        ? "message-normal"
        : "message-regular";
    },
    messageClick(message, event) {
      this.$emit("viewClick", { item: message, event, type: "" });
    }
  }
};
</script>

<style lang="scss" scoped>
$tri-angle-width: 8px;

#conversation-wraper {
  padding: 10px 0;
  background-color: rgb(255, 255, 255);

  .item {
    min-height: 60px;
    margin-bottom: 20px;
    position: relative;

    &.pengyouquan-line {
      margin-bottom: 0px;
      // padding-bottom: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .time {
      display: flex;
      justify-content: center;
      margin-bottom: 5px;

      > span {
        font-size: 12px;
        border-radius: 4px;
        padding: 0 10px;
        background-color: #ccc;
        color: #fff;
      }
    }

    .main-systemmsg {
      display: flex;
      justify-content: center;

      span {
        font-size: 13px;
        border-radius: 4px;
        padding: 0 10px;
        background-color: rgb(202, 202, 202);
        color: #fff;
      }
    }
    .item-checkbox {
      display: block;
      width: 30px;
      height: 30px;
      position: absolute;
      top: 50%;
      left: 10px;
      cursor: pointer;
      font-size: 22px;
      user-select: none;
      input {
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
        &:hover input ~ .checkbox-marker {
          background-color: #ccc;
        }
        &:checked ~ .checkbox-marker {
          background-color: #6a52f6;
        }
        &:checked ~ .checkbox-marker:after {
          display: block;
        }
      }
      .checkbox-marker {
        width: 25px;
        height: 25px;
        position: absolute;
        background-color: rgb(201, 201, 201);
        &:after {
          left: 8px;
          top: 2px;
          width: 9px;
          height: 18px;
          border: solid white;
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
          content: "";
          position: absolute;
          display: none;
        }
      }
    }
    .main {
      display: flex;
      padding: 5px 20px;
      padding-left: 40px;

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
        max-width: calc(100% - 100px);
        display: flex;
        flex-direction: column;

        .name-wrapper {
          display: flex;

          .name {
            font-size: 13px;
            position: relative;
            white-space: nowrap;
            .delete-image {
              position: absolute;
              top: -10px;
              z-index: 2;
            }
          }
        }

        // 正常灰色
        .message-regular {
          flex-direction: row-reverse;
          border-radius: 5px;
          border-top-right-radius: 0px;

          .message-back {
            background-color: rgb(235, 235, 235);
            &:after {
              border-top: $tri-angle-width solid rgb(235, 235, 235);
              right: -5px;
              top: 0;
            }
          }
        }
        // 纯白背景
        .message-media {
          .message-back {
            background-color: rgb(255, 255, 255);
            &:after {
              border-top: $tri-angle-width solid rgb(255, 255, 255);
            }
          }
        }
        .message {
          flex-direction: row-reverse;
          border-radius: 5px;
          border-top-right-radius: 0px;
          font-size: 14px;
          display: flex;
          padding: 5px;
          .relative-wrap {
            display: flex;
            // position: relative;
            .function-bar {
              width: 80px;
              min-width: 80px;
              display: flex;
              align-items: flex-end;
              .item-flag {
                height: 30px;
                line-height: 30px;
                i {
                  font-size: 30px;
                }
              }
              .item-transtale {
                cursor: pointer;
              }
              .item-selected {
                color: red;
              }
            }
          }
          .message-back {
            position: relative;
            max-width: 100%;
            padding: 5px;
            display: inline-block;
            word-wrap: break-word;
            // background-color: rgb(235, 235, 235);
            border-radius: 5px;

            &:after {
              position: absolute;
              display: block;
              content: "";
              width: 0;
              height: 0;
              right: -5px;
              top: 0;
              border-left: $tri-angle-width solid transparent;
              border-right: $tri-angle-width solid transparent;
              // border-top: $tri-angle-width solid rgb(235, 235, 235);
            }
          }
        }
        .voice-text {
          width: 100%;
          .error-text {
            color: red;
          }
          span {
            color: #158bec;
          }
        }
      }

      &.left {
        flex-direction: row;

        .avatar {
          margin-right: 10px;
        }

        .main-content {
          .name-wrapper {
            flex-direction: row;

            .name {
              .delete-image {
                right: 0;
              }
              &:before {
                display: inline-block;
                content: attr(name);
                margin-right: 5px;
              }

              &:after {
                display: inline-block;
                content: attr(time);
                font-size: 12px;
              }
            }
          }

          .message-media {
            flex-direction: row;
            border-radius: 5px;
            border-top-left-radius: 0px;

            .message-back {
              &:after {
                left: -5px;
                top: 0;
              }
            }
          }
          .message {
            flex-direction: row;
            border-radius: 5px;
            border-top-left-radius: 0px;
            .relative-wrap {
              flex-direction: row-reverse;
            }
            .message-back {
              &:after {
                left: -5px;
                top: 0;
              }
            }
          }
        }

        .voice-text {
          padding-right: 85px;
        }
      }

      &.right {
        flex-direction: row-reverse;

        .avatar {
          margin-right: 0;
          margin-left: 10px;
        }

        .main-content {
          .name-wrapper {
            flex-direction: row-reverse;

            .name {
              .delete-image {
                left: 0;
              }
              &:after {
                display: inline-block;
                content: attr(name);
              }

              &:before {
                display: inline-block;
                content: attr(time);
                font-size: 12px;
                margin-right: 5px;
              }
            }
          }
          .message {
            .relative-wrap {
              .function-bar {
                flex-direction: row-reverse;
              }
            }
          }
          // 正常灰色
          .message-regular {
            .message-back {
              background-color: rgb(235, 235, 235);
              &:after {
                border-top: $tri-angle-width solid rgb(235, 235, 235);
              }
            }
          }
          // 纯白背景
          .message-media {
            .message-back {
              background-color: rgb(255, 255, 255);
              &:after {
                border-top: $tri-angle-width solid rgb(255, 255, 255);
              }
            }
          }
          // 右边 蓝色背景
          .message-normal {
            .message-back {
              color: white;
              background-color: rgb(21, 139, 236);
              &:after {
                border-top: $tri-angle-width solid rgb(21, 139, 236);
              }
            }
          }
        }
        .voice-text {
          padding-left: 85px;
        }
      }
    }
  }
}
</style>
