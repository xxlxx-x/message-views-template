<template>
  <div id="conversation-wraper">
    <div
      class="item"
      v-for="(item, index) in parsedMessages"
      :key="`${item.Key}_${index}`"
    >
      <div class="time">
        <span>{{ item.Time }}</span>
      </div>
      <div class="main-systemmsg" v-if="item.MsgType === 'systemmsg'">
        <span>{{ item.Text }}</span>
      </div>
      <template v-else>
        <div
          :class="[
            'main',
            { left: item.IsSend === 1, right: item.IsSend === 2 }
          ]"
        >
          <img
            class="avatar"
            :src="item.AvatarUrl"
            @click="event => messageClick(item, event)"
          />
          <div class="main-content">
            <div class="name-wrapper">
              <div class="name">
                {{ item.Name }} ({{ item.Time }})
                <span style="color:red">
                  {{ item.MsgType }}---{{ item.OriginMsgType }}</span
                >
              </div>
            </div>
            <div :class="getMessageClasses(item.MsgType)">
              <message-body
                :message="item"
                @messageClick="messageClick"
              ></message-body>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import messagebody from "components/messagebody/messagebody";

export default {
  name: "conversation-wraper",
  components: {
    "message-body": messagebody
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
  computed: {
    parsedMessages() {
      return this.messages.map(message => {
        if (this.adapter) {
          return this.adapter(message);
        }
        return message;
      });
    }
  },
  // web map
  methods: {
    getMessageClasses(type) {
      return ["voice", "audio", "video", "pictrue"].includes(type)
        ? "message-media"
        : "message";
    },
    messageClick(message, event) {
      console.log("message", message, event);
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
            white-space: nowrap;
            font-size: 13px;
          }
        }

        .message-media {
          font-size: 14px;
          display: flex;
          padding: 5px;

          div {
            position: relative;
            max-width: 100%;
            padding: 5px;
            display: inline-block;
            word-wrap: break-word;
            background-color: rgb(235, 235, 235);
            border-radius: 5px;

            &:after {
              position: absolute;
              display: block;
              content: "";
              width: 0;
              height: 0;
              border-left: $tri-angle-width solid transparent;
              border-right: $tri-angle-width solid transparent;
              border-top: $tri-angle-width solid rgb(235, 235, 235);
            }
          }
        }
        .message {
          font-size: 14px;
          display: flex;
          padding: 5px;

          div {
            position: relative;
            max-width: 100%;
            padding: 5px;
            display: inline-block;
            word-wrap: break-word;
            background-color: rgb(235, 235, 235);
            border-radius: 5px;

            &:after {
              position: absolute;
              display: block;
              content: "";
              width: 0;
              height: 0;
              border-left: $tri-angle-width solid transparent;
              border-right: $tri-angle-width solid transparent;
              border-top: $tri-angle-width solid rgb(235, 235, 235);
            }
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

            div {
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

            div {
              &:after {
                left: -5px;
                top: 0;
              }
            }
          }
        }
      }

      &.right {
        flex-direction: row-reverse;

        .avatar {
          margin-left: 10px;
        }

        .main-content {
          .name-wrapper {
            flex-direction: row-reverse;

            .name {
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
          .message-media {
            flex-direction: row-reverse;
            border-radius: 5px;
            border-top-right-radius: 0px;

            div {
              background-color: rgb(255, 255, 255);
              &:after {
                border-top: $tri-angle-width solid rgb(255, 255, 255);
                right: -5px;
                top: 0;
              }
            }
          }
          .message {
            flex-direction: row-reverse;
            border-radius: 5px;
            border-top-right-radius: 0px;

            div {
              color: white;
              background-color: rgb(21, 139, 236);
              &:after {
                border-top: $tri-angle-width solid rgb(21, 139, 236);
                right: -5px;
                top: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
