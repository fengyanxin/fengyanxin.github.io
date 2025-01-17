---
title: 【Hexo】踩坑记录
date: 2025-01-17 13:54:45
tags:
- Hexo
categories:
- Hexo
---

### 一、控制台打印 no src attr, skipped...

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

![控制台this](assets/17370984380125.jpg)

可以看到这里的路径是 `data-src`，所以，

所以，把上面代码块的 `src`全都替换成`data-src`即可。