---
title: 【OC】ReactiveObjC（RAC）快速入门
date: 2026-06-05 11:39:26
tags:
- OC
- iOS
- RAC
categories:
- iOS
---

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/iMacImg/reactiveobjc-rac.png)

## ReactiveObjC 是什么？

`ReactiveObjC` 是 `ReactiveCocoa` 的 Objective-C 版本，是函数响应式编程在 Objective-C 中的实现，它的核心思想是：

- **一切皆信号** —— 连续时间轴上的事件流
- **用操作符声明“将发生什么”**，而不是命令式地写回调、代理、KVO
- 消除状态不一致、回调地狱、手动更新 UI 的痛点

<!-- more -->

它能让你把这种代码：

```objc
- (void)textFieldDidChange:(UITextField *)field {
    if (field.text.length > 0 && self.passwordField.text.length > 0) {
        self.loginButton.enabled = YES;
    } else {
        self.loginButton.enabled = NO;
    }
}
```

变成清晰的高层逻辑：

```objc
RAC(self.loginButton, enabled) = [RACSignal
    combineLatest:@[self.usernameField.rac_textSignal,
                    self.passwordField.rac_textSignal]
    reduce:^(NSString *u, NSString *p){
        return @(u.length > 0 && p.length > 0);
    }];
```

## 安装集成

### 使用 CocoaPods（推荐）

```ruby
pod 'ReactiveObjc', '~> 3.1.1'
```

在需要使用的地方导入主头文件：

```objc
#import <ReactiveObjC/ReactiveObjC.h>
```

### 使用 Carthage

```
github "ReactiveCocoa/ReactiveObjC" ~> 3.1.1
```

### 手动集成

将 ReactiveObjC 源码拖入项目，添加依赖库 `libextobjc`。

## 核心概念与第一个信号

### RACSignal

代表**一个将来会产生事件（值、完成、错误）的流**。  
它本身是“冷”的 —— 没有人订阅时，什么也不会发生。  

```objc
// 创建一个信号
RACSignal *signal = [RACSignal createSignal:^RACDisposable *(id<RACSubscriber> subscriber) {
    [subscriber sendNext:@"Hello"];
    [subscriber sendCompleted];
    return [RACDisposable disposableWithBlock:^{
        // 清理资源，比如取消网络请求
        NSLog(@"信号被销毁");
    }];
}];

// 订阅信号
[signal subscribeNext:^(id x) {
    NSLog(@"收到：%@", x);
}];
// 输出：收到：Hello
// 输出：信号被销毁
```

### RACSubscriber

订阅者，负责接收并处理信号发来的事件。你只需通过 `subscribeNext:error:completed:` 等方法来“成为”订阅者。

### RACDisposable

用来**取消订阅**，释放资源。订阅信号时会返回 disposable，当你不再需要时调用 `[disposable dispose]`，或者让页面销毁时自动处理。

### 冷信号与热信号

- **冷信号**：每次订阅都会触发完整的事件序列（像一次独立的 HTTP 请求）
- **热信号**：无论订阅与否，事件都在持续产生；订阅者只会收到订阅之后的事件。  
  热信号的典型代表是 `RACSubject`。

## 信号的创建方式

### 基本创建

```objc
// 发出一个值然后完成
RACSignal *just = [RACSignal return:@"立即值"];

// 立即发送错误
RACSignal *error = [RACSignal error:[NSError errorWithDomain:@"xx" code:0 userInfo:nil]];

// 空信号，立即完成
RACSignal *empty = [RACSignal empty];

// 永不完成的信号（可用于测试）
RACSignal *never = [RACSignal never];

// 延迟创建（被订阅时才执行block）
RACSignal *defer = [RACSignal defer:^RACSignal *{
    return [RACSignal return:@(arc4random())];
}];
```

### 定时器信号

```objc
// 每1秒发送一次，在主线程
[[RACSignal interval:1 onScheduler:[RACScheduler mainThreadScheduler]]
    subscribeNext:^(NSDate *date) {
        NSLog(@"当前时间：%@", date);
    }];
```

### 从方法调用创建

```objc
// 把 viewWillAppear: 转成信号
[[self rac_signalForSelector:@selector(viewWillAppear:)]
    subscribeNext:^(RACTuple *tuple) {
        NSLog(@"页面即将出现");
    }];
```

### 从 KVO 创建

```objc
// 使用宏 RACObserve
[RACObserve(self, username) subscribeNext:^(NSString *name) {
    NSLog(@"用户名变为：%@", name);
}];
```

### 从 Notification 创建

