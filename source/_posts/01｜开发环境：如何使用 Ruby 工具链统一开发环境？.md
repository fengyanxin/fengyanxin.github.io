---
title: 【iOS进阶】01 | 开发环境：如何使用 Ruby 工具链统一开发环境？
date: 2023-01-15 21:50:05
tags:
- 学习笔记
- iOS
categories:
- 学习笔记
---
# 如何使用 Ruby 工具链统一开发环境？

![](assets/2021-03-17_10.25.34.png)

<!-- more -->

在 iOS 开发过程中，你是不是会经常遇到这些情况：

每次打开一个新项目，都需要手动搭建开发环境；有时候在安装第三方工具时使用到 `sudo 权限`，导致以后安装工具都需要手工输入密码而无法实施自动化。还有，每当启动一台新 `CI` 时，就需要手工登录并配置一遍，更可怕的是，原先搭建好的 CI 会随着 Xcode 版本更新需要重新配置。

为什么会这么麻烦呢？就是因为你在项目开始之初没有做好统一配置。

所谓统一配置，就是所有的配置信息都以文本的格式存放在 Git 里面，我们可以随时查看修改记录，以此来帮助我们比较不同配置之间的差异性，然后在这个基础上不断更新迭代。

可以说，有了统一配置，任何工程师都可以搭建出一模一样的开发环境，构建出功能一致的 App；有了统一配置，还可以让我们按需延展 CI 服务，而不用任何手工操作。更重要的是，它还可以应用到各个类似的 iOS 项目中，极大地减轻了项目前期的搭建成本。

既然统一的配置那么重要，那么我们怎样搭建统一配置的开发环境呢？

## Ruby 工具链

我们可以通过 Ruby 工具链为整个项目搭建一致的开发和构建环境。为什么选择 `Ruby` 而不是其他语言环境呢？因为在 iOS 开发方面，目前流行的第三方工具 `CocoaPods` 和 `fastlane` 都是使用 Ruby 来开发的。特别是 Ruby 有非常成熟的依赖库管理工具 `RubyGems` 和 `Bundler`，其中 Bundler 可以帮我们有效地管理 CocoaPods 和 fastlane 的版本。

下面一起来看看怎样搭建一个统一的开发环境吧。

![](assets/2021-03-17_10.02.14.png)

通常，统一的开发环境应该从操作系统开始。对于 iOS 开发来说，**MacOS** 是目前 iOS 开发唯一支持的操作系统。在公司，MacOS 的版本一般由 IT 部门统一管理和更新。要注意，当公司统一更新了我们开发环境的 MacOS 版本以后，需要同时更新 CI 上 MacOS 的版本，以保持一致。

## Xcode

位于 MacOS 上层的是 Xcode 和 rbenv。其中，**Xcode** 是 iOS 开发和构建工具，在同一个项目里，最好使用同一个版本的 Xcode 进行开发和构建，我们可以在项目的 README.md 文件标注 Xcode 的版本。

像我们将要开发的这款类似朋友圈的 Moments App 项目，我就在对应的 README.md 文件里标明了需要使用 `Xcode Version 12.2 (12B45b)`。具体内容你也可以在代码仓库找到。

![](assets/2021-03-17_10.12.38.png)

那我们怎样才能保证每个人都安装同一个版本号的 Xcode 呢？技巧就是我们不要到有自动更新功能的 Mac App Store 中下载 Xcode，而是到苹果的开发者网站搜索并下载。

![](assets/2021-03-17_10.14.30.png)

有时候我们会同时开发多个项目，这样有可能要安装多个不同版本的 Xcode。如果你的机器有多于一个版本的 Xcode，此时需要特别注意，为了保证所使用的编译器版本一致，在每次执行自动化命令之前（如执行`bundle exec fastlane test`），要先使用`xcode-select -s`来选择该项目所对应版本的 Xcode。

比如说我的电脑上有多个 Xcode 版本，在开发 Moments App 时，每次执行自动化命令之前都会执行这样一条命令`xcode-select -s /Applications/Xcode12.2.app/Contents/Developer`来选择 Moments App 项目所使用的 Xcode。这里的`Xcode12.2.app`就是我安装的 Xcode 12.2 版所在的位置。

## rbenv

有了版本一致的 Xcode 以后，因为后期我们会用到 CocoaPods 等第三方 Ruby 工具，为了自动化安装和管理这些工具，整个项目团队所使用的 Ruby 版本也必须保持一致。为此，我们就需要用到 Ruby 环境管理工具。

