<template>
  <div id="message-content">
    <div class="d-flex flex-row my-2">
      <div style="line-height: 40px;width: 80px">当前页：</div>
      <v-text-field
        solo
        flat
        dense
        outlined
        hideDetails
        v-model="currentPage"
      ></v-text-field>
      <div style="line-height: 40px;width: 80px">条目：</div>
      <v-text-field
        solo
        flat
        dense
        outlined
        hideDetails
        v-model="limit"
      ></v-text-field>
      <v-btn depressed class="info mx-1" @click="refresh">刷新</v-btn>
    </div>
    <p>总数： {{ totalCount }}</p>
    <div id="scroll2load">
      <!-- <conversation
        :messages="messages"
        :adapter="messageAdapter"
        @messageClick="onMessageClick"
      ></conversation> -->

      <collection :collections="messages" :adapter="collectAdater"></collection>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { api } from "@/api/api";
import _ from "lodash";
import moment from "moment";
import collection from "components/messagebody/collection";
import conversation from "components/messagebody/conversation.vue";

const MEDIAPATH_SORTED = [
  "StaticPath",
  "ThumbPath",
  "LocalPaths",
  "RawPath",
  "Urls",
  "Url"
];
const PREPARED_MESSAGE_TYPE = [
  "systemmsg",
  "image",
  "voice",
  "video",
  "web",
  "redenvelope",
  "imagetext",
  "transferaccount",
  "map",
  "card",
  "file",
  "multi"
];
const TRANSFORM_TYPE = {
  voice: "audio",
  transferacount: "transfer",
  qqzone: "web"
};
const BLOG_PERSONS_COUNTS = [
  { Icon: "iconicon_share", Title: "转发", Key: "RtCount" },
  { Icon: "iconicon_message", Title: "评论", Key: "CommentCount" },
  { Icon: "iconlike", Title: "点赞", Key: "LikeCount" },
  { Icon: "iconicon_star", Title: "收藏", Key: "StarCount" }
];
export const jp = str => {
  let obj = {};
  if (str) {
    try {
      obj = JSON.parse(str);
    } catch (err) {
      console.log("json parse error", err);
    }
  }
  return obj;
};

