---
title: 【OC】UIButton 防止重复点击的3种方法
date: 2025-01-15 16:14:30
tags:
- OC
- iOS
categories:
- iOS
---

## 一、使用场景

在实际应用过程中，有一些业务场景可能需要我们对 UIButton 响应事件的时间间隔进行控制，比如：

1. 当点击按钮来执行网络请求时，若请求耗时稍长，用户往往会多次点击。这样，就会执行多次请求，造成资源浪费
2. 在移动终端设备性能较差时，连续点击按钮会执行多次事件 **（比如 push 出来多个 viewController ）**
3. 防止暴力点击

## 二、使用方法

<!-- more -->

### 方法一：设置 enabled 或 userInteractionEnabled 属性

通过 UIButton 的`enabled`属性和`userInteractionEnabled`属性控制按钮是否可点击。此方案在逻辑上比较清晰、易懂，但具体代码书写分散，常常涉及多个地方：

1. 创建按钮

``` swift
- (void)drawBtn {
    UIButton *btn = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 200, 100)];
    [btn setTitle:@"按钮点击" forState:UIControlStateNormal];
    [btn setTitleColor:[UIColor redColor] forState:UIControlStateNormal];
    // 按钮不可点击时,文字颜色置灰
    [btn setTitleColor:[UIColor grayColor] forState:UIControlStateDisabled];
    [btn setTitleColor:[UIColor blueColor] forState:UIControlStateHighlighted];
    btn.center = self.view.center;
    [btn addTarget:self action:@selector(tapBtn:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn];
}
```

按钮不可点击时，标题颜色置灰，方便对比

2. 点击事件

``` swift
- (void)tapBtn:(UIButton *)btn {
    NSLog(@"按钮点击...");
    btn.enabled = NO;
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        btn.enabled = YES;
    });
}
```

### 方法二：借助 cancelPreviousPerformRequestsWithTarget:selector:object实现

通过 NSObject 的两个方法

``` swift
// 此方法会在连续点击按钮时取消之前的点击事件，从而只执行最后一次点击事件
+ (void)cancelPreviousPerformRequestsWithTarget:(id)aTarget selector:(SEL)aSelector object:(nullable id)anArgument;
// 多长时间后做某件事情
- (void)performSelector:(SEL)aSelector withObject:(nullable id)anArgument afterDelay:(NSTimeInterval)delay;

```

按钮创建还是上面代码，按钮点击事件如下：

``` swift
- (void)tapBtn:(UIButton *)btn {
    NSLog(@"按钮点击了...");
    // 此方法会在连续点击按钮时取消之前的点击事件，从而只执行最后一次点击事件
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(buttonClickedAction:) object:btn];
    // 多长时间后做某件事情
    [self performSelector:@selector(buttonClickedAction:) withObject:btn afterDelay:2.0];
}
 
- (void)buttonClickedAction:(UIButton *)btn {
    NSLog(@"真正开始执行业务 - 比如网络请求...");
}
```

这个方法有一些弊端，可能会出现延时现象，并且需要对大量的UIButton做处理，工作量大，不太方便。

### 方法三 通过 runtime 交换方法实现

通过 Runtime 交换 UIButton 的响应事件方法，从而控制响应事件的时间间隔。

实现步骤如下:

1. 创建一个 UIButton 的分类，使用 runtime 增加 public 属性 `cs_eventInterval` 和 private 属性 `cs_eventInvalid`
2. 在 `+load` 方法中使用 runtime 将 UIButton 的 `-sendAction:to:forEvent:` 方法与自定义的 `cs_sendAction:to:forEvent:` 方法进行交换
3. 使用 `cs_eventInterval` 作为控制 `cs_eventInvalid` 的计时因子，用 `cs_eventInvalid` 控制 UIButton 的 event 事件是否有效

代码实现如下：

`.h` 实现：

``` swift
@interface UIButton (Extension)
 
/** 时间间隔 */
@property(nonatomic, assign)NSTimeInterval cs_eventInterval;
 
@end
``` 

`.m`实现：

