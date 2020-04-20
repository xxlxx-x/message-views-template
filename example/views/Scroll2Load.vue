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
      <messagebody :messages="messages" :adapter="messageAdapter"></messagebody>
    </div>
  </div>
</template>

<script>
import { api } from "@/api/api";
import lodash from "lodash";
import messagebody from "components/messagebody/messagebody.vue";

export default {
  name: "Scroll2Load",
  components: {
    messagebody
  },
  //http://127.0.0.1:7878/api/v1/data?cid=1&eid=1&pid=3000065&skip=0&limit=100&userid=1&datatype=immsginfo&category=buddymsg&keyword=Id%20%3C%3D%2084047&oncolumns=&desc=false&columns=&withTagIds=&deepsearch=false&treeType=application
  data() {
    return {
      currentPage: 1,
      limit: 100,
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
            pid: 3000065,
            skip: (this.currentPage - 1) * this.limit,
            limit: this.limit,
            userid: 1,
            datatype: "immsginfo",
            category: "buddymsg",
            keyword: "Id < 84047",
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
    messageAdapter(message) {
      return {
        key: message.Id
      };
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
