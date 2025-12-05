---
title: 【iOS】fastlane 的使用
date: 2025-12-05 13:57:46
tags:
- iOS
categories:
- iOS
---
![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/fastlane_text.png)

<!-- more -->

# 背景

我们在开发过程中总免不了需要经历发测、上传等环节。这些开发环节中，我们需要打不同环境的包，上传对应的分发后台 **（例如“蒲公英”、TestFlight、iTunes Connect）** 等。

每次的手动打包的过程中，我们都要选择对应的环境、对应打包的证书、正确的 target 等工作。万一上述步骤哪一步选错了，轻者得重新走一遍上述的流程，更严重点还有可能会把测试服的数据传到正式服去了。仔细想想后患无穷。

有没有一种方法可以在设置好一系列的任务流程后，只需要一句代码就可以自动帮我们完成上面提及的一些列操作。既减少我们手动操作的同时，还能减少选择环境证书导致错误的方法呢？

有！fastlane 就能帮到你。

# fastlane 使用

fastlane 是一个自动化构建工具，主要包含测试、打包、发布等功能，它内部是由 ruby 实现的，是一款自动化非常高的脚本工具。

## 安装

1、mac 自带的 ruby ，需要 sudo 权限：

``` swift
sudo gem install fastlane
```

2、使用 homebrew 安装：

``` swift
brew install fastlane
```

## 初始化

在项目根目录（通俗一点就是跟你 .xcworkspace、Podfile 文件同级的t地方）下，初始化 Fastlane： 

``` swift
fastlane init
```

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251205142107552.png)

选择对应需要的功能后完成初始化，这里我们选择 4。

在初始化完成后我们看到在根目录下生成了一个 `fastlane` 的文件夹还有一个 `Gemfile` 文件

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/image-20251205142437935.png)

``` swift
-fastlane
  -Fastfile(核心文件，主要用于 命令行调用和处理具体的流程，lane相对于一个方法或者函数)
  -Appfile(存储有关开发者账号相关信息)
-Gemfile(Gemfile是我们创建的一个用于描述gem之间依赖的文件。gem是一堆Ruby代码的集合，它能够为我们提供调用)
```

至此我们完成了第一步，fastlans 的初始化。打开 `Fastfile` 我们就可以看见 fastlane 的核心文件了。

``` swift
default_platform(:ios)

platform :ios do
  desc "Description of what the lane does"
  lane :custom_lane do
    # add actions here: https://docs.fastlane.tools/actions
  end
end
```

我们只需要在命令行敲 `fastlane custom_lane` 就可以执行这个自定义的任务。但当然由于我们啥都没设置，他并不会有任何效果。

## Fastfile 文件编写

和我们 iOS 的 ViewController 一样，fastlane 也是有生命周期的。fastlane的生命周期为:


| 执行顺序 | 方法名 | 说明 |
|:---|:---|:---|
| 1 | before_all | 在执行 lane 之前只执行一次 |
| 2 | before_each | 每次执行 lane 之前都会执行一次 |
| 3 | lane | 自定义的任务 |
| 4 | after_each | 每次执行 lane 之后都会执行一次 |
| 5 | after_all | 在执行 lane 成功结束之后执行一次 |
| 6 | error | 在执行上述情况任意环境报错都会中止并执行一次 |

### lane 

lane 是 fastfile 中的方法定义标签，可以理解为函数。fastlane 都是基于 ruby，所以 fastfile 中也是使用 ruby 语法的。

1、定义一个简单的无参 lane

``` swift
lane :noParam_lane
    puts "这是一个无参数的lane"
end
```

调用方法 `fastlane noParam_lane`

2、定义一个带参的 lane

在 `fastfile` 中 `option` 类似于一个字典集。我们可以通过  `option[:configuration]` 取其中 `value`

``` swift
lane :param_lane do |option| 
   param = option[:param]
   puts "这是一个有参数的lane"
   puts param
end
```

调用方法 `param_lane(param: '我是参数')`

### Action

除开我们自定义 fastfile 中的方法，fastlane 还提供了很多已经写好的独立的方法库，也就是 Actions。 常见的 action 可以查阅 Actions 或调用 fastlane 代码 `fastlane actions`。

下面我们举一个简单的打包例子:

