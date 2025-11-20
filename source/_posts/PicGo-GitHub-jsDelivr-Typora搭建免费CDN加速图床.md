---
title: 【Hexo】PicGo+GitHub+jsDelivr+Typora 搭建免费 CDN 加速图床
date: 2025-11-20 16:28:55
tags:
- Hexo
- 学习笔记
- GitHub
categories:
- Hexo
---

本文介绍如何通过 PicGo 上传图片，指定 GithHub 作为图床，并使用 jsDelivr 对 GitHub 上图片进行 CDN 加速。另外介绍 Typora 编辑器配置 PicGo 作为文件上传服务器。

## GitHub 设置

<!-- more -->

### GitHub 创建仓库

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251120163547019.png)

### 切换分支

如果不想使用 main 分支，可以新建分支：

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251120163845618.png)

### GitHub获取个人 token

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251120164705824.png)

注意：这个 token 生成后只会显示一次！你要把这个 token 复制一下存到其他地方以备以后要用。

## PicGo 配置 

下载：[https://github.com/Molunerfinn/PicGo](https://github.com/Molunerfinn/PicGo)

![image-20251120165324695](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251120165324695.png)

可以使用稳定版本，也可以选择体验新功能的 beta 版本

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251120165229300.png)

官方文档：[https://picgo.github.io/PicGo-Doc/zh/guide/#picgo-is-here](https://picgo.github.io/PicGo-Doc/zh/guide/#picgo-is-here)

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251120165547987.png)

### PicGo 配置 GitHub 图床

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251120170144194.png)

1. 图床配置名：这个可以随便取名。
2. 仓库名：仓库名的格式是用户名/仓库，比如创建一个叫做 YXHubPic 的仓库，在PicGo 里要设定的仓库名就是 fengyanxin/YXHubPic。
3. 分支名：分支一般选择 main 分支(如若选择其他分支，注意文件链接多了一级 /blob)。
4. Token：这个就是刚才设置保存的 token，复制过来就好。
5. 存储路径：就是在仓库下的路径，比如设置 img/ 就会在 YXHubPic 仓库下创建一个 img 文件夹来存储文件。
6. 自定义域名：用来 CDN 加速使用，比如我图中的域名就是使用了 jsdelivr 加速，详情见下面 jsdelivr 的介绍。

### PicGo 设置

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251120171328219.png)

## jsDelivr 介绍

A free CDN for open source projects--用于开源项目的免费 CDN
刚好解决github图片访问过慢的问题，使用十分简单。

官方网站：[https://www.jsdelivr.com/?docs=gh](https://www.jsdelivr.com/?docs=gh)

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251120171651660.png)

### GitHub 相关域名配置方式

``` swift
// 加载任何Github发布、提交或分支
https://cdn.jsdelivr.net/gh/user/repo@version/file

// 加载 jQuery v3.6.4
https://cdn.jsdelivr.net/gh/jquery/jquery@3.6.4/dist/jquery.min.js

// 使用版本范围而不是特定版本
https://cdn.jsdelivr.net/gh/jquery/jquery@3.6/dist/jquery.min.js
https://cdn.jsdelivr.net/gh/jquery/jquery@3/dist/jquery.min.js

// 完全省略版本或分支以获得最新版本 ，不应该在生产中使用它
https://cdn.jsdelivr.net/gh/jquery/jquery/dist/jquery.min.js

// 将“.min”添加到任何JS/CSS文件中以获取缩小版本，如果不存在，将为会自动生成
https://cdn.jsdelivr.net/gh/jquery/jquery@3.6.4/src/core.min.js

// 在末尾添加"/"以获取资源目录列表
https://cdn.jsdelivr.net/gh/jquery/jquery/
```

## Typora 图片上传 PigGo

喜欢使用 Typora 写 markdown 格式文章的，可以配置 typora 让文本中的图片通过 PicGo 上传到图床中去。只需要将图片拖到 Typora 文档中，就是自动上传，并生成链接。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251120175041406.png)

### Typora 图像设置

1. 插入图片时：选择上传图片
2. 上传服务：选择 PicGo 

## 参考资料

1、[体验PicGo+GitHub搭建图床，使用jsDelivr或Github raw免费加速](https://zhuanlan.zhihu.com/p/638224211)

