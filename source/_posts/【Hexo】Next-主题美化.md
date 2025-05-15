---
title: 【Hexo】Next 主题的使用与美化
date: 2025-01-16 14:04:12
tags:
- Hexo
categories:
- Hexo
---

## 一、简介

Next 主题是 [Hexo](https://hexo.io/zh-cn) 上使用最广，同时在 GitHub 上也是 Star 最多的主题，bug 修复和功能更新也比较快。当前博客就是使用 Hexo 配合 Next 主题搭建的

## 二、版本

在 GitHub 上的 `Next` 的官方文档：[【必读】更新说明及常见问题](https://github.com/next-theme/hexo-theme-next/issues/4) 中有相关说明，Next 一共有三个不同的仓库：

版本|年份|仓库|
:---:|:--:|:--:
v5.1.4 或更低|2014 ~ 2017|[iissnan/hexo-theme-next](https://github.com/iissnan/hexo-theme-next)|
v6.0.0 ~ v7.8.0|2018 ~ 2019|[theme-next/hexo-theme-next](https://github.com/theme-next/hexo-theme-next)|
v8.0.0 或更高|2020|[next-theme/hexo-theme-next](https://github.com/next-theme/hexo-theme-next)|

<!-- more -->

旧的仓库基本上已经不再更新，因此推荐选择最新的 [next-theme/hexo-theme-next](https://github.com/next-theme/hexo-theme-next) 仓库的 Next 主题

我所使用的版本如下：

``` swift
hexo: 5.4.2
next: 7.8.0
```

## 三、安装

推荐使用 GitHub 进行安装，可以随时更新

``` swift
$ cd hexo文件目录
$ git clone https://github.com/theme-next/hexo-theme-next themes/next
```

然后设置站点配置文件 `_config.yml`:

``` swift
$ theme: next
```

即可将我们的 Hexo 博客主题替换为 Next 主题。

## 四、配置

### 1、基础配置

对 Next 主题的配置可以直接在 Hexo 仓库下的配置文件 `_config.next.yml` 中进行修改即可，该文件的修改会在生成页面时覆盖主题目录下的配置文件 `.\themes\next\_config.yml`

衍生拓展：[【Hexo】配置文件优先级](https://hexo.io/zh-cn/docs/configuration#使用代替主题配置文件)

#### 风格/主题

Next 主题包含了 4 个风格，分别是Muse、Mist、Pisces、Gemini，我个人更喜欢 **Gemini**，这种风格类似卡片，边界感会比较明显，如果加上圆角的话会更为突出

``` swift
# Schemes
#scheme: Muse
#scheme: Mist
#scheme: Pisces
scheme: Gemini
```

修改 `_config.next.yml` 之后，用 `hexo clean; hexo g; hexo s` 重新生成一下，就可以在 本地 预览了 **（后续流程如果没有特殊说明则基本一致）**

初始 4 种风格效果如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/NextTheme.jpg)

美化后的 **Gemini** 风格效果如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/Gemini.jpg)

#### 网页图标

在各类网站上下载合适图标，按照配置文件中的文件名命名，并放在 `themes/next/source/images` 下即可

``` swift
favicon:
  small: /images/favicon-16x16-next.png
  medium: /images/favicon-32x32-next.png
  apple_touch_icon: /images/apple-touch-icon-next.png
  safari_pinned_tab: /images/logo.svg
  #android_manifest: /images/manifest.json
  #ms_browserconfig: /images/browserconfig.xml
```

#### 菜单栏

菜单栏配置默认没有开启，我个人开启了 `首页、标签、分类、归档、搜索` 五个子项目，开启图标，但是没有显示数量

``` swift
# Usage: `Key: /link/ || icon`
# Key is the name of menu item. If the translation for this item is available, the translated text will be loaded, otherwise the Key name will be used. Key is case-senstive.
# Value before `||` delimiter is the target link, value after `||` delimiter is the name of Font Awesome icon.
# When running the site in a subdirectory (e.g. yoursite.com/blog), remove the leading slash from link value (/archives -> archives).
# External url should start with http:// or https://
menu:
  home: / || fa fa-home
#  about: /about/ || fa fa-user
  tags: /tags/ || fa fa-tags
  categories: /categories/ || fa fa-th
  archives: /archives/ || fa fa-archive
  #schedule: /schedule/ || fa fa-calendar
  #sitemap: /sitemap.xml || fa fa-sitemap
  #commonweal: /404/ || fa fa-heartbeat

# Enable / Disable menu icons / item badges.
menu_settings:
  icons: true
  badges: false
```

系统自动帮我们创建了`home`和`archives`页面，所以我们只需要使用终端创建`tags`和`categories`页面即可：

``` swift
$ cd hexo文件目录
$ hexo new page "tages"
$ hexo new page "categories"
```

创建好的页面在站点 sources 中，我们需要对相关页面进行 type 修改，如下：

``` swift
---
title: 手把手教你使用Hexo搭建github个人博客
date: 2019-09-11 19:06:18
comments: false
tags:
- 工具
- hexo
categories: 
- 工具
- hexo
---
```

#### 搜索功能

1. 安装 [hexo-generator-searchdb](https://github.com/theme-next/hexo-generator-search) 插件

``` swift
$ cd 文件目录
$ npm install hexo-generator-searchdb --save
```

2. 打开站点配置文件 `_config.yml`，找到`Extensions`在下面添加:

``` swift
# 搜索
search:
  path: search.xml
  field: post
  format: html
  limit: 10000
```

3. 打开主题配置文件 `themes/next/_config.yml`或者`_config.next.yml`，找到`Local search`，将`enable`设置为 `true`

``` swift
# Local Search
# Dependencies: https://github.com/theme-next/hexo-generator-searchdb
local_search:
  enable: true
  # If auto, trigger search by changing input.
  # If manual, trigger search by pressing enter key or search button.
  trigger: auto
  # Show top n results per article, show all results by setting to -1
  top_n_per_article: 1
  # Unescape html strings to the readable one.
  unescape: false
  # Preload the search data when the page loads.
  preload: false
```

4. 效果如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/17370245926708.jpg)

#### 侧边栏

默认头像会开启旋转功能，花里胡哨的而且旋转有点快，我个人选择了关闭旋转，并且自定义了头像，图片放在 `themes/next/source/images` 下即可

``` swift
# Sidebar Avatar
avatar:
  # Replace the default image and set the url here.
#  url: /images/avatar.gif
#  url: /images/apple-touch-icon-next.png
  url: /images/flyingPig.jpeg
  # If true, the avatar will be dispalyed in circle.
  rounded: true
  # If true, the avatar will be rotated with the cursor.
  rotated: false
```

在单独的文章页面时侧边栏会默认显示为目录

``` swift
# Posts / Categories / Tags in sidebar.
site_state: true
```
#### 社交网站

社交网站的主页，官方支持的网站配置起来比较简单，简单替换一下链接，并且取消注释即可；但是若是官方不支持的网站，想要自定义的话，却要费一番功夫

我个人是增加了几个不在官方之列的社交平台，比如**小红书**、**LibLib**等，如下：

``` swift
# Social Links
# Usage: `Key: permalink || icon`
# Key is the link label showing to end users.
# Value before `||` delimiter is the target permalink, value after `||` delimiter is the name of Font Awesome icon.
social:
  GitHub: https://github.com/fengyanxin || fab fa-github
  E-Mail: mailto:ph18317192001@163.com || fab fa-mail
  今日头条: https://profile.zjurl.cn/rogue/ugc/profile/?user_id=51893718065 || fab fa-jinritoutiao
  百家号: https://author.baidu.com/home?from=bjh_article&app_id=1665765419554477 || fab fa-baidu
  小红书: https://www.xiaohongshu.com/user/profile/642cb9650000000011023394 || fab fa-xiaohongshu
  LibLib: https://www.liblib.art/userpage/c7816525373d4fbca7e45c1940ead98e || fab fa-liblib
  #Weibo: https://weibo.com/yourname || fab fa-weibo
  #Google: https://plus.google.com/yourname || fab fa-google
  #Twitter: https://twitter.com/yourname || fab fa-twitter
  #FB Page: https://www.facebook.com/yourname || fab fa-facebook
  #StackOverflow: https://stackoverflow.com/yourname || fab fa-stack-overflow
  #YouTube: https://youtube.com/yourname || fab fa-youtube
  #Instagram: https://instagram.com/yourname || fab fa-instagram
  #Skype: skype:yourname?call|chat || fab fa-skype

social_icons:
  enable: true
  icons_only: false
  transition: true
```

1. 想要自定义社交平台，可以先去 [iconfont](https://www.iconfont.cn/?spm=a313x.7781069.1998910419.d4d0a486a)，下载一下需要的平台 **SVG** 图标，比如小红书，将图片放在 `themes/next/source/images`目录下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/17370128583449.jpg)

2. 然后找到 `themes/next/source/css/main.styl` 目录文件，编辑如下：

``` swift
.fa-xiaohongshu {
  background-image: url('/images/xiaohongshu.svg');
  background-size: 1em 1.5em;
  opacity: 0.8;
  background-position: 0.1rem 0.05rem;
  background-repeat: no-repeat;
  height: 1rem;
  width: 1rem; 
  border-radius: 0rem;
  /*鼠标停留在图标上时，图标呈现发光效果*/
  &:hover {
      opacity: 1;
    }
} 
```

3. 然后将自定义图片名 **fa-xiaohongshu**，与社交平台关联起来即可：

``` swift
social:
  小红书: https://www.xiaohongshu.com/user/profile/642cb9650000000011023394 || fab fa-xiaohongshu
```

#### 代码块

代码块的高亮有很多种配色可以选，并且可以开启一键复制功能

``` swift
codeblock:
  # Code Highlight theme
  # All available themes: https://theme-next.js.org/highlight/
  theme:
    light: vs
    dark: vs2015
  prism:
    light: prism
    dark: prism-dark
  # Add copy button on codeblock
  copy_button:
    enable: true
    # Available values: default | flat | mac
    style: default
```

#### 动画效果

Next 默认开启了动画效果，但是感觉比较慢，感觉有些影响阅读，推荐开启 `async`，并且适当的修改动画效果

``` swift
motion:
  enable: true
  async: true
  transition:
    # Transition variants:
    # fadeIn | flipXIn | flipYIn | flipBounceXIn | flipBounceYIn
    # swoopIn | whirlIn | shrinkIn | expandIn
    # bounceIn | bounceUpIn | bounceDownIn | bounceLeftIn | bounceRightIn
    # slideUpIn | slideDownIn | slideLeftIn | slideRightIn
    # slideUpBigIn | slideDownBigIn | slideLeftBigIn | slideRightBigIn
    # perspectiveUpIn | perspectiveDownIn | perspectiveLeftIn | perspectiveRightIn
    post_block: fadeIn
    post_header: slideDownIn
    post_body: slideDownIn
    coll_header: slideLeftIn
    # Only for Pisces | Gemini.
    sidebar: slideUpIn
```

#### 阅读进度

阅读进度有两种展示方式，一个在回到首页的按钮上直接显示百分比，另一个可以配置在首位部增加进度条，我个人只开启了一个

``` swift
back2top:
  enable: true
  # Back to top in sidebar.
  sidebar: false
  # Scroll percent label in b2t button.
  scrollpercent: true

# Reading progress bar
reading_progress:
  enable: false
  # Available values: top | bottom
  position: top
  color: "#37c6c0"
  height: 3px
```

#### 书签

Next 的书签功能可以保存当前的阅读进度，下次打开是会在续接该进度

``` swift
# Bookmark Support
bookmark:
  enable: true
  # Customize the color of the bookmark.
  color: "#222"
  # If auto, save the reading progress when closing the page or clicking the bookmark-icon.
  # If manual, only save it by clicking the bookmark-icon.
  save: auto
```
#### 右上角github绷带

1. 打开主题配置`themes/next/_config.yml`或者`_config.next.yml`，进行相关参数设置：

``` swift
# `Follow me on GitHub` banner in the top-right corner.
github_banner:
  enable: true
  permalink: https://github.com/fengyanxin
  title: Follow me on GitHub
```

2. 效果如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/17370209299074.jpg)


#### Mermaid

Mermaid 可以快速的用代码生成简单的流程图、时序图、甘特图等

Next 中开启 Mermaid 支持很方便，同时还有不同的风格可以选

``` swift
# Mermaid tag
mermaid:
  enable: true
  # Available themes: default | dark | forest | neutral
  theme:
    light: neutral
    dark: dark
```

#### 懒加载

lazyload 是网站常用的技术，通过按需加载，避免一次性加载过多内容导致的打开缓慢

``` swift
# Vanilla JavaScript plugin for lazyloading images.
# For more information: https://apoorv.pro/lozad.js/demo/
lazyload: true
```

#### fancybox

fancybox 可以在点击图片时放大该图片，并且可以快速浏览当前文章的所有图片

``` swift
# FancyBox is a tool that offers a nice and elegant way to add zooming functionality for images.
# For more information: https://fancyapps.com/fancybox/
fancybox: true
```

#### pangu

对于强迫症来说，中英文混排时加上空格能很大程度改善阅读体验，但是有时候会不小心打漏部分空格，而 pangu 这个项目就可以帮你在展示时自动加上空格

``` swift
# Pangu Support
# For more information: https://github.com/vinta/pangu.js
# Server-side plugin: https://github.com/next-theme/hexo-pangu
pangu: true
```

#### 版权声明

Next 内置了文章末尾增加版权声明，只需手动开启即可

``` swift
# Creative Commons 4.0 International License.
# See: https://creativecommons.org/about/cclicenses/
creative_commons:
  # Available values: by | by-nc | by-nc-nd | by-nc-sa | by-nd | by-sa | cc-zero
  license: by-nc-sa
  # Available values: big | small
  size: small
  sidebar: false
  post: true
  # You can set a language value if you prefer a translated version of CC license, e.g. deed.zh
  # CC licenses are available in 39 languages, you can find the specific and correct abbreviation you need on https://creativecommons.org
  language:
```

#### 不蒜子

[不蒜子](https://busuanzi.ibruce.info) 是一个极简的网页计数器，Next 已经内置，只需打开即可

``` swift
# 不蒜子的访客人数和文章阅读统计功能
busuanzi_count:
  enable: false # 计数不准，所以关闭
  total_visitors: false  # 总访问人数
  total_visitors_icon: fa fa-user
  total_views: false # 总访问次数
  total_views_icon: fa fa-eye
  post_views: true # 文章访问次数 注意：不在首页显示每篇文章的阅读次数，点击全文阅读即显示阅读次数
  post_views_icon: fa fa-eye
```

#### 站点建立时间

这个时间将在站点的底部显示，例如 © 2013 - 2015。 编辑 主题配置文件，新增字段 since。

打开主题配置文件`themes/next/_config.yml`或者`_config.next.yml`，找到如下：

``` swift
footer:
  # Specify the date when the site was setup. If not defined, current year will be used.
  since: 2020
```

### 2、进阶配置

#### 文章摘要

打开主题配置文件`themes/next/_config.yml`或者`_config.next.yml`，找到如下：

``` swift
# Automatically Excerpt. Not recommend.
# Please use <!-- more --> in the post to control excerpt accurately.
auto_excerpt:
  enable: false
  length: 150
```

把这里的 false 改为 true 就可以了在首页启动显示文章预览了， length 是显示预览的长度。

这里我们可以通过在文章使用 `<!-- more -->` 标志来精确控制文章的摘要预览，比如这篇文章就是在这个段落的末尾添加了该标志，所以本文在首页的预览就会显示到这个段落为止

``` swift
<!--more-->
```

其后面的部分就不会显示了，只能点击 **阅读全文** 才能看。效果如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/17370224998555.jpg)

其他文章相关配置：

``` swift
# ---------------------------------------------------------------
# Post Settings
# ---------------------------------------------------------------

# Automatically scroll page to section which is under <!-- more --> mark.
# 自动将页面滚动到<!-- more -->标记下的地方。
scroll_to_more: false

# Automatically saving scroll position on each post/page in cookies.
# 自动保存每篇文章或页面上一次滚动的地方。
save_scroll: false

# Automatically excerpt description in homepage as preamble text.
# 自动在首页对文章进行摘要描述作为前言文本。
excerpt_description: true

# Automatically Excerpt. Not recommend.
# Please use <!-- more --> in the post to control excerpt accurately.
# 不推荐使用自动摘要。
# 请在文章中使用<!-- more -->标志来精确控制摘要长度。
auto_excerpt:
  enable: true
  length: 200

# Post meta display settings
# 文章元数据展示设置
post_meta:
  # 文本显示
  item_text: true
  # 创建时间
  created_at: true
  # 更新时间
  # 这个更新时间有点问题，因为每次重新生成文章/部署时都会刷新更新时间，不建议使用
  updated_at: false
  # 目录分类
  categories: true

# Post wordcount display settings
# Dependencies: https://github.com/willin/hexo-wordcount
# 文章字数展示设置
post_wordcount:
  # 文本显示
  item_text: true
  # 文章字数统计
  wordcount: true
  # 阅读时长
  min2read: true
  # 站点总字数统计
  totalcount: true
  # 该post_wordcount的所有设置另起一行显示
  separated_meta: true
```

#### 添加RSS订阅

1. 安装RSS插件

``` swift
$ cd 文件目录
$ npm install --save hexo-generator-feed
```

2. 打开站点配置文件 `_config.yml`，进行相关参数修改：

``` swift
# Extensions
## Plugins: http://hexo.io/plugins/
# feed (RSS订阅)
# Dependencies: https://github.com/hexojs/hexo-generator-feed
feed:
  type: atom
  path: atom.xml
  limit: 20
  hub:
  content:
```

3. 打开主题配置文件 `themes/next/_config.yml`或者`_config.next.yml`，进行相关参数修改：

``` swift
$ rss: /atom.xml //注意：有一个空格
```

#### 增加页面宠物

1. 在站点目录下执行：

``` swift
$ npm install -save hexo-helper-live2d
```

2. 打开主题配置文件`themes/next/_config.yml`或者`_config.next.yml`，添加下列相关参数：

``` swift
live2d:
  enable: true
  scriptFrom: local
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/
  tagMode: false
  log: false
  model:
    use: live2d-widget-model-tororo
  display:
    position: right
    width: 150
    height: 300
  mobile:
    show: true
  react:
    opacity: 0.7
```

#### 增加文章结束标志

1. 在路径 `/themes/next/layout/_macro`文件夹中新建`passage-end-tag.swig`文件：

``` swift
//切换到路径_macro
$ cd [_macro路径]
//创建passage-end-tag.swig文件
$ touch passage-end-tag.swig
```

2. 打开 `passage-end-tag.swig`文件，添加以下内容：

``` swift 
<div>
    {% if not is_index %}
        <div style="text-align:center;color: #ccc;font-size:14px;">-------------<i class="fa fa-paw"></i> That's all！Best wishes for you !!! <i class="fa fa-paw"></i>-------------</div>
    {% endif %}
</div>
```

3. 打开`/themes/next/layout/_macro/post.swig`，在`post-body`之后，`post-footer`之前，添加以下代码：

``` swift
<div>
  {% if not is_index %}
    {% include 'passage-end-tag.swig' %}
  {% endif %}
</div>
```

4. 然后打开主题配置文件`themes/next/_config.yml`或者`_config.next.yml`,在末尾添加：

``` swift
# 文章末尾添加“本文结束”标记
passage_end_tag:
  enabled: true
```

5. 效果如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/17370182981965.jpg)


#### 自定义头部背景区域

将图片文件放在 `/themes/next/source/images` 中，
打开 `/themes/next/source/css/_schemes/Pisces/_header.styl` 目录文件，
添加如下代码：

``` swift
background-image: url(/images/blogHead.jpg);
 @media(min-width: 992px){
    background-image: url(/images/blogHead.jpg);
    }
```

#### 添加背景丝带

1. 下载相应的资源包：

``` swift
$ git clone https://github.com/theme-next/theme-next-canvas-nest themes/next/source/lib/canvas-nest
```

2. 在主题配置文件`themes/next/_config.yml`或者`_config.next.yml`中，做相关参数修改：

``` swift
# Canvas-nest
# Dependencies: https://github.com/theme-next/theme-next-canvas-nest
canvas_nest: # 网络背景
  enable: true
  onmobile: true # display on mobile or not
  color: '0,0,0' # RGB values, use ',' to separate
  opacity: 0.5 # the opacity of line: 0~1
  zIndex: -1 # z-index property of the background
  count: 150 # the number of lines

# JavaScript 3D library.
# Dependencies: https://github.com/theme-next/theme-next-three
# three_waves
three_waves: false
# canvas_lines
canvas_lines: false
# canvas_sphere
canvas_sphere: false

# Canvas-ribbon
# Dependencies: https://github.com/theme-next/theme-next-canvas-ribbon
# size: The width of the ribbon.
# alpha: The transparency of the ribbon.
# zIndex: The display level of the ribbon.
canvas_ribbon:
  enable: false
  size: 300
  alpha: 0.6
  zIndex: -1
```

3. 效果如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/bgSilkRibbon.gif)

#### Valine在线评论

1. 首先要先去 [LeanCloud](https://www.leancloud.cn) 注册一个帐号，然后再创建一个应用，如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/17370822732228.jpg)

2. 拿到应用的 `appid` 和 `appkey` 之后，打开 `themes/next/_config.yml`主题配置文件，查找 `valine`，填入`appid`和 `appkey` ，如下:

``` swift
# Valine
# For more information: https://valine.js.org, https://github.com/xCss/Valine
# 评论功能
valine:
  enable: true
  appid: ''
  appkey: ''
  notify: true # Mail notifier
  verify: false # Verification code
  placeholder: '说点什么吧！' # Comment box placeholder
  avatar: mm # Gravatar style
  guest_info: nick,mail,link # Custom comment header
  pageSize: 10 # Pagination size
  language: # Language, available values: en, zh-cn
  visitor: true # Article reading statistic
  comment_count: true # If false, comment count will only be displayed in post page, not in home page
  recordIP: false # Whether to record the commenter IP
  serverURLs: # When the custom domain name is enabled, fill it in here (it will be detected automatically by default, no need to fill in)
  #post_meta_order: 0
```

3. 效果如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/17370825991243.jpg)

#### 静态资源压缩

1. 在站点目录下安装插件：

``` swift
$ npm install gulp -g
$ npm install gulp-minify-css gulp-uglify gulp-htmlmin gulp-htmlclean gulp-imagemin gulp --save
# 额外安装
$ npm install imagemin-gifsicle imagemin-mozjpeg imagemin-optipng imagemin-svgo --save
```

2. 如下图所示，在站点目录下，新建 `gulpfile.js` ，并填入以下内容：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/17370990019472.jpg)

3. 填入以下代码：

``` swift
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
// var imagemin = require('gulp-imagemin');
var imagemin = import('gulp-imagemin');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminOptipng = require('imagemin-optipng');
var imageminSvgo = require('imagemin-svgo');

// 压缩css文件
gulp.task('minify-css', function() {
  return gulp.src('./public/**/*.css')
  .pipe(minifycss())
  .pipe(gulp.dest('./public'));
});
// 压缩html文件
gulp.task('minify-html', function() {
  return gulp.src('./public/**/*.html')
  .pipe(htmlclean())
  .pipe(htmlmin({
    removeComments: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  }))
  .pipe(gulp.dest('./public'))
});
// 压缩js文件
gulp.task('minify-js', function() {
    return gulp.src(['./public/**/.js','!./public/js/**/*min.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});
// 压缩 public/images 目录内图片(Version<3)
// gulp.task('minify-images', function() {
//    gulp.src('./public/images/**/*.*')
//        .pipe(imagemin({
//           optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
//           progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
//           interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
//           multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
//        }))
//        .pipe(gulp.dest('./public/uploads'));
//});

// 压缩 public/images 目录内图片(Version>3)
// gulp.task('minify-images', function (done) {
//    gulp.src('./public/images/**/*.*')
//        .pipe(imagemin([
//            imageminGifsicle({interlaced: true}),
//            // imagemin.jpegtran({progressive: true}),
//            imageminMozjpeg({progressive: true}),
//            imageminOptipng({optimizationLevel: 5}),
//            imageminSvgo({
//                plugins: [
//                    {removeViewBox: true},
//                    {cleanupIDs: false}
//                ]
//            })
//        ]))
//        .pipe(gulp.dest('./public/images'));
//    done();
//});

//4.0以前的写法 
//gulp.task('default', [
//  'minify-html', 'minify-css', 'minify-js', 'minify-images'
//]);

//4.0以后的写法
// 执行 gulp 命令时执行的任务
gulp.task('default', gulp.series(gulp.parallel('minify-html', 'minify-css', 'minify-js')), function () {
    console.log("----------gulp Finished----------");
    // Do something after a, b, and c are finished.
});
```

4. 然后需要在每次执行 `generate` 命令后执行`gulp`就可以实现对静态资源的压缩，完成压缩后执行`deploy`命令同步到服务器：

``` swift
# Generate blog
hexo clean
hexo generate
sleep 5

gulp

# Deploy
hexo deploy
sleep 5
```

> 注意：这里有一个坑，imagemin 压缩，由于版本原因始终无法执行成功，这里暂时先把它给注了

#### 添加可切换的暗黑模式

`hexo-next-darkmode` 插件支持自动添加可切换的暗黑模式，同时支持暗黑模式下的 CSS 样式高度自定义，兼容 Next 7.x 与 8.x 版本。

1. 安装 `hexo-next-darkmode` 插件

``` swift
$ npm install hexo-next-darkmode --save
```

2. 在 Next 主题的 `_config.yml` 配置文件里添加以下内容:

``` swift
# Darkmode JS
# For more information: https://github.com/rqh656418510/hexo-next-darkmode, https://github.com/sandoche/Darkmode.js
darkmode_js:
  enable: true
  bottom: '64px' # default: '32px'
  right: 'unset' # default: '32px'
  left: '32px' # default: 'unset'
  time: '0.5s' # default: '0.3s'
  mixColor: 'transparent' # default: '#fff'
  backgroundColor: 'transparent' # default: '#fff'
  buttonColorDark: '#100f2c' # default: '#100f2c'
  buttonColorLight: '#fff' # default: '#fff'
  isActivated: false # default false
  saveInCookies: true # default: true
  label: '🌓' # default: ''
  autoMatchOsTheme: true # default: true
  libUrl: # Set custom library cdn url for Darkmode.js
```

`isActivated: true`：默认激活暗黑/夜间模式，请始终与 `saveInCookies: false`、`autoMatchOsTheme: false` 一起使用

### 3、特殊配置

#### 捐赠（打赏）

文章末尾还可以求打赏，需要配置好相应的二维码图片，并且可以修改提示语句

``` swift
# Donate (Sponsor) settings
# Front-matter variable (nonsupport animation).
reward_settings:
  # If true, a donate button will be displayed in every article by default.
  enable: true
  animation: false
  comment: 赏个鸡腿🍗

reward:
  wechatpay: /images/wechatpay.png
  alipay: /images/alipay.jpg
  #paypal: /images/paypal.png
  #bitcoin: /images/bitcoin.png
```

#### 公益404

1. 在主题配置文件`themes/next/_config.yml`或者`_config.next.yml`中，搜索 `menu` 关键字，取消 `commonweal` 前的 # 注释。

``` swift
menu:
  home: / || fa fa-home
#  about: /about/ || fa fa-user
  tags: /tags/ || fa fa-tags
  categories: /categories/ || fa fa-th
  archives: /archives/ || fa fa-archive
  #schedule: /schedule/ || fa fa-calendar
  #sitemap: /sitemap.xml || fa fa-sitemap
  commonweal: /404/ || fa fa-heartbeat
```

2. 在 source 文件夹下新建 `404.html` 文件，复制粘贴以下代码，记得把`homePageUrl`改为自己主页的域名：

``` swift
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>404</title>
	</head>
	<body>
		<script type="text/javascript" 			  src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8">
		</script>
	</body>
</html>
```

3. 在站点根目录下，输入 `hexo new page 404`，在默认 Hexo 站点下 `/source/404/index.md` 打开新建的404界面，编辑属于自己的404界面，可以显示腾讯公益404界面，代码如下:

``` swift
---
title: 404，页面不见了？TA也不见了！
date: 2025-01-17 09:40:30
comments: false
permalink: /404.html
---

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>404</title>
	</head>
	<body>
		<script type="text/javascript" 			  src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8">
		</script>
	</body>
</html>
```

4. 效果如下：
![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/17370818231816.jpg)

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/17370817394824.jpg)

