---
title: 【Hexo】踩坑记录
date: 2025-01-17 13:54:45
tags:
- Hexo
categories:
- Hexo
---

## 一、控制台打印 no src attr, skipped...

原因：这是因为 `hexo-asset-image`插件没有捕捉到图片`src`

解决：打开 `hexo/node_modules/hexo-asset-image/index.js`，定位到相应代码:

<!-- more -->

``` swift
$('img').each(function(){
        if ($(this).attr('src')){
            // For windows style path, we replace '\' to '/'.
            var src = $(this).attr('src').replace('\\', '/');
            if(!/http[s]*.*|\/\/.*/.test(src) &&
               !/^\s*\//.test(src)) {
              // For "about" page, the first part of "src" can't be removed.
              // In addition, to support multi-level local directory.
              var linkArray = link.split('/').filter(function(elem){
                return elem != '';
              });
              var srcArray = src.split('/').filter(function(elem){
                return elem != '' && elem != '.';
              });
              if(srcArray.length > 1)
                srcArray.shift();
              src = srcArray.join('/');
              $(this).attr('src', config.root + link + src);
              console.info&&console.info("update link as:-->"+config.root + link + src);
            }
        }else{
            console.info&&console.info("no src attr, skipped...");
            console.info&&console.info($(this));
        }
      });
```

可以看到 `if ($(this).attr('src')){}`，

再看控制台输出的 `this`:

![](assets/17370984380125.jpg)

可以看到这里的路径是 `data-src`，所以，

所以，把上面代码块的 `src`全都替换成`data-src`即可。

## 二、Coding 中的 Pages 不见了！

### 起因：

> 因为自己的这个博客，有时候访问还是比较慢的，原因是我的代码是在 GitHub 上托管的，GitHub 是国外的网站，服务器都在国外，所以访问速度就特别慢，我就想找国内的既能实现代码托管，又能生成静态网页的平台，可以实现 Hexo 的双线部署，即本地提交代码可以分别上传到不同的平台，当然肯定要支持 git

> 为了实现这个功能，所以就在网上找相关的文章，然后发现说的比较多的是 Hexo 双线部署到 Coding Pages 和 GitHub Pages 从而实现网站加速，也就是说从国内访问的话，是走 Coding ，从国外访问的话是走 GitHub ，从而可以提高网站的访问速率

### 过程：

> 于是我就开始动手实验，开始注册 Coding 账号，登录，进去之后和 GitHub 的流程一样，创建一个项目，绑定我的 ssh，把项目地址的 ssh 地址复制到我的博客里面，经过实验发现可以通过 git，一次性分别上传到 GitHub 和 Coding 上。等我去 Coding 上准备打开 Coding pages 时，却发现我根本找不到 Coding 的静态网页服务功能了，前前后后找了好几遍，在百度上跟着他们说的找，找了半天也没找到，他们的文章都是19，20年的，Coding经过更新界面都变得不太一样了，这让我不得不怀疑是不是没有这个功能了。

### 找到的原因是（官方说法）

#### 旧版直接关服

> 因 CODING 产品战略调整，您的 Mercury233 的团队 团队正在使用的 CODING 网站托管服务（旧版），将于 2021 年 12 月 30 日停止服务，届时您项目下的网站将无法访问。项目源码依然保留在您的 CODING 代码仓库中，可部署于其他第三方服务，请尽快迁移您的网站以免受到影响。

#### 新版移到腾讯云 Serverless

> 因 CODING 产品战略调整，CODING 将于即日起，停止提供网站托管服务中的「新建站点」服务； 2021 年 12 月 23 日后将停止已有站点的编辑、部署功能，并于 2021 年 12 月 30 日停止提供「网站托管」服务的使用入口。此后，您的 Mercury233 的团队 团队下的 xxx 项目托管的网站，需在腾讯云 Serverless 控制台进行域名配置、部署等操作及管理，详情请参考——
> 

也就是说免费的 Coding 静态页面不见了，想用的话得花钱，这真是一个腾讯的巨坑！

此刻，笔者只想说：腾讯，我劝你善良！

