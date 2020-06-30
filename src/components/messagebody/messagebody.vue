<template>
  <div class="message-body">
    <template v-if="message.MsgType === 'image'">
      <div class="image">
        <img
          :src="message.Url"
          @click="
            event =>
              root.$emit('viewClick', {
                url: message.Url,
                item: message,
                event
              })
          "
        />
      </div>
    </template>
    <template v-if="message.MsgType === 'imagetext'">
      <div class="text" v-html="message.Text" />
      <div class="image">
        <template v-for="(Url, index) in message.Urls">
          <img
            :src="Url"
            :key="index"
            @click="
              event =>
                root.$emit('viewClick', {
                  url: Url,
                  item: message,
                  event
                })
            "
          />
        </template>
      </div>
    </template>
    <template v-if="message.MsgType === 'voice'">
      <div class="voice">
        <audio :src="message.Url" controls />
      </div>
    </template>
    <template v-if="message.MsgType === 'video'">
      <div class="audio">
        <video :src="message.Url" controls />
      </div>
    </template>
    <template v-if="message.MsgType === 'map'">
      <div class="map">
        <img class="map-img" src="../images/map.png" />
        <div class="map-desc">
          <div>{{ message.Title }}</div>
          <div>{{ message.Summary }}</div>
        </div>
      </div>
    </template>
    <template v-if="message.MsgType === 'card'">
      <div class="card">
        <div class="card-main">
          <img class="card-img" src="../images/tx.svg" />
          <div class="card-desc">
            <div class="card-title">{{ message.Name }}</div>
            <div :title="message.Account" class="card-info">
              {{ message.Account }}
            </div>
          </div>
        </div>
        <div class="card-flag">{{ message.Flag }}</div>
      </div>
    </template>
    <template v-if="message.MsgType === 'web'">
      <div class="web">
        <div class="web1">
          <div class="web1-desc">
            <p
              v-if="message.Url"
              class="web-title"
              target="blank"
              @click.stop="
                event => {
                  root.$emit('clickLink', { item: message, event });
                }
              "
            >
              {{ message.Title }}
            </p>
            <p v-else>{{ message.Title }}</p>
            <p>{{ message.Summary }}</p>
          </div>
          <div v-if="message.PictureUrl" class="web1-img-content">
            <img
              :src="message.PictureUrl"
              class="web1-img"
              @click="
                event =>
                  root.$emit('viewClick', {
                    url: message.PictureUrl,
                    item: message,
                    event
                  })
              "
            />
          </div>
        </div>
        <div class="desc">
          {{ message.Content }}
        </div>
      </div>
    </template>
    <template v-if="message.MsgType === 'file'">
      <div class="web">
        <div class="web1">
          <div class="web1-desc">
            <p
              v-if="message.Url"
              class="web-title"
              target="blank"
              @click.stop="
                event => {
                  root.$emit('clickLink', { item: message, event });
                }
              "
            >
              {{ message.FileName }}
            </p>
            <p v-else>{{ message.FileName }}</p>
          </div>
        </div>
      </div>
    </template>
    <template v-if="message.MsgType === 'recruit'">
      <div>
        <div class="job-content">
          <div class="header">
            <div class="job">{{ message.Company }} {{ message.Job }}</div>
            <div class="salary">{{ message.Salary }}</div>
          </div>
          <div class="request">
            <div v-if="message.Education" class="education">
              {{ message.Education }}
            </div>
            <div v-if="message.City" class="pop">
              {{ message.City }}
            </div>
          </div>
          <div class="message-bar">
            <div class="status"></div>
          </div>
        </div>
        <div class="job-content">
          <div class="employee">
            <div class="employee-header">
              <div class="employee-info">
                <p>
                  {{ message.employee }}
                  <span class="status">{{ message.Status }}</span>
                </p>
                <div class="desc">
                  <i class="iconfont iconweizhi3 iconitem"></i>
                  <span class="textitem">{{ message.ECity }}</span>
                  <i class="iconfont iconbag iconitem"></i>
                  <span class="textitem">
                    {{ message.WorkYear }}
                    <span class="gutter">·</span>
                    {{ message.Age }}
                  </span>
                  <i class="iconfont iconxueli iconitem"></i>
                  <span class="textitem">{{ message.EEducation }}</span>
                </div>
              </div>
              <img :src="message.employeeAvatar" class="avatar" />
            </div>
            <div class="employee-desc">
              {{ message.Desc }}<br />
              {{ message.EMajor }}<br />
              {{ message.Expactation }}
              <span class="green-text">
                {{ message.ESalary }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="message.MsgType === 'redenvelope'">
      <div class="redenvelope">
        <img class="redenvelope-img" src="../images/hb.svg" />
        <div class="redenvelope-desc">
          <div>{{ message.Title }}</div>
          <div>{{ message.ActionText }}</div>
          <div>{{ message.Money }}</div>
        </div>
      </div>
    </template>
    <template v-if="message.MsgType === 'transferaccount'">
      <div class="transferaccount">
        <img class="transferaccount-img" src="../images/zz.svg" />
        <div class="transferaccount-desc">
          <div>{{ message.Summary }}</div>
          <div>{{ message.Title }}</div>
          <div>{{ message.Name }}</div>
        </div>
      </div>
    </template>
    <template v-if="message.MsgType === 'multi'">
      <template v-for="(multi, index) in message.MultiMsgs">
        <div :key="index" class="multi">
          <p
            :class="message.IsSend === 1 ? 'left' : 'right'"
            :title="
              `${multi.Name}(${multi.UserAccount}) 发送给：${multi.ReceiveName}(${multi.ReceiveUserAccount}) `
            "
          >
            <span class="user-name">
              {{ multi.Name || multi.UserAccount }}
            </span>
            发送给：
            <span class="user-name">
              {{ multi.ReceiveName || multi.ReceiveUserAccount }}
            </span>
            <span class="time"> ( {{ multi.Time }} ) </span>
          </p>
          <message-body :message="multi"></message-body>
        </div>
      </template>
    </template>
    <template v-if="message.Text">
      <div class="text" @click="emitClick" v-html="message.Text" />
    </template>
    <!-- {{ message }} -->
  </div>
</template>

<script>
export default {
  name: "MessageBody",
  inject: ["root"],
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    emitClick(event) {
      this.root.$emit("clickLink", { item: this.message, event });
      event.preventDefault();
    }
  }
};
</script>

