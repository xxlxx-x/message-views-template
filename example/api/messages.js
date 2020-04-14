import moment from "moment";

import messagesContent from "./messages.json";

/**
 * @struct messages struct
 * @avatar string url | ""
 * @text string for normal text
 * @images [string] use <img/>
 * @videos [string] <video type="video/mp4"></video> video
 * @audios [string] <audio type="audio/mpeg"></audio> audio|voice
 * @extensions [object] object = {type:string, content: string|object}
 */

export function messageBuilder(limit = 50, currentPage = 1) {
  let messages = [];
  for (let index = 1; index <= limit; index++) {
    const id =
      moment(new Date())
        .utcOffset(0)
        .format("HHmmss") -
      0 +
      currentPage;

    const avatar = require(`../assets/avatar/avatar${Number.parseInt(
      Math.random() * 12
    )}.png`);
    const textIndex = Number.parseInt(
      Math.random() * messagesContent.text.length
    );
    messages.push({
      id,
      avatar,
      text: messagesContent.text[textIndex],
      images: [""],
      videos: [""],
      audios: [""],
      extensions: []
    });
  }
  console.log("messages", messages);
}
