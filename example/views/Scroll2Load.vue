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
      <conversation
        :messages="messages"
        :adapter="messageAdapter"
        @messageClick="onMessageClick"
      ></conversation>
    </div>
  </div>
</template>

<script>
import { api } from "@/api/api";
import lodash from "lodash";
import moment from "moment";
import conversation from "components/messagebody/conversation.vue";

const MEDIAPATH_SORTED = ["StaticPath", "ThumbPath", "RawPath", "Url"];
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
    conversation
  },
  //http://127.0.0.1:7878/api/v1/data?cid=1&eid=1&pid=3000065&skip=0&limit=100&userid=1&datatype=immsginfo&category=buddymsg&keyword=Id%20%3C%3D%2084047&oncolumns=&desc=false&columns=&withTagIds=&deepsearch=false&treeType=application
  data() {
    return {
      currentPage: 1,
      limit: 10,
      totalCount: 0,
      messages: [],
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
            // 取综
            // cid: 285,
            // eid: 1201,
            // pid: 157000031,
            // skip: 0,
            // limit: 100,
            // userid: 1,
            // datatype: "immsginfo",
            // category: "troopmsg",
            // keyword: "",
            // oncolumns: "",
            // desc: false,
            // columns: "",
            // withTagIds: "",
            // deepsearch: false,
            // treeType: "application"
            //火眼
            cid: 1,
            eid: 1,
            pid: 26000120,
            skip: (this.currentPage - 1) * this.limit,
            limit: this.limit,
            userid: 1,
            datatype: "immsginfo",
            category: "buddymsg",
            keyword: 'MsgType == "card"',
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
    makeName(message) {
      let name;
      if (message.Name) {
        name = message.Name;
      } else {
        name = `${message.SendNickName}(${message.SendUserId})`;
      }
      return name;
    },
    messageAdapter(message) {
      let messageItem = {
        Key: message.Id,
        MsgType: this.makeMsgType(message.MsgType),
        OriginMsgType: message.MsgType,
        IsSend: message.IsSend,
        Time: moment(message.Time)
          .utcOffset(0)
          .format("YYYY-HH-MM HH:mm:ss"),
        AvatarUrl: this.makeAvatar(message),
        Name: this.makeName(message),
        Raw: message
      };
      let result = null;
      let temp = jp(message.ComplexContent);
      switch (message.MsgType) {
        case "image":
        case "voice":
          message.Url = "unknow";
          for (const key of MEDIAPATH_SORTED) {
            const path = message[key];
            if (path && key !== "Url") {
              const { Cid, Eid } = message;
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
    this.throttleFunc = lodash
      .throttle(this.loadMoreMessages, 500, { leading: true })
      .bind(this);
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