目前流行的 Ruby 环境管理工具有 RVM 和 rbenv。我推荐使用的是 rbenv，因为它使用 shims 文件夹来分离各个 Ruby 版本，相对于 RVM 更加轻装而方便使用。千万注意，团队内部不要同时使用不同的 Ruby 环境管理工具，否则项目编译会出错。

**rbenv** 是 Ruby 环境管理工具，能够安装、管理、隔离以及在多个 Ruby 版本之间切换。要使用 rbenv，我们可以通过 Homebrew 来安装它，下面是安装 Homebrew 和 rbenv 的脚本。

```jsx
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
brew install rbenv ruby-build rbenv-vars
```

一旦安装 rbenv 完毕，我们需要把以下的设置信息放到你的 Shell 配置文件里面，例如 `~/.bash_profile` 或者 `~/.zshrc` 等文件，这样能保证每次打开终端的时候都会初始化 rbenv。

```jsx
export PATH="$HOME/.rbenv/bin:$PATH" 
eval "$(rbenv init -)"
```

接着我们就可以安装和设置项目的 Ruby 环境了。

```jsx
$ cd $(PROJECT_DIR)
$ rbenv install 2.7.1
$ rbenv local 2.7.1
```

此处是把项目的 Ruby 环境配置为 2.7.1 版本。rbenv 会帮我们建立 一个叫作`.ruby-version` 的文件，该文件里面只保存一个版本号（例如`2.7.1`）的字符串。这个包含了版本号的文件可以用 Git 进行管理。如果要更新版本，可以通过`rbenv local`命令进行，每次更新也由 Git 统一管理，这样就能让其他开发者使用同一版本的 Ruby 开发环境了。

## RubyGems 和 Bundler

RubyGems 和 Bundler 主要是用来安装和管理 CocoaPods 和 fastlane 等第三方工具。

具体来说，RubyGems 是 Ruby 依赖包管理工具。在 Ruby 的世界，包叫作 Gem，我们可以通过`gem install`命令来安装。但是 RubyGems 在管理 Gem 版本的时候有些缺陷，就有人开发了 Bundler，用它来检查和安装 Gem 的特定版本，以此为 Ruby 项目提供一致性的环境。

要安装 Bundler，我们可执行`gem install bundler`命令进行，之后，再执行`bundle init`就可以生成一个 Gemfile 文件，像 CocoaPods 和 fastlane 等依赖包，我们就可以添加到这个文件里面。

具体代码如下：

```jsx
source "https://rubygems.org"
gem "cocoapods", "1.10.0"
gem "fastlane", "2.166.0"
```

注意我们在`gem`命令里面都指定了依赖包的特定版本号。例如，在我们的 Moment App 就使用了`1.10.0`版的 CocoaPods，然后执行`bundle install`来安装各个 Gem。 Bundler 会自动生成一个 `Gemfile.lock` 文件来锁定所安装的 Gem 的版本，例如：

```jsx
DEPENDENCIES
  cocoapods (= 1.10.0)
  fastlane (= 2.166.0)
```

为了保证团队其他成员都可以使用版本号一致的 Gem，我们需要把 `Gemfile` 和 `Gemfile.lock` 一同保存到 Git 里面统一管理起来。

到此为止，我们已经知道怎样使用 Ruby 工具链配置一个统一的开发环境。但在真实的开发环境中，搭建环境只需要一个人来完成即可，其他成员执行以下脚本就能完成整套开发环境的搭建。

```jsx
$ ./scripts/setup.sh
```

我们一起看看这个脚本做了些什么？

```jsx
# Install ruby using rbenv
ruby_version=`cat .ruby-version`
if [[ ! -d "$HOME/.rbenv/versions/$ruby_version" ]]; then
  rbenv install $ruby_version;
fi
# Install bunlder
gem install bundler
# Install all gems
bundle install
# Install all pods
bundle exec pod install
```

该脚本主要做了四件事情，第一步是在 rbenv 下安装特定版本的 Ruby 开发环境，然后通过 RubyGems 安装 Bunlder，接着使用 Bundler 安装 CocoaPods 和 fastlane 等依赖包，最后安装各个 Pod。这样，一个统一的项目环境就搭建完成了，接下来开发者就可以打开 **Moments.xcworkspace**进行开发了。

说完 Ruby 环境搭建以后，最后我们一起聊聊保证项目文件一致性的 .gitignore 文件。

## .gitignore 文件

.gitignore 文件是一个配置文件，用来指定让 Git 需要忽略的文件或者目录。如果没有 .gitignore 文件，项目成员可能会不小心把一些自动生成等无关重要的文件或者具有个人信息(例如 `xcuserdata`)的文件保存到 Git 里面。这就大大增加了查看 Git 修改历史的难度。因此，在项目初期就配置一个合适的 .gitignore 文件，能减轻后续的管理工作。

