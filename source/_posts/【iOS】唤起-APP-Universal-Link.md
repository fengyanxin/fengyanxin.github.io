---
title: '【iOS】唤起 APP: Universal Link'
date: 2025-09-02 10:50:25
tags:
- OC
- iOS
categories:
- iOS
---

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250902132639817.png)

`iOS 9` 之前，一直使用的是 `URL Schemes` 技术来从外部对 App 进行跳转，但是 iOS 系统中进行 `URL Schemes` 跳转的时候如果没有安装 App，会提示 `Cannot open Page` 的提示，而且当注册有多个 `scheme` 相同的时候，目前没有办法区分，但是从 `iOS 9` 起可以使用 `Universal Links` 技术进行跳转页面，这是一种体验更加完美的解决方案。

<!-- more -->

## Universal Link （通用链接）

`Universal Link` 是 Apple 在 iOS 9 推出的一种能够方便的通过传统 HTTPS 链接来启动 APP 的功能。

如果你的应用支持 `Universal Link`，当用户点击一个链接时可以跳转到你的网站并获得无缝重定向到对应的APP，且不需要通过 Safari 浏览器。如果你的应用不支持的话，则会在 Safari 中打开该链接。

支持 `Universal Link` 先决条件：必须有一个支持HTTPS的域名，并且拥有该域名下上传到根目录的权限（为了上传 Apple 指定文件）。

这个功能是 iOS 9.0 就推出的通过访问 http 链接去启动 App 的方式，相信你在刷知乎或者百度的时候，浏览器顶部一直会飘着用 App 打开这个，这个东西就是上面说的通用链接。

## Universal Link 的基本运作流程

* APP 第一次启动 or APP 更新版本后第一次启动

* APP 向工程里配置的域名发起 Get 请求拉取 `apple-app-association Json File`

* APP 将 `apple-app-association` 注册给系统

* 由任意 webview 发起跳转的 url，如果命中了 `apple-app-association` 注册过的通用链接

* 打开 App，触发 `Universal Link delegate`

* 没命中，webview 继续跳转 url

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250902112202495.png)

在你进行 `apple-app-association` 以及 App 工程的配置之后，整个 `Universal Link` 的运作流程完全由系统控制了。

## 前置条件

拥有一个网站域名，且这个网站域名支持 `https`。 如果你没有这个东西，后面这个教程就不用看了，直接去使用 `mob` 推出的 [moblink](http://www.mob.com/mobService/moblink) 吧，可以使用他默认的域名和配置，按他的接入教程就可以了。

## Xcode 项目配置

### 1、打开工程配置中的 Associated Domains

如果用的是 `Xode11`，可以在 `Signing&Capabilities` 中添加 `Associated Domains`，如果用的 `Xcode10`，那就在 `Capabilities` 中打开 `Associated Domains`。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250902110356490.png)

### 2、添加网站域名

网站域名以 `applinks:` 开头，那这里填写的就是 `applinks:www.lazypig.net。`

### 3、配置文件

如果你的项目时自动生成签名和配置文件，那么这步可以省略，如果项目不是自动生成的，就需要去苹果开发后台，将对应的 `appid` 的 `Associated Domains` 配置打开，然后重新生成一次打包的配置文件。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250902110528206.png)

## 网站配置

### 1、创建配置文件

新建一个名字为 `apple-app-site-association` 的纯文本文件，不要有任何后缀，文件内容为：

``` swift
{
    "applinks": {
        "apps": [],
        "details": [
            {
                "appID": "团队ID.软件BundleID",
                "paths": [ "限制的域名"]
            }
        ]
    }
}
```

比如你团队 `ID` 是 `6PA8SXXXXX`，app 的 `bundle id` 是 `com.fengyanxin.blog`，只在
访问 www.lazypig.net/app/lazypig… 链接时才显示顶部的用 App 打开，其他网站层次不显示，那么这个文件的内容就是:

``` swift
{
    "applinks": {
        "apps": [],
        "details": [
            {
                "appID": "6PA8SXXXXX.com.fengyanxin.blog",
                "paths": [ "/app/lazypigquick/*"]
            }
        ]
    }
}
```

如果填了限制的 `paths`，在其他网站例如微信后台，填写 `Universal Links` 就是填写 www.lazypig.net/app/lazypig…

如果没有限制 `paths`，填写的是*，那么前端和后台填写的地址就是 www.lazypig.net/，全站的头部都显示用 App 打开，那么 `paths` 修改为 "paths": [ "*"] 即可。

#### apps 参数
apps 这个字段保持为空数组即可。

#### details 参数
details 是指定哪个页面用哪个 App 打开的数组，如果你有多个路径指定不同的 App，按照 paths 规则添加对应的 appID 和 paths 即可。