``` swift
#import "UIButton+Extension.h"
#import <objc/runtime.h>
 
static char *const kEventIntervalKey = "kEventIntervalKey"; // 时间间隔
static char *const kEventInvalidKey = "kEventInvalidKey";   // 是否失效
 
@interface UIButton()
 
/** 是否失效 - 即不可以点击 */
@property(nonatomic, assign)BOOL cs_eventInvalid;
 
@end
 
@implementation UIButton (Extension)
 
+ (void)load {
    // 交换方法
    Method clickMethod = class_getInstanceMethod(self, @selector(sendAction:to:forEvent:));
    Method cs_clickMethod = class_getInstanceMethod(self, @selector(cs_sendAction:to:forEvent:));
    method_exchangeImplementations(clickMethod, cs_clickMethod);
}
 
#pragma mark - click
 
- (void)cs_sendAction:(SEL)action to:(id)target forEvent:(UIEvent *)event {
    if (!self.cs_eventInvalid) {
        self.cs_eventInvalid = YES;
        [self cs_sendAction:action to:target forEvent:event];
        [self performSelector:@selector(setCs_eventInvalid:) withObject:@(NO) afterDelay:self.cs_eventInterval];
    }
}
 
#pragma mark - set | get
 
- (NSTimeInterval)cs_eventInterval {
    return [objc_getAssociatedObject(self, kEventIntervalKey) doubleValue];
}
 
- (void)setCs_eventInterval:(NSTimeInterval)cs_eventInterval {
    objc_setAssociatedObject(self, kEventIntervalKey, @(cs_eventInterval), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}
 
- (BOOL)cs_eventInvalid {
    return [objc_getAssociatedObject(self, kEventInvalidKey) boolValue];
}
 
- (void)setCs_eventInvalid:(BOOL)cs_eventInvalid {
    objc_setAssociatedObject(self, kEventInvalidKey, @(cs_eventInvalid), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}
```                 

测试代码如下：

``` swift
- (void)drawExpecialBtn{
    UIButton *btn = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 200, 100)];
    [btn setTitle:@"按钮点击" forState:UIControlStateNormal];
    [btn setTitleColor:[UIColor redColor] forState:UIControlStateNormal];
    // 按钮不可点击时,文字颜色置灰
    [btn setTitleColor:[UIColor grayColor] forState:UIControlStateDisabled];
    [btn setTitleColor:[UIColor blueColor] forState:UIControlStateHighlighted];
    btn.center = self.view.center;
    [btn addTarget:self action:@selector(tapBtn:) forControlEvents:UIControlEventTouchUpInside];
    btn.cs_eventInterval = 2.0;
    [self.view addSubview:btn];
}
 
- (void)tapBtn:(UIButton *)btn {
    NSLog(@"按钮点击...");
}
```

## 三、注意事项

在方法三中交互 *UIButton* 的`sendAction:to:forEvent:`方法，实际上交互的是 *UIControl* 的 `sendAction:to:forEvent:`方法，所以在使用 *UIControl* 或其子类（比如*UISlider*）的 `sendAction:to:forEvent:`方法时会引起参数缺失的崩溃。

测试代码如下：

``` swift
/** 注意事项 */
- (void)slideTest {
    UISlider *slide = [[UISlider alloc] initWithFrame:CGRectMake(0, 0, 200, 59)];
    [slide addTarget:self action:@selector(tapSlide:) forControlEvents:UIControlEventTouchUpInside];
    slide.center = self.view.center;
    [self.view addSubview:slide];
}
 
- (void)tapSlide:(UISlider *)slider {
    NSLog(@"UISlider点击...");
}
```

解决方案：

1. 可以将`UIButton+Extension`改成`UIControl+Extension`以避免此问题
2. 也可以在`cs_sendAction:to:forEvent:`方法中加入判断，如下：

``` swift
- (void)cs_sendAction:(SEL)action to:(id)target forEvent:(UIEvent *)event {
    if (![NSStringFromClass(self.class)isEqualToString:@"UIButton"]){
       /** 处理交互事件*/
       [self cs_sendAction:action to:target forEvent:event];
       return;
    }
    if (!self.cs_eventInvalid) {
        self.cs_eventInvalid = YES;
        [self cs_sendAction:action to:target forEvent:event];
        [self performSelector:@selector(setCs_eventInvalid:) withObject:@(NO) afterDelay:self.cs_eventInterval];
    }
}
```

