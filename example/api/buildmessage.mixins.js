function jp() {}
function fixTimeZoneDate() {}
function buildPreviewUrl() {}
const _ = {};
const MEDIAPATH_SORTED = [
  "StaticPath",
  "StaticPaths", // 收藏的的语音可能会放在这个地方
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
  "recruit",
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

export default {
  methods: {
    makeMsgType(type) {
      return TRANSFORM_TYPE[type] || PREPARED_MESSAGE_TYPE.includes(type)
        ? type
        : "text";
    },
    makeAvatar(message) {
      let url =
        message.PortraitUrl ||
        message.AvatarUrl ||
        require("assets/images/other/message-avatar.png");
      // if (!url) {
      //   url = require(`@/assets/avatar/avatar${Number.parseInt(
      //     Math.random() * 12
      //   )}.png`);
      // }
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
        Time: fixTimeZoneDate(Time),
        Delete: theCollect.Delete == 2,
        DatatableIndex: theCollect.datatableIndex,
        Raw: theCollect,
        Content: theCollect.Content,
        LocationName: theCollect.LocationName,
        // Text:
        items: []
      };
      this.$set(
        collect,
        "Selected",
        this.datatable.temporaryCacheCellSelected[collect.DatatableIndex - 1]
      );
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
            Time: fixTimeZoneDate(comment.Time)
          });
        }
      }
      if (_.get(theCollect, "ResInfos.length")) {
        let filePath = "";
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
                        buildPreviewUrl({
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
              if (!collectItem.Urls.length) collectItem.Urls.push("unknown");
              break;
            case "web":
              collectItem.Title = res.Title || res.Summary;
              collectItem.Url = _.get(res, "Urls[0]") || "";
              collectItem.Icon = res.PicUrl;
              // collectItem.Summary = res.Summary;
              if (collectItem.Title === collectText) collect.Content = "";
              break;
            case "file":
              collectItem.Name = res.Content || res.Title;
              if (collectItem.Name === collectText) collect.Content = "";

              filePath = _.get(res, "LocalPaths[0]");
              if (filePath) {
                collectItem.Url = buildPreviewUrl({
                  cid: Cid,
                  eid: Eid,
                  filePath: _.get(res, "LocalPaths[0]"),
                  isStatic: false
                });
              }

              break;
            case "map":
              collectItem.Title = res.TitleS;
              collectItem.Summary = res.Summary;
              // collectItem.Url = _.get(res, "Urls[0]") || "";
              break;
            default:
              if (collectText && collectText !== collect.Content) {
                collect.items.push({ MsgType: "text", Text: collectText });
                collectText = "";
              }
              break;
          }
        }
      }
      return collect;
    },
    // 每一个messagetype 必须进 PREPARED_MESSAGE_TYPE 管理
    messageAdapter(message) {
      const { Cid, Eid } = message;

      let result = null;
      let temp = jp(message.ComplexContent) || {};

      let messageItem = {
        Key: message.Id,
        Name: message.Name || message.SendNickName,
        UserAccount: message.PhoneNumber || message.SendUserId,
        // -********** for multi ******************┐
        ReceiveName: message.ReceiveNickName || "",
        ReceiveUserAccount: message.ReceiveUserId || "",
        // -********** for multi ****************┘
        AvatarUrl: this.makeAvatar(message),
        IsSend: message.IsSend,
        OriginMsgType: message.MsgType,
        MsgType: this.makeMsgType(message.MsgType, message),
        Delete: message.Delete === 2,
        DatatableIndex: message.datatableIndex,
        Time: fixTimeZoneDate(message.Time),
        Raw: message
      };

      if (message.VoiceText) {
        messageItem.VoiceText = message.VoiceText;
      }
      this.$set(
        messageItem,
        "Selected",
        this.datatable.temporaryCacheCellSelected[
          messageItem.DatatableIndex - 1
        ]
      );

      switch (message.MsgType) {
        case "voice":
        case "image":
          messageItem.Url = "unknow";
          for (const key of MEDIAPATH_SORTED) {
            const path = message[key];
            if (path && key !== "Url") {
              messageItem.Url = buildPreviewUrl({
                cid: Cid,
                eid: Eid,
                filePath: path,
                isStatic: key === "StaticPath"
              });
              break;
            }
            if (path && key === "Url") messageItem.Url = path;
          }
          break;
        case "video":
          if (message.RawPath) {
            messageItem.Url = buildPreviewUrl({
              cid: Cid,
              eid: Eid,
              filePath: message.RawPath
            });
          } else if (message.Url) {
            messageItem.Url = message.Url;
          } else if (message.ThumbPath) {
            messageItem.Url = buildPreviewUrl({
              cid: Cid,
              eid: Eid,
              filePath: message.ThumbPath
            });
          }
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
            ActionText: temp.ActionText || message.Content,
            ThumbUrl: temp.ThumbUrl,
            // Name: temp.Name,
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
        case "imagetext":
          messageItem.Text = temp.Content || message.Content || "";
          messageItem.Urls = temp.RawPaths
            ? temp.RawPaths.map(filePath => {
                return buildPreviewUrl({ cid: Cid, eid: Eid, filePath });
              })
            : [];
          if (temp.Urls && temp.Urls.length) {
            temp.Urls.forEach(url => {
              messageItem.Urls.push(url);
            });
          }
          if (!messageItem.Urls.length) messageItem.Urls = ["unnkow"];
          break;
        case "file":
          messageItem.FileName = temp.Content || message.Content || "";
          if (message.RawPath) {
            messageItem.Url = buildPreviewUrl({
              cid: Cid,
              eid: Eid,
              filePath: message.RawPath
            });
          }
          break;
        // 合并转发消息
        case "multi":
          messageItem.Text = temp.Content || message.Content || "";
          messageItem.MultiMsgs = message.Msgs.map(message =>
            this.messageAdapter(message)
          );
          break;
        case "systemmsg":
          messageItem.Text = temp.Content || message.Content || "";
          break;
        case "recruit":
          // messageItem.Text = message.ComplexContent;
          //job
          if (temp && temp.PositionInfo) {
            messageItem.Company = temp.PositionInfo.Company;
            messageItem.Job = temp.PositionInfo.JobName;
            messageItem.ExpYear = temp.PositionInfo.PositionWorkYear;
            messageItem.Education = temp.PositionInfo.PositionEducation;
            messageItem.Salary = temp.PositionInfo.PositionSalary;
            messageItem.City = temp.PositionInfo.WorkCity;
          }
          //employee E = Employee
          if (temp && temp.JobSeekerInfo) {
            messageItem.employee = temp.JobSeekerInfo.Name;
            messageItem.employeeAvatar = temp.JobSeekerInfo.AvatarUrl;
            messageItem.Age = temp.JobSeekerInfo.Age;
            messageItem.Status = temp.JobSeekerInfo.ApplyStatus;
            messageItem.WorkYear = temp.JobSeekerInfo.JobSeekerWorkYear;
            messageItem.ECity = temp.JobSeekerInfo.City;
            messageItem.Desc = temp.JobSeekerInfo.Desc;
            messageItem.Expactation = temp.JobSeekerInfo.JobExpectation;
            messageItem.ESalary = temp.JobSeekerInfo.JobSalary;
            messageItem.EMajor = temp.JobSeekerInfo.SchoolAndMajor;
            messageItem.EEducation = temp.JobSeekerInfo.JobSeekerEducation;
          }
          messageItem.Text = temp.Content;
          break;
        default:
          messageItem.MsgType = "text";
          messageItem.Text = temp.Content || message.Content || "";
          break;
      }
      // 短信
      if (this.datatable.datatype === "sms") {
        let result = {
          MsgType: "text",
          IsSend: message.Type === "inbox" ? 1 : 2,
          Time: fixTimeZoneDate(message.ReceivedTime),
          UserAccount: message.PhoneNumber,
          OriginMsgType: ""
        };
        Object.assign(messageItem, result);
      }
      return messageItem;
    }
  }
};