如何创建 .gitignore 文件呢？

我一般会在 `gitignore.io` 里面输入关键字，例如 Xcode，Swift 等，然后该网站会帮我们生成一个默认的 .gitignore 文件。咱们项目 Moments App 的.gitignore 文件你可以到[拉勾教育的仓库中](https://github.com/lagoueduCol/iOS-linyongjian/blob/main/.gitignore)查看。

![](assets/2021-03-17_10.24.47.png)

## **总结**

以上，我们通过 Xcode、rbenv、RubyGems 和 Bundler 搭建一个统一的 iOS 开发和构建环境。

![](assets/2021-03-17_10.25.34.png)

再次强调下，为了让各个开发和构建环境能保持一致，我们要把 .ruby-version、 Gemfile 和 Gemfile.lock 文件通过 Git 统一管理起来，并共享给整个项目团队使用。

而且，由于我们的开发环境已经通过 Bundler 管理起来，今后，当使用各个 Gem 工具的时候，也需要使用 Bundler。例如在使用 CocoaPods 时要执行`bundle exec pod`，以保证我们使用的是项目级别而不是操作系统级别的 Gem 工具。

**源码地址：**

>README.md
https://github.com/lagoueduCol/iOS-linyongjian/blob/main/README.md
Moments App 的.gitignore 文件
https://github.com/lagoueduCol/iOS-linyongjian/blob/main/.gitignore

# 学习笔记与扩展

上文有提到过，目前流行的 Ruby 环境管理工具有 `RVM` 和 `rbenv`，文章中推荐使用的是 `rbenv`，但是，如果我们的团队已经有人使用 `RVM` 来管理ruby，因为 **团队内部不能同时使用不同的 Ruby 环境管理工具，否则项目编译会出错** ，所以，我们可能也需要使用 `RVM` 来管理ruby了。

下面我们就来了解一下 `RVM`。

[RVM](https://rvm.io) 是一个命令行工具，它允许我们轻松安装、管理和使用从解释器到 gem 集的多个 ruby 环境。 

## RVM 安装

首先，安装 `RVM` 需要使用 `gpg` 或者 `gpg2`，如果没有需要使用 `Homebrew` 进行安装：

```js
brew install gpg
```

```js
brew install gpg2
```

如果没有 `Homebrew` 可以用以下方法安装：

```js
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

安装完 `gpg` 、`gpg2`之后，需要安装 GPG keys：

```js
gpg --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
```

```js
gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
```

安装完 `GPG keys` ，就可以愉快地安装rvm了：

```js
curl -sSL https://get.rvm.io | bash -s stable
```

安装成功之后，需要配置 `RVM` 开发环境，打开`~/.bash_profile` 或者 `~/.zshrc ` 文件，在文件最后一行增加下面的内容：

```js
[[ -s"$HOME/.rvm/scripts/rvm"]] && source"$HOME/.rvm/scripts/rvm"# Load RVM into a shell session *as afunction*
```

至此，`RVM` 就算安装完成了，我们可以通过 `rvm -v` 代码验证安装

![](assets/16786723453552.jpg)

## RVM 使用

### 查看可安装的Ruby版本

```js
 rvm list known
```

![](assets/16786726089796.jpg)

### 安装一个 Ruby 版本

```js
rvm install 3.0.0 
```

### 查询已经安装的 Ruby 版本

```js
rvm list
```

![](assets/16786729194881.jpg)

> => 指向的是当前使用ruby版本
> =* 指向的是当前和默认ruby版本
>  * 指向的是默认ruby版本

我们可以通过以下命令来进行切换：

### 切换 Ruby 版本

```js
rvm use 3.0.0
```

### 设置默认 Ruby 版本

```js
rvm use 3.0.0 --default
```

### 切换 Ruby 版本并设置为默认

```js
rvm use ext-ruby-3.0.0 --default
```

### 卸载已安装 Ruby 版本

```js
rvm remove 3.0.0
```

### 查看 Ruby 的安装目录

```js
//查看安装的 Ruby 目录
// -a：打印每个匹配文件名的所有匹配路径名
// which：通过搜索 PATH 环境变量中的路径来搜索与参数名称匹配的可执行文件
which -a ruby

//或者
which ruby
```

![](assets/16786736350427.jpg)

![](assets/16786739572124.jpg)

### 查看 rvm 命令帮助

```js
rvm help 
```

![](assets/16786740460740.jpg)




