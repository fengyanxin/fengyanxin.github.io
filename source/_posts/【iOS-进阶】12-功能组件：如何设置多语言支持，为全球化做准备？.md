---
title: 【iOS 进阶】12 | 功能组件：如何设置多语言支持，为全球化做准备？
date: 2025-09-28 10:38:12
tags:
- 学习笔记
- iOS
categories:
- 学习笔记
---

# 如何设置多语言支持，为全球化做准备？

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250928104137517.png)

<!-- more -->

作为 iOS 开发者，不知道你有没有遇到过这样的情况：每次增加一种新语言，都需要重新改一遍，特别是在 App 进入其他国家的市场时，需要修改整个 App 的代码才能加入新语言。这样是不是很麻烦？

其实这种情况完全可以通过多语言设置来解决。下面我就以 Moments App 为例，看看怎样支持多语言。

## 安装 SwiftGen

Moments App 使用了 SwiftGen 来自动生成支持多语言常量字符串。为了保证整个团队所使用 SwiftGen 的版本都保持一致，我们使用 CocoaPods 来安装 SwiftGen。具体到 Moments App 项目，我们在 Podfile 文件中添加 SwiftGen Pod 即可。

``` swift
pod 'SwiftGen', '= 6.4.0', configurations: ['Debug']
```

为了在每次编译代码的时候，SwiftGen 都会启动代码生成任务，我们需要在主 App TargetMoments 的 Build Phases 里面添加 Run SwiftGen 步骤，然后配置它执行 `"${PODS_ROOT}/SwiftGen/bin/swiftgen"` 命令。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250928104523858.png)

这里要注意，由于我们自己的源代码会使用到 SwiftGen 所生成的代码，因此必须把 Run SwiftGen 步骤放在 Compile Source 步骤之前。

## 增加多语言支持

Xcode 使用 `.strings` 文件来支持多语言。那什么是 `.strings` 呢？`.strings` 文件是一个资源文件，用于存储各种语言的文本。该文件里面保存了一堆 Key-Value 信息，例子如下：

``` swift
"userNameKey" = "User name";
```

其中 `userNameKey` 是 Key，而 `User name` 是具体的值。在 Swift 代码中，我们可以把 Key 传递给 `NSLocalizedString` 方法来取出 `.strings` 文件里配置的值。具体代码如下：

``` swift
let use rName = NSLocalizedString("userNameKey", comment: "Label text for user name")
```

由于 Moments App 使用了纯代码的方式来呈现 UI，我们需要在 Xcode 里面建立一个名叫 `Localizable.strings` 的文件来存储 `Key-Value` 信息。该文件保存在 `Moments/Resources/en.lproj` 文件夹下面，其中 `en` 表示英文，因为 Moments App 的默认语言是英文，假如你的 App 的默认语言是简体中文，那么应该放在 `zh-Hans.lproj` 文件夹下面。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250928104912594.png)

那怎样支持新语言呢？我们可以在 `Project Info` 配置里面的 `Localizations` 下面点击加号按钮 （+），然后选择需要添加的语言，如下图所示，我们添加了简体中文。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250928105216135.png)

接着选择要增加简体中文支持的资源文件。在 Moments App 里面，我们使用了纯代码的方式来编写 UI，因此我们只选择刚才新建的 `Localizable.strings` 文件。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250928105323651.png)

然后你会看到在 `Localizable.strings` 下多了一个 `Localizable.strings（Chinese, Simplified）` 文件用于保存简体中文的文本信息。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250928105432884.png)

现在我们可以在 `Localizable.strings` 里面添加下面的 `Key-Value` 来让 App 显示中文了。

``` swift
"userNameKey" = "用户名";
```

当用户在 iOS 的 Settings App 里面把语言选择为 **简体中文** 以后， App 里面的文本就会变成中文。我们也可以使用同样的办法来增加不同的语言支持。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250928105604673.png)

## 配置 swiftgen.yml 文件