```objc
[[[NSNotificationCenter defaultCenter] rac_addObserverForName:UIApplicationDidBecomeActiveNotification object:nil]
    subscribeNext:^(NSNotification *noti) {
        NSLog(@"应用回到前台");
    }];
```

## 订阅与生命周期

订阅信号时可以使用不同的事件回调：

```objc
RACSignal *signal = ...;

RACDisposable *disposable = [signal subscribeNext:^(id x) {
    NSLog(@"Next: %@", x);
} error:^(NSError *error) {
    NSLog(@"Error: %@", error);
} completed:^{
    NSLog(@"Completed");
}];

// 如果需要提前取消
[disposable dispose];
```

**订阅总是返回一个 RACDisposable**。如果你不管它，当信号完成或出错时，它会自动 dispose。

## 常用操作符

### 变换类

```objc
// map: 转换值
[[self.usernameField.rac_textSignal map:^id(NSString *text) {
    return [text stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
}] subscribeNext:^(NSString *trimmed) {
    NSLog(@"修剪后：%@", trimmed);
}];

// flattenMap: 将每个值映射为一个新信号，然后压平
[[self.usernameField.rac_textSignal flattenMap:^RACSignal *(NSString *text) {
    // 返回一个搜索信号
    return [self searchSignalWithKeyword:text];
}] subscribeNext:^(id result) {
    // 拿到最终搜索结果
}];
```

### 过滤与组合

```objc
// filter: 只允许满足条件的通过
[[self.ageField.rac_textSignal filter:^BOOL(NSString *text) {
    return text.length <= 3;
}] subscribeNext:^(NSString *x) { /* ... */ }];

// ignore: 忽略特定值
[[self.button rac_signalForControlEvents:UIControlEventTouchUpInside]
    subscribeNext:^(UIButton *btn) { /* ... */ }];
// 等价于绑定命令，见后续

// combineLatest: 当任意一个信号产生新值时，取最新的组合
RACSignal *combined = [RACSignal combineLatest:@[signalA, signalB]
                                          reduce:^id(NSString *a, NSNumber *b){
    return [NSString stringWithFormat:@"%@ - %@", a, b];
}];

// zip: 严格按配对顺序，两个信号都有新值时才触发
RACSignal *zipped = [signalA zipWith:signalB];

// merge: 合并多个信号为一个
RACSignal *merged = [signalA merge:signalB];
```

### 时间与节流

```objc
// throttle: 节流，0.3秒内只取最后一个值（常用于搜索框）
[[self.searchField.rac_textSignal throttle:0.3]
    subscribeNext:^(NSString *text) {
        [self performSearch:text];
    }];

// distinctUntilChanged: 当值变化时才发送（常用于避免重复刷新）
[[self.nicknameField.rac_textSignal distinctUntilChanged]
    subscribeNext:^(NSString *x) { /* UI更新 */ }];

// delay: 延迟发送
[[signal delay:2.0] subscribeNext:^(id x) { ... }];
```

### 流的切换与展平

```objc
// switchToLatest: 只监听最新的信号，自动取消前一个（典型搜索场景）
RACSignal *searchTextSignal = self.searchField.rac_textSignal;
RACSignal *results = [searchTextSignal map:^id(NSString *text) {
    return [self searchSignalWithKeyword:text]; // 返回搜索信号
}];
[[results switchToLatest] subscribeNext:^(id data) {
    // 只处理最新一次搜索的结果
}];

// flatten: 默认并发，flattenMap 就是一个 map + flatten
```

### 生命周期控制

```objc
// take: 只取前3个值
[[signal take:3] subscribeNext:^(id x) { ... }];

// takeUntil: 当另一个信号发送值时，终止当前信号
[[self.usernameField.rac_textSignal
    takeUntil:self.rac_willDeallocSignal] // 页面销毁时自动停止
    subscribeNext:^(NSString *text) { ... }];
```

### 副作用（调试利器）

```objc
[[[[signal
    doNext:^(id x) { NSLog(@"即将发送：%@", x); }]
    doError:^(NSError *e) { NSLog(@"错误：%@", e); }]
    doCompleted:^{ NSLog(@"流结束了"); }]
    subscribeNext:^(id x) { /* 最终处理 */ }];
```

## UIKit 响应式扩展

ReactiveObjC 为常用 UIKit 控件提供了**分类方法**，它们返回信号，让你以流的方式处理 UI 事件。

### UITextField / UITextView

```objc
// 实时文本信号
[[self.nameField rac_textSignal] subscribeNext:^(NSString *text) {
    NSLog(@"输入内容：%@", text);
}];

// 绑定到 Label
RAC(self.displayLabel, text) = self.nameField.rac_textSignal;
```