#### paths 参数
这个 paths 路径的更多限制规则可以参考下面：

* 使用* 指定整个网站
* 包含特定的网址（例如/wwdc/news/）以指定特定的链接
* 附加到特定的网址（例如/videos/wwdc/2015/）以指定网站的一部分
* 除了用于匹配任何子字符串之外，您还可以?用于匹配任何单个字符。您可以将两个通配符合并在一个路径中，例如/foo//bar/201?/mypage
* 路径字符串的开头添加 NOT 指定不应作为通用链接处理的区域，例如 `"paths": [ "/videos/wwdc/201?/*" , "NOT /videos/wwdc/2010/*"]`

然后将这个文件上传到网站根目录，或者在根目录新建一个名字为 `.well-known` 的子目录，然后把这个文件上传到这个子目录中。

### 2、网站验证

上传之后，可以访问 [search.developer.apple.com](https://search.developer.apple.com/appsearch-validation-tool/)，苹果专门提供的验证工具，然后将域名网址填进去，例如 `https://www.lazypig.net/`，然后点击测试。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250902113759656.png)

下面如果显示的是 `Passed`，那就证明符合规则，如果有不合规则的可以参考下面的修正。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250902113920153.png)

### 3、网站不合规则的修正方法

#### 3.1 Title 不符合规则

在首页的 `header` 标签中增加 `<title>` 标签，例如：

``` swift
<head>
    <title>胡东东博客</title>
    ……
</head>
```

#### 3.2 Description 不符合规则

在首页的 `header` 标签中增加 `description`  标签，例如：

``` swift
<head>
    <meta name="description" content="胡东东博客，分享手游和app开发的日常点滴" />
    ……
</head>
```

#### 3.3 Image不符合规则

在首页的 `header` 标签中增加 `og:image` 标签，例如：

``` swift
<head>
    <meta property="og:image" content="https://www.baidu.com/img/superlogo_c4d7df0a003d3db9b65e9ef0fe6da1ec.png?where=super" />
    ……
</head>
```

#### 3.4 Touch Icon不符合规则

在首页的 `header` 标签中增加 `apple-touch-icon` 标签，例如：

``` swift
<head>
    <link rel="apple-touch-icon" href="/static/quick0012.png">
    ……
</head>
```

#### 3.5 Link to Application Action required

这个基本是因为 app 还没有上架，上架审核通过之后发布即可。

### 4、显示验证

可以打一个测试包安装到手机，然后用 safari 浏览器打开指定的网页即可看到飘窗，例如打开 www.lazypig.net/app/lazypig…，就会看到 懒猪时间盒 的打开飘窗。

## 网页配置

网页中对需要唤起 App 的按钮或者控件添加点击事件，事件的函数代码如下:

``` swift
function wakeUpApp(){
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        var loadDateTime = new Date();
        window.setTimeout(function() {
            var timeOutDateTime = new Date();
            if (timeOutDateTime - loadDateTime < 5000) {
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=你的应用宝BundleID";
            } else {
                window.close();
            }
        },
            25);
        window.location.href = "https://yourdomainname.com/";          
    } else if (navigator.userAgent.match(/android/i)) {
        var state = null;
        try {
            state = window.open("apps custom url schemes ", '_blank');
        } catch(e) {}
        if (state) {
            window.close();
        } else {
            window.location.href = "要跳转的页面URL";
        }
    }
}
```

>注：代码中 yourdomainname.com 还可以后面添加 /goodid/123456 之类的属性id后缀，用来传递事件类型和 id，方便移动端做更丰富的功能需求，比如通过 goodid 识别要做的下一步动作是打开商品 id 为123456 的商品详情页，等等。

## 测试一下

配置完成，查看是否能唤起 App，也可以通过如下图中，输入域名，长按来唤起 App 做验证。

## 网站向 App 传值

在 `AppDelegate` 中，可以通过回调函数获取网站向 App 传的链接，通过链接做不同的逻辑处理。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250902114718852.png)

### Objective-C 代码实现

``` swift
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler {
    if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
        NSURL *url = userActivity.webpageURL;
        if (url是我们希望处理的){
            //进行我们的处理
        }
    }
    return YES;
}
```

### Swift 代码实现

```
//从通用链接进来
func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    if userActivity.activityType == NSUserActivityTypeBrowsingWeb {
        if let url = userActivity.webpageURL {
            print("从通用链接进入app",url.absoluteString)
        }
    }
    return true;
}
```

## 五、参考资料

>1、[iOS 唤起 APP: Universal Link(通用链接)](https://juejin.cn/post/6844904126300553223)