<style lang="scss" scoped>
.message-body {
  min-width: 30px;
  min-height: 30px;
  .text {
    text-align: left;
    word-break: break-all;
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
  .voice {
    margin: -4px -3px -8px;
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
        .web-title {
          color: rgb(74, 122, 255);
          text-decoration: underline;
          cursor: pointer;
          font-size: 16px;
          font-weight: 400;
        }

        p {
          word-break: break-all;
          font-size: 1rem;
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
        font-size: 1rem;
        margin-bottom: 5px;
      }
    }
  }

  .card {
    .card-main {
      display: flex;
      width: 260px;
      .card-img {
        max-width: 50px;
        min-width: 50px;
        margin-right: 10px;
      }
      .card-desc {
        text-align: left;
        width: calc(100% - 80px);
        margin-right: 20px;
        .card-title {
          font-size: 18px;
          font-weight: 400;
        }
        .card-info {
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          display: -webkit-box;
        }
      }
    }
    .card-flag {
      width: 100%;
      margin-top: 5px;
      padding-top: 5px;
      text-align: left;
      border-top: 1px solid rgba(218, 218, 218, 0.562);
    }
  }

  .image {
    img {
      max-height: 100px;
    }
  }
  .audio {
    video {
      max-width: 300px;
      max-height: 300px;
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
      div:nth-child(3) {
        border-top: 1px solid rgba(255, 255, 255, 0.514);
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

    // .imsnsinfo-res-info {
    // }

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
  .multi {
    border-bottom: 1px dashed black;
    margin: 10px 0;
    padding: 0 10px;
    p.left {
      .user-name {
        color: rgb(18, 84, 228);
      }
    }
    p.right {
      .user-name {
        color: rgb(238, 224, 224);
      }
    }
  }
  .job-content {
    max-width: 450px;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    background-color: #fff;
    .green-text {
      color: rgba(9, 190, 175, 0.87);
    }
    .header {
      display: flex;
      justify-content: end;
      .job {
        font-size: 18px;
        width: 100%;
        word-spacing: 10px;
        line-height: 18px;
      }
      .salary {
        width: 130px;
        color: rgba(9, 190, 175, 0.87);
      }
    }
    .request {
      .education {
        display: inline-block;
        padding: 2px;
        margin-right: 10px;
        border-radius: 2px;
      }
      .pop {
        display: inline-block;
        background-color: rgb(243, 243, 243);
        padding: 2px 5px;
        margin: 10px 0;
        border-radius: 2px;
      }
    }
    .employee {
      .employee-header {
        display: flex;
        .employee-info {
          flex-grow: 1;
          .desc {
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            margin-left: -5px;
            margin-right: -5px;
            padding: 0 5px;
            color: #999;
            font-size: 12px;
            padding-top: 5px;
            .iconitem {
              font-size: 16px;
              margin-right: 2px;
              color: rgba(9, 190, 175, 0.87);
            }
            .textitem {
              margin-right: 10px;
              font-size: 14px;
            }
          }
          p {
            font-size: 18px;
            .status {
              font-size: 15px;
              color: rgb(179, 179, 179);
            }
          }
        }
        img.avatar {
          width: 60px;
          height: 60px;
          margin-left: 15px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