### UIButton

```objc
// 按钮点击信号
[[self.loginButton rac_signalForControlEvents:UIControlEventTouchUpInside]
    subscribeNext:^(UIButton *button) {
        NSLog(@"点击了登录");
    }];

// 更强大的方式：绑定 RACCommand（见下一章）
self.loginButton.rac_command = self.loginCommand;
```

### UISwitch / UISlider / UISegmentedControl

```objc
// UISwitch 的开关状态
[[self.mySwitch rac_signalForControlEvents:UIControlEventValueChanged]
    subscribeNext:^(UISwitch *s) {
        NSLog(@"开关：%@", s.on ? @"ON" : @"OFF");
    }];
// 或者使用 KVO：
RAC(self.statusLabel, text) = [RACObserve(self.mySwitch, on) map:^(NSNumber *on) {
    return on.boolValue ? @"开" : @"关";
}];
```

### UITableView / UICollectionView

响应式不直接提供数据源信号，但可以通过 `rac_signalForSelector:` 监听 delegate 方法，或配合 ViewModel 使用。

### 自动绑定宏 RAC()

```objc
// RAC(目标对象, 属性) = 信号
// 当信号发出新值时，自动设置属性
RAC(self.nameLabel, text) = self.nameField.rac_textSignal;
RAC(self.loginButton, enabled) = self.formValidSignal;
```

`RAC()` 内部调用了 `rac_liftSelector:` 和 KVC，确保线程安全。

## RACCommand —— 面向动作的响应式武器

**RACCommand** 专门用来处理“用户执行动作 -> 产生结果”的场景，比如点击按钮登录、刷新数据。

### 创建与基本用法

```objc
@weakify(self)

self.loginCommand = [[RACCommand alloc] initWithSignalBlock:^RACSignal *(id input) {
    @strongify(self)
    // 返回一个信号，表示这次操作的工作流
    return [self loginRequestSignal];
}];

// 绑定按钮
self.loginButton.rac_command = self.loginCommand;

// 监听是否正在执行（自动管理 enabled 状态）
[self.loginCommand.executing subscribeNext:^(NSNumber *executing) {
    @strongify(self)
    if (executing.boolValue) {
        [self.activityIndicator startAnimating];
    } else {
        [self.activityIndicator stopAnimating];
    }
}];

// 处理执行结果或错误
[self.loginCommand.executionSignals subscribeNext:^(RACSignal *signal) {
    // signal 是每次执行返回的那个信号
    [signal subscribeNext:^(id result) {
        NSLog(@"登录成功，结果：%@", result);
    }];
}];
// 更简洁的错误处理
[self.loginCommand.errors subscribeNext:^(NSError *error) {
    NSLog(@"登录失败：%@", error.localizedDescription);
}];
```

### RACCommand 的重要属性

- `executionSignals`：高阶信号，每次执行发出一个新的工作信号，需 `switchToLatest` 或 `flatten`
- `errors`：专门收集所有执行中出现的错误
- `executing`：当前是否有命令正在执行（布尔信号）
- `enabled`：命令是否可用，可直接绑定 UI 控件

**注意**：`self.button.rac_command = command` 会自动将 `command.enabled` 绑定到按钮的 `enabled` 属性。

## RACSequence —— 处理集合数据

`RACSequence` 是流在集合上的体现，支持对数组、字典进行流式变换。

```objc
NSArray *numbers = @[@1, @2, @3, @4, @5];

// 过滤、映射，最后转回数组
NSArray *result = [[[numbers.rac_sequence
    filter:^BOOL(NSNumber *num) {
        return num.integerValue % 2 == 0;
    }]
    map:^id(NSNumber *num) {
        return @(num.integerValue * 10);
    }]
    array];

// result: @[@20, @40]
```

也支持字典：

```objc
NSDictionary *dict = @{@"A": @"1", @"B": @"2"};
[[dict.rac_sequence map:^id(RACTuple *keyValue) {
    RACTupleUnpack(NSString *key, NSString *value) = keyValue;
    return [NSString stringWithFormat:@"%@=%@", key, value];
}] array]; // @[@"A=1", @"B=2"]
```

可配合 `RACSignal` 使用，比如将数组中的每个对象转换为信号，然后用 `flattenMap:` 并发执行。

## 调度器 RACScheduler

控制信号在哪个队列/线程上发送。

