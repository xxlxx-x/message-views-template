# vue-library-template

+ 一个会话视图、朋友圈、微信收藏的 视图模板，只需要 写好自己数据结构的适配层，然后以props传入 即可。
+ 项目刚开始开发，很多事件和需求并不完善；
+ 项目主要于公司业务，用于展示市面上大多数社交app的会话视图和朋友圈，的通用展示解决方案；

## 目前支持

+ 文本，图片，链接，网页分享，名片，红包，转账

## 推荐使用方式

```bash
git clone https://github.com/xxlxx-x/message-views-template.git

yarn

yarn run dev
```

## 项目介绍

+ example 文件夹下是示例，Scroll2Load.vue 预制了 滚动加载，引入了axios 、 moment 和 lodash
  
## 如何调试适配自己的项目

1. `vue.config.js` 修改proxy 为自己项目的 ip地址
2. `run dev`
3. 打开`Scroll2Load.vue`，更改对应的api 参数请求
4. 页面刷新即可请求数据并应用到适配层，编写自己的adapter，将消息的展示字段更改为自己的项目需求的字段


+ 所有的源代码在src下面的messagebody 里

license： 你可以随便修改和使用里面的代码