``` swift
APP_NAME = "XXX"
SCHEME = "XXX"

platform :ios do
  #在执行lane前先跑一遍cocoapods
  before_all do
    cocoapods
  end

  #debug包
  lane :iosDebug do
    package(configuration: "Debug",method:"development")
  end

  #release包
  lane :iosRelease do
    package(configuration: "Release",method:"ad-hoc")
  end

    #发布包
  lane :iosAppStore do
    package(configuration: "Release",method:"app-store"")
  end

  #打包函数
  lane :package do |option|
     #打包
     gym(
      scheme: "#{SCHEME}",
      export_method: option[:method],
      configuration: option[:configuration],
      include_symbols: true,
      include_bitcode: false,
      export_xcargs: "-allowProvisioningUpdates"
      )
  end
```

首先我们在 Fastfile 中全局定义了几个参数分别用于**存储应用名、SCHEME**等公用参数。在上一章节中我们说过 fastlane 的生命周期中有一个 `before_all`，我们在这个方法中先更新了一遍 `cocoaPods`。然后定义了3个 `lane`，分别对应我们开发过程中 **测试服发测、正式服发测、以及上传appstore** 的3种打包流程。在流程中通过对 `configuration` 和 `method` 的传参达到配置不同打包环境的效果。

### switch lane

我们可以从代码中看到，`iosDebug`、`iosRelease`、`iosAppStore` 3个 `lane` 最后都调用了一个公用的 `lane package`。这种在一个 `lane` 中调用另一个 `lane` 的使用方式我们把它命名为 `switch lane`。

### gym

`gym` 其实是 `actionbuild_app` 的别名。按照他的官方的说法，使用 `gym` 来构建 `ipa` 文件，会比其他构建工具还要快30％（真香）。

`gym` 的参数有非常多取几个比较常用的来讲一下:

| 参数名 | 解释 | 默认值 |
|:--------|:-----|:-------|
| workspace  | workspace文件的路径| |
| project  | project文件的路径| |
| scheme  | 要打包项目的scheme| |
| clean  | 打包前要不要clean一下（最好还是clean一下吧，这个默认值是不clean的）|false |
| output_directory  | 打包后导出的目录| .（项目根目录）|
| output_name  | 导出ipa的名字| |
| configuration  | 打包的配置| ‘Release’|
| include_symbols  | ipa文件应包含符号表吗| |
| include_bitcode  | ipa文件应包含include_bitcode吗| |
| export_method  | 导出有效值的方法，有效值包括：app-store, ad-hoc, package, enterprise, development, developer-id| |

其他详细的不常用的就不复制粘贴了大家可以看 [build_app](https://docs.fastlane.tools/actions/build_app/#parameters) 这里 。

### 执行打包

有了上面对打包方法的封装，我们只需要根据不同的打包需求。测试服发测调用 iosDebug，正式服发测调用 iosRelease，打 appstore 包调用 iosAppStore 即可获得我们想要的不同环境的包了。

## 上传蒲公英

我们在发测过程中还有上传到软件分发后台的操作，这个功能 fastlane 同样帮我们封装成插件了。

我们只需要在在终端中，输入以下命令，即可安装蒲公英的 fastlane 插件。

``` swift
fastlane add_plugin pgyer
```

安装完毕后，我们在 Fastfile 里需要上传到蒲公英的 lane 中加入相应的命令即可在得到 ipa 包后直接上传蒲公英。

``` swift
#debug包
lane :iosDebug do
  package(configuration: "Debug",method:"development")
  pgyer(api_key: "7f15xxxxxxxxxxxxxxxxxx141", user_key: "4a5bcxxxxxxxxxxxxxxx3a9e")
end

#release包
lane :iosRelease do
  package(configuration: "Release",method:"ad-hoc")
  pgyer(api_key: "7f15xxxxxxxxxxxxxxxxxx141", user_key: "4a5bcxxxxxxxxxxxxxxx3a9e")
end
```

>
>PS: `api_key` 和 `user_key` 在蒲公英的后台获取。
>

# 参考

> 1、[Fastlane官网](https://docs.fastlane.tools)
> 2、[fastlane的使用及文件编写](https://juejin.cn/post/6844904197939281934)