```objc
RACScheduler *backgroundScheduler = [RACScheduler schedulerWithPriority:RACSchedulerPriorityBackground];

[[[RACSignal createSignal:^RACDisposable *(id<RACSubscriber> subscriber) {
    // 这在默认线程（订阅时所在线程）
    [subscriber sendNext:@"数据"];
    [subscriber sendCompleted];
    return nil;
}] subscribeOn:backgroundScheduler]    // 订阅及信号产生工作在后台
    deliverOnMainThread]                 // 后续事件切换到主线程
    subscribeNext:^(NSString *x) {
        // 此时在主线程更新 UI
        self.label.text = x;
    }];
```

## 内存管理与避免循环引用

### @weakify / @strongify

所有 block 内如果引用了 `self`，必须用这对宏打破循环。

```objc
@weakify(self)
[[self.button rac_signalForControlEvents:UIControlEventTouchUpInside]
    subscribeNext:^(UIButton *btn) {
        @strongify(self)
        [self.navigationController pushViewController:newVC animated:YES];
    }];
```

**导入**：`#import <ReactiveObjC/EXTScope.h>` 已经包含在主头文件中。

### 用 takeUntil: 自动取消订阅

```objc
[[self.nameField.rac_textSignal
    takeUntil:self.rac_willDeallocSignal]
    subscribeNext:^(NSString *text) {
        @strongify(self)
        self.nameLabel.text = text;
    }];
```

当 `self` 释放时，`rac_willDeallocSignal` 会发送一个值，信号自动终止，订阅释放。  
**这应该成为你的习惯用法。**

### RAC() 宏的内存管理

`RAC(target, property)` 持有的是弱引用，不会造成循环。但右边的信号如果引用了 `target`，仍然会导致循环。所以信号部分内部的 block 也应用 `@weakify/@strongify`。

## 网络请求实战（与 AFNetworking 结合）

将异步网络操作包装成信号，让网络请求也变成流。

```objc
// 封装一个 GET 请求信号
- (RACSignal *)fetchUserInfoWithID:(NSString *)userID {
    return [RACSignal createSignal:^RACDisposable *(id<RACSubscriber> subscriber) {
        // 假设使用 AFNetworking
        AFHTTPSessionManager *manager = [[AFHTTPSessionManager alloc] init];
        NSURLSessionDataTask *task = [manager GET:@"https://api.example.com/user"
                                       parameters:@{@"id": userID}
                                          success:^(NSURLSessionDataTask *task, id responseObject) {
            [subscriber sendNext:responseObject];
            [subscriber sendCompleted];
        } failure:^(NSURLSessionDataTask *task, NSError *error) {
            [subscriber sendError:error];
        }];
        
        // 返回 disposable，内部取消请求
        return [RACDisposable disposableWithBlock:^{
            [task cancel];
        }];
    }];
}
```

在 ViewModel 中使用：

```objc
- (RACCommand *)loadUserCommand {
    if (!_loadUserCommand) {
        @weakify(self)
        _loadUserCommand = [[RACCommand alloc] initWithSignalBlock:^RACSignal *(NSString *userID) {
            @strongify(self)
            return [[[self fetchUserInfoWithID:userID]
                     map:^id(id response) {
                         // 转换为模型对象
                         return [[UserModel alloc] initWithDictionary:response];
                     }]
                     doNext:^(UserModel *user) {
                         @strongify(self)
                         self.currentUser = user;
                     }];
        }];
    }
    return _loadUserCommand;
}
```

绑定到按钮，执行 `[self.loadUserCommand execute:@"123"]`，然后监听 `currentUser` 的变化刷新界面。

## MVVM + ReactiveObjC 完整示例

让我们构建一个简单的**用户搜索页面**，展示 ViewModel 如何通过信号驱动 View。

### ViewModel

```objc
@interface SearchViewModel : NSObject
@property (nonatomic, strong) RACCommand *searchCommand;
@property (nonatomic, strong) NSArray<NSString *> *results;
@end

@implementation SearchViewModel

- (instancetype)init {
    if (self = [super init]) {
        [self setup];
    }
    return self;
}

- (void)setup {
    @weakify(self)
    self.searchCommand = [[RACCommand alloc] initWithSignalBlock:^RACSignal *(NSString *keyword) {
        @strongify(self)
        return [[[self searchSignalWithKeyword:keyword]
                 doNext:^(NSArray *results) {
                     @strongify(self)
                     self.results = results;
                 }]
                 materialize]; // 可选：使错误在内部处理
    }];
}

- (RACSignal *)searchSignalWithKeyword:(NSString *)keyword {
    return [RACSignal createSignal:^RACDisposable *(id<RACSubscriber> subscriber) {
        // 模拟网络搜索
        dispatch_async(dispatch_get_global_queue(0, 0), ^{
            [NSThread sleepForTimeInterval:0.5];
            NSArray *results = @[[keyword stringByAppendingString:@" result1"],
                                 [keyword stringByAppendingString:@" result2"]];
            [subscriber sendNext:results];
            [subscriber sendCompleted];
        });
        return nil;
    }];
}

@end
```

