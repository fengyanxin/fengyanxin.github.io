---
title: 【Flutter】导出iOS包时，如何自动与手动更改版本号？
date: 2023-03-07 21:58:55
tags:
- Flutter
- iOS
categories:
- Flutter
---

# 【Flutter】导出iOS包时，如何自动与手动更改版本号？

## 1、通过flutter工程更改版本号

1）首先，打开项目下的iOS工程，找到`info.plist`文件，右键以`Source Code`方式打开，找到版本号配置参数 `CFBundleShortVersionString`和`CFBundleVersion`。

一般未做改动之前的效果如下，`$(FLUTTER_BUILD_NAME)`表示跟随flutter工程创建。

<!-- more -->

```swift
<key>CFBundleShortVersionString</key>
<string>$(FLUTTER_BUILD_NAME)</string>
<key>CFBundleVersion</key>
<string>$(FLUTTER_BUILD_NAME)</string>
```

2）其次，了解了`$(FLUTTER_BUILD_NAME)`的含义之后，我们再来打开`flutter`工程目录下的`pubspec.yaml`文件。

如下图所示，我们可以看到关于版本信息的代码`version: 0.6.0+1`。

这里的`0.6.0`就是构建iOS包的版本号，而`1`就是build号。分别对应前面的`CFBundleVersion`和`CFBundleShortVersionString`。

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/16781763866764.jpg)


3）最后，了解了上面的信息之后，我们想要修改构建出来的iOS包的版本号就好办了。

一般有两种办法：

方法一：更改上图中的版本信息代码

将`version: 0.6.0+1`更改成你想要的版本，比如：`version: 1.0.0+2`

然后`cd`到`flutter`项目目录下运行

```
flutter clean
flutter build ios --release
```

然后再使用Xcode打开iOS工程，此时我们就可以很清晰的看到自动生成的版本信息文件`(Generated)`发生变化了。内容如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/16781777724396.jpg)


确认完以上信息，我们就可以手动打包了。

方法二：清理工程，直接用`flutter`脚本语言打包

```
flutter clean
flutter build ios --build-name=0.6.0 --build-number=1
```

这里的`--build-name=0.6.0`就对应上图的`FLUTTER BUILD NAME=0.6.0`，`build-number=1`对应`FLUTTER BUILD NUMBER=1`。

## 2、通过iOS工程更改版本号

1）首先，还是回到iOS工程下，找到`info.plist`文件，右键以`Source Code`方式打开，找到版本号配置参数`CFBundleShortVersionString`和`CFBundleVersion`。

对这两个参数的`value`值进行修改，让它们不再跟随`flutter`工程创建，修改如下：

```
<key>CFBundleShortVersionString</key>
<string>$(MARKETING_VERSION)</string>
<key>CFBundleVersion</key>
<string>$(CURRENT_PROJECT_VERSION)</string>
```

这里，`$(CURRENT_PROJECT_VERSION)`: 表示当前项目版本号；
`$(MARKETING_VERSION)`：表示当前项目build号。

更改以上配置之后，我们就可以在iOS工程配置中手动修改iOS包的版本信息了。效果如下图：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/16781786409936.jpg)

修改完进行打包。