export default {
  name: "Scroll2Load",
  components: {
    conversation,
    collection
  },
  //http://127.0.0.1:7878/api/v1/data?cid=1&eid=1&pid=3000065&skip=0&limit=100&userid=1&datatype=immsginfo&category=buddymsg&keyword=Id%20%3C%3D%2084047&oncolumns=&desc=false&columns=&withTagIds=&deepsearch=false&treeType=application
  data() {
    return {
      currentPage: 1,
      limit: 20,
      totalCount: 0,
      messages: [],
      datatype: "imsnsinfo",
      throttleFunc: null
    };
  },
  methods: {
    refresh() {
      this.request().then(data => {
        this.messages = data.data;
        this.totalCount = data.count;
      });
    },
    request() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        api
          .getData({
            //火眼
            cid: 1,
            eid: 1,
            pid: 26000400,
            skip: (this.currentPage - 1) * this.limit,
            limit: this.limit,
            userid: 1,
            datatype: this.datatype,
            category: "wechatmoment",
            keyword: "",
            oncolumns: "",
            desc: false,
            columns: "",
            withTagIds: "",
            deepsearch: false,
            treeType: "application"
          })
          .then(({ data }) => {
            resolve(data);
          });
      });
    },
    loadMoreMessages(event) {
      const theElement = event.target;
      const totalCount = this.totalCount;
      let dataLength = this.messages.length;
      if (
        theElement.scrollHeight -
          theElement.scrollTop -
          theElement.clientHeight <
        100
      ) {
        if (totalCount > dataLength) {
          this.currentPage++;
          this.request().then(data => {
            console.log(data.data, this.messages);
            this.messages = this.messages.concat(data.data);
          });
        }
      }
    },
    onMessageClick(message, event) {
      console.log("event", message, event);
    },
    buildPreviewUrl(params) {
      const { isStatic, filePath, cid, eid } = params;
      const append = isStatic
        ? `/res/${cid || 1}/${encodeURIComponent(filePath)}`
        : `/file/content?cid=${cid || 1}&eid=${eid}&path=${encodeURIComponent(
            filePath
          )}`;
      return `http://127.0.0.1:7878/api/v1${append}`;
    },
    makeMsgType(type) {
      return TRANSFORM_TYPE[type] || PREPARED_MESSAGE_TYPE.includes(type)
        ? type
        : "text";
    },
    makeAvatar(message) {
      let url = message.PortraitUrl || message.AvatarUrl;
      if (!url) {
        url = require(`@/assets/avatar/avatar${Number.parseInt(
          Math.random() * 12
        )}.png`);
      }
      return url;
    },
    collectAdater(theCollect) {
      if (!theCollect) return;
      const { Cid, Eid } = theCollect;
      const { Avatar, PortraitUrl, UserId, Time } = theCollect;

      let collect = {
        Key: theCollect.Id,
        Name: theCollect.Name || "",
        UserAccount: UserId || "",
        AvatarUrl: Avatar
          ? "data:image/jpeg;base64" + Avatar
          : PortraitUrl
          ? PortraitUrl
          : this.makeAvatar({}),
        Time: moment(Time)
          .utcOffset(0)
          .format("YYYY-HH-MM HH:mm:ss"),
        Deleted: theCollect.Delete == 2,
        Raw: theCollect,
        // Text:
        items: []
      };
      // 转发 评论 点赞 收藏 计数
      collect.Counts = [];
      BLOG_PERSONS_COUNTS.forEach(item => {
        const { Key } = item;
        let Counter = {
          ...item,
          Value: 0
        };
        if (theCollect[Key]) {
          Counter.Value = theCollect[Key];
          collect.Counts.push(Counter);
        }
      });
      //点赞人
      if (theCollect.LikeInfo) {
        collect.LikeNames = [];
        for (let person of theCollect.LikeInfo) {
          collect.LikeNames.push(person.Name);
        }
      }
      //评论
      if (_.get(theCollect, "Comments.length")) {
        collect.Comments = [];
        for (let comment of theCollect.Comments) {
          collect.Comments.push({
            Author: comment.Name,
            Target: comment.ReplyToName,
            Content: comment.Content,
            Time: moment(comment.Time)
              .utcOffset(0)
              .format("YYYY-HH-MM HH:mm:ss")
          });
        }
      }
      if (_.get(theCollect, "ResInfos.length")) {
        let collectText = theCollect.Content;
        for (let res of theCollect.ResInfos) {
          let collectItem = { MsgType: res.Type, Urls: [] };
          collect.items.push(collectItem);

          if (res.Content || res.Summary) {
            collectText = res.Content || res.Summary;
          }
          switch (res.Type) {
            case "image":
            case "video":
            case "audio":
              MEDIAPATH_SORTED.forEach(item => {
                if (_.get(res, `${item}.length`)) {
                  res[item].forEach(path => {
                    if (!path) return;
                    if (item.includes("Url")) {
                      collectItem.Urls.push(path);
                    } else {
                      collectItem.Urls.push(
                        this.buildPreviewUrl({
                          cid: Cid,
                          eid: Eid,
                          filePath: path,
                          isStatic: item === "StaticPaths"
                        })
                      );
                    }
                  });
                }
              });

              break;
            case "web":
              collectItem.Title = res.Title || res.Summary;
              if (collectItem.Title === collectText) collectText = "";
              collectItem.Icon = res.PicUrl;
              collectItem.Url = _.get(res, "Urls[0]") || "";
              break;
            case "file":
              collectItem.Name = res.Content || res.Title;
              if (collectItem.Name === collectText) collectText = "";
              collectItem.Url = this.buildPreviewUrl({
                cid: Cid,
                eid: Eid,
                filePath: _.get(res, "LocalPaths[0]") || "",
                isStatic: false
              });
              break;
            case "map":
              collectItem.Title = res.TitleS;
              collectItem.Summary = res.Summary;
              // collectItem.Url = _.get(res, "Urls[0]") || "";
              break;
          }
        }
        if (collectText) {
          collect.items.unshift({ Type: "text", Text: collectText });
        }
      }
      return collect;
    },
    messageAdapter(message) {
      const { Cid, Eid } = message;
      let result = null;
      let temp = jp(message.ComplexContent);

      let messageItem = {
        Key: message.Id,
        Name: message.Name || message.SendNickName,
        UserAccount: message.PhoneNumber || message.SendUserId,
        AvatarUrl: this.makeAvatar(message),
        IsSend: message.IsSend,
        OriginMsgType: message.MsgType,
        MsgType: this.makeMsgType(message.MsgType),
        Delete: message.Delete === 2,
        Time: moment(message.Time)
          .utcOffset(0)
          .format("YYYY-HH-MM HH:mm:ss"),
        Raw: message
      };

      switch (message.MsgType) {
        case "image":
        case "voice":
          message.Url = "unknow";
          for (const key of MEDIAPATH_SORTED) {
            const path = message[key];
            if (path && key !== "Url") {
              messageItem.Url = this.buildPreviewUrl({
                cid: Cid,
                eid: Eid,
                filePath: path,
                isStatic: key === "StaticPath"
              });
              break;
            }
            if (path && key === "Url") messageItem.Url = path;
          }
          // console.log("image/voice Urls", message.Url);
          break;
        case "video":
          if (message.RawPath) {
            messageItem.Url = this.buildPreviewUrl({
              cid: Cid,
              eid: Eid,
              filePath: message.RawPath
            });
          } else if (message.Url) {
            messageItem.Url = message.Url;
          } else if (message.ThumbPath) {
            messageItem.Url = this.buildPreviewUrl({
              cid: Cid,
              eid: Eid,
              filePath: message.ThumbPath
            });
          }
          // console.log("image/voice Urls", message.Url);
          break;
        case "map":
          result = {
            Title: temp.Title,
            Summary: temp.Summary,
            Longitude: temp.Longitude,
            Latitude: temp.Latitude
          };
          Object.assign(messageItem, result);
          break;
        case "card":
          result = {
            Account: temp.Account,
            Name: temp.Name,
            Flag: temp.Flag
          };
          Object.assign(messageItem, result);
          break;
        case "web":
          result = {
            Title: temp.Title,
            PictureLocalPath: temp.PictureLocalPath,
            PictureUrl: temp.PictureUrl,
            Summary: temp.Summary,
            FromAppIconUrl: temp.FromAppIconUrl,
            FromAppName: temp.FromAppName,
            Url: temp.Url
          };
          Object.assign(messageItem, result);
          break;
        case "redenvelope":
          result = {
            Title: temp.Title,
            ActionText: temp.ActionText,
            ThumbUrl: temp.ThumbUrl,
            Name: temp.Name,
            Money: temp.Money
          };
          Object.assign(messageItem, result);
          break;
        case "transferaccount":
          result = {
            Title: temp.Title,
            Summary: temp.Summary,
            Url: temp.Url,
            SumNotemary: temp.Note,
            Name: temp.Name
          };
          Object.assign(messageItem, result);
          break;
        default:
          messageItem.Text = message.Content;
          break;
      }

      return messageItem;
    }
  },
  created() {
    this.throttleFunc = _.throttle(this.loadMoreMessages, 500, {
      leading: true
    }).bind(this);
  },
  mounted() {
    const scrollWraper = document.getElementById("scroll2load");
    scrollWraper.addEventListener("scroll", this.throttleFunc);
  },
  beforeDestroy() {
    const scrollWraper = document.getElementById("scroll2load");
    scrollWraper.removeEventListener("scroll", this.throttleFunc);
  }
};
</script>

<style lang="scss" scoped>
#message-content {
  width: 100%;
  .search-wraper {
    margin-bottom: 10px;
    input {
      width: 500px;
      margin: 0 10px;
    }
  }
  #scroll2load {
    width: 700px;
    height: 700px;
    border: 1px solid #aaaaaa44;
    margin: auto;
    overflow-y: auto;
  }
}
</style>