### ViewController

```objc
@interface SearchViewController : UIViewController
@property (weak, nonatomic) IBOutlet UITextField *searchField;
@property (weak, nonatomic) IBOutlet UIButton *searchButton;
@property (weak, nonatomic) IBOutlet UITableView *tableView;
@property (weak, nonatomic) IBOutlet UIActivityIndicatorView *indicator;

@property (nonatomic, strong) SearchViewModel *viewModel;
@end

@implementation SearchViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.viewModel = [[SearchViewModel alloc] init];
    
    // 绑定输入框内容到 ViewModel 的搜索关键词（可选）
    @weakify(self)
    
    // 按钮绑定命令
    self.searchButton.rac_command = self.viewModel.searchCommand;
    
    // 点击搜索时把输入框文字传给命令
    [[self.searchButton rac_signalForControlEvents:UIControlEventTouchUpInside]
        subscribeNext:^(UIButton *btn) {
            @strongify(self)
            [self.viewModel.searchCommand execute:self.searchField.text];
        }];
    
    // 执行状态 -> 菊花
    [self.viewModel.searchCommand.executing subscribeNext:^(NSNumber *executing) {
        @strongify(self)
        if (executing.boolValue) {
            [self.indicator startAnimating];
        } else {
            [self.indicator stopAnimating];
        }
    }];
    
    // 结果变化 -> 刷新表格
    [RACObserve(self.viewModel, results) subscribeNext:^(NSArray *results) {
        @strongify(self)
        [self.tableView reloadData];
    }];
}

@end
```

这个例子完美展示了 ViewModel 不持有 View，View 通过信号绑定来响应状态变化。

## 错误处理与调试

### 错误处理操作符

```objc
// catch: 拦截错误并返回新的信号
[[[self fetchData] catch:^RACSignal *(NSError *error) {
    // 发生错误时，返回一个带有缓存值的信号，然后完成
    return [RACSignal return:self.cachedData];
}] subscribeNext:^(id x) { ... }];

// catchTo: 发生错误时替换为一个固定的信号
[[self fetchData] catchTo:[RACSignal return:@"默认值"]];

// retry: 自动重新订阅（重试）
[[self fetchData] retry:2]; // 失败后重试2次

// 只处理特定错误码
[[self fetchData] catch:^RACSignal *(NSError *error) {
    if (error.code == NSURLErrorNotConnectedToInternet) {
        return [RACSignal return:@"离线数据"];
    } else {
        return [RACSignal error:error]; // 继续抛出
    }
}];
```

### 调试信号

```objc
// 打印订阅、事件、销毁的详细日志
[[self.nameField.rac_textSignal logAll] subscribeNext:^(NSString *x) {
    // ...
}];

// 或者分开打印
[[self.nameField.rac_textSignal logNext] subscribeNext:...];
```

在控制台你会看到类似 `[RACSignal ...] subscribed`、`next: xxx` 等输出，非常直观。

## 最佳实践与常见问题

### ✅ 推荐做法

1. 所有信号命名包含 “Signal”：`validSignal`、`fetchUserCommand`
2. 视图控制器中尽量用 `takeUntil:self.rac_willDeallocSignal`
3. 用 RACCommand 来承载所有用户动作，而不是直接在 `subscribeNext` 中写副作用
4. 网络请求信号一定要返回 disposable 来取消任务
5. 用 `flattenMap` 处理信号中的信号，避免嵌套订阅
6. 多用 `combineLatest` 来做表单验证、多条件控制
7. ViewModel 的属性用 `RACObserve` 监听然后驱动 UI 刷新

### ❌ 常见陷阱

| 陷阱 | 解决方案 |
|------|----------|
| 循环引用 | 始终使用 `@weakify/@strongify` |
| 忘记取消订阅 | 用 `takeUntil:` 绑定生命周期 |
| 热信号造成回放旧数据 | 注意 `replay` / `replayLast` 的使用场景 |
| 在 `subscribeNext` 中改变信号源导致死循环 | 将业务逻辑放到 `doNext:` 或 `flattenMap:` |
| 过度使用宏导致调试困难 | 适当保留中间变量，分步绑定 |