不知道你发现没有，调用 `NSLocalizedString` 方法来取出文本并不方便，一不小心就会把 Key 写错了。那么，有没有什么好的办法方便我们使用 `.strings` 文件里面的文本呢？有，那就是 **使用 SwiftGen 来自动生成带类型信息的常量字符串**。

为什么呢？因为 SwfitGen 在执行过程中会读取 `swiftgen.yml` 文件里面的信息，要知道， `swiftgen.yml` 文件就是用来告诉 SwiftGen 读取那些文件，使用哪个模版以及在哪里存放生成的文件。那么，如何配置该文件，让 SeiftGen 帮我们生成用于全球化和本地化的常量字符串呢？

做法非常简单，我们可以在 `swiftgen.yml` 文件添加以下一段代码。

``` swift
 strings:
   inputs:
     - Moments/Resources/en.lproj
   outputs:
     - templateName: structured-swift5
       output: Moments/Generated/Strings.swift
```

其中 `strings` 表示这是一个用户生成常量字符串的任务。`inputs` 用于指定 `.strings` 文件所在的位置，在我们的项目中，该文件位于 `Moments/Resources/en.lproj`。要注意的是，我们只需要指定一个语言的文件夹就行，它通常是默认开发语言的文件夹。

`outputs.templateName` 表示生成文件所使用的模版，我们使用 `structured-swift5` 模版表示所生成的代码支持点号 (.) 分割 Swift 5 代码。`outputs.output` 表示所生成文件存放的位置。以下是生成的 `Moments/Generated/Strings.swift` ：

``` swift
internal enum L10n {
  internal enum InternalMenu {
    /// Area 51
    internal static let area51 = L10n.tr("Localizable", "internalMenu.area51")
    /// Avatars
    internal static let generalInfo = L10n.tr("Localizable", "internalMenu.generalInfo")
  }
}
```

因为我们在 `Localizable.strings` 文件里定义 Key 的时候使用了点号，SwiftGen 会使用内嵌套枚举类型 (Nested enum) 来把各个常量字符串通过命名空间进行分组。下面是英文版本 `Localizable.strings` 文件的部分定义。

``` swift
// Internal Menu
"internalMenu.area51" = "Area 51";
"internalMenu.generalInfo" = "General Info";
// Moments List
"momentsList.errorMessage" = "Something went wrong, please try again later";
```

我们可以对比一下中文版本 `Localizable.strings` 文件的部分定义。

``` swift
// Internal Menu
"internalMenu.area51" = "51 区";
"internalMenu.generalInfo" = "通用信息";
// Moments List
"momentsList.errorMessage" = "出错啦，请稍后再试";
```

可以看到，我们在定义所有 Key 的时候，都使用了点号进行分割，这可以帮助我们分组各类文本的同时，保证不同语言的文本信息都使用同样的 Key。

## 使用生成的字符串

当 SwiftGen 自动生成那些常量字符串以后，我们就可以很方便地使用它们，下面的代码演示了如何调用这些字符串。

``` swift
let title = L10n.InternalMenu.area51
let infoSection = InternalMenuSection(
    title: L10n.InternalMenu.generalInfo,
    items: [InternalMenuDescriptionItemViewModel(title: appVersion)]
)
```

我们可以使用枚举类型 `L10n` 来取出相应的常量字符串。`L10n` 的扩展方法 （Extension method）会根据当前用户的语言选择来读取相应的 `Localizable.strings` 文件，并返回对应语言的字符串来显示给用户。
下面是 Moments App 在英文语言和中文语言环境下的显示。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250928110224034.png)

## 总结

这一讲，我介绍了如何使用 `.strings` 文件和 SwiftGen 来快速设置多语言支持。有了 `.strings` 文件，支持新的语言变得非常简单，甚至可以在没有程序员的情况下，由翻译人员来翻译并发布新的语言。另外，有了 SwiftGen 所生成的常量字符串，我们不会再把错误的 Key 传递给 `NSLocalizedString`，从而提高了代码的质量。可以说，这个设置是一本万利，哪怕目前你的 App 还没有支持多个语言，我还是建议你花一丁点时来设置多语言支持。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/image-20250928104137517.png)

