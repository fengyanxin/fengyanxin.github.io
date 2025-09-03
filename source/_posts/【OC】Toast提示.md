---
title: 【OC】Toast 提示
date: 2025-09-03 16:24:33
tags:
- OC
- iOS
categories:
- iOS
---

## Toast 提示简介

除了 Android 规范，Windows 的规范中也有 Toast，但定义不一样。Toast 在 Android 中的定义就是大家所熟悉的黑色半透明提示，而在 Windows 的规范中 Toast 概念几乎等同于 Android 的一条 Notification(通知)。

Windows 和 Android 的 Toast 有着千丝万缕的联系，据说一位微软前员工在开发 MSN Messenger 时，觉得MSN弹出通知方式很像烤面包（Toast）烤熟时从烤面包机（Toaster）里弹出来一样，因此把这种提示方式命名为 Toast，后来这位微软前员工带着这一习惯命名跳槽去了 Google。

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/2)

<!-- more -->

## iOS 中的 Toast

iOS 并没有 Toast 这个控件，但 iOS 中确实有类似于 Toast 样式出现，例如 iOS 的音量调节提示。iOS 把这个组件叫做 UIProgressHUD，可惜这个组件是系统私有的，第三方 App 无法直接获取使用，因此出现了各种模仿它的第三方控件，一个 iOS 中的 Toast 提示的 gitHub 地址：[https://github.com/scalessec/Toast](https://github.com/scalessec/Toast)

## Toast的优缺点

优点：

1. 占用屏幕空间小。
2. 不会打断用户操作。
3. 使用简单适用范围广。

缺点：

1. 出现时间短，在碎片化时代注意力不集中容易错过 Toast 提示。
2. 虽然非模态，但是黑乎乎的样式上给人一种模态的错觉。
3. 遮盖其他控件，但不能对 Toast 进行交互。

## 一个简单的 Toast 控件

以下是一个很简洁的 framework:

``` swift
//
//  Toast.h
//  Toast
//
//  Created by Charles Scalesse on 11/3/16.
//
//

#import <UIKit/UIKit.h>

//Toast的项目版本号
FOUNDATION_EXPORT double ToastVersionNumber;

//Toast的项目版本字符串
FOUNDATION_EXPORT const unsigned char ToastVersionString[];

// 在这个标题中，您应该使用诸如import<toast/public header.h>
#import <Toast/UIView+Toast.h>
```

``` swift
//
//  UIView+Toast.h
//  Toast
//
#import <UIKit/UIKit.h>
//Toast定义的三个基本位置常量
extern const NSString * CSToastPositionTop;
extern const NSString * CSToastPositionCenter;
extern const NSString * CSToastPositionBottom;

@class CSToastStyle;

/**
 Toast是一个Objective-C类别，它将Toast通知添加到uiview
对象类。它的目的是简单，轻便，易于使用。大多数
Toast通知可以用一行代码触发。

'maketoast:'方法创建一个新视图，然后将其显示为toast。

'showtoast:'方法将任何视图显示为toast。
 
 */
@interface UIView (Toast)

/**
 创建并显示带有消息的新Toast视图，并用
默认持续时间和位置。使用共享样式设置样式。

@参数message：要显示的消息
 */
- (void)makeToast:(NSString *)message;

/**
 创建并显示带有消息的新Toast视图。持续时间和位置
可以显式设置。使用共享样式设置样式。

@参数message：要显示的消息
@参数duration ：Toast持续时间
@参数position：定位吐司的中心点。可以是预定义的CSTOastPosition之一
常量或包装在“nsvalue”对象中的“cgpoint”。
 */
- (void)makeToast:(NSString *)message
         duration:(NSTimeInterval)duration
         position:(id)position;

/**
 创建并显示带有消息的新Toast视图。持续时间、位置和
可以显式设置样式。

@参数message：要显示的消息
@参数duration ：Toast持续时间
@参数position：定位吐司的中心点。可以是预定义的CSTOastPosition之一
常量或包装在“nsvalue”对象中的“cgpoint”。
@参数style：nil时将使用共享样式
 */
- (void)makeToast:(NSString *)message
         duration:(NSTimeInterval)duration
         position:(id)position
            style:(CSToastStyle *)style;

/**
创建并显示带有消息、标题和图像的新Toast视图。持续时间，
位置和样式可以显式设置。当
Toast视图完成。`如果toast视图从tap中取消，则didtap“将是”yes“。
 
@参数message：要显示的消息
@参数duration ：Toast持续时间
@参数position：定位Toast的中心点。可以是预定义的CSTOastPosition之一
常量或包装在“nsvalue”对象中的“cgpoint”。
@参数title：标题
@参数image：图像
@参数style：样式。nil时将使用共享样式
@param completion ：toast视图消失后执行的完成块。
如果toast视图从tap中取消，则didtap将为“是”。
 */
- (void)makeToast:(NSString *)message
         duration:(NSTimeInterval)duration
         position:(id)position
            title:(NSString *)title
            image:(UIImage *)image
            style:(CSToastStyle *)style
       completion:(void(^)(BOOL didTap))completion;

/**
创建一个新的toast视图，其中包含消息、标题和图像的任何组合。
外观和感觉是通过样式配置的。与“makeToast:”方法不同，
此方法不会自动呈现toast视图。其中一个toast是:
方法必须用于显示结果视图。

@ 警告：如果消息、标题和图像都是nil，这个方法将返回nil。
@参数message：要显示的消息
@参数title：标题
@参数image：图像
@参数style：样式。nil时将使用共享样式
@返回新创建的Toast视图
 */
- (UIView *)toastViewForMessage:(NSString *)message
                          title:(NSString *)title
                          image:(UIImage *)image
                          style:(CSToastStyle *)style;

/**
 隐藏活跃的Toast。如果一个视图中有多个激活的toast，则此方法
 隐藏最古老的toast（第一个被展示的toast）。
 */
- (void)hideToast;

/**
 隐藏一个活跃的toast。

@param toast：活跃的toast视图将被取消。任何正在展示的吐司
在屏幕上被认为是活跃的。

@警告：这没有清除当前正在队列中等待的toast视图。
 */
- (void)hideToast:(UIView *)toast;

/**
隐藏所有活动的Toast视图并清除队列。
 */
- (void)hideAllToasts;

/**
隐藏所有活动的Toast视图，并提供隐藏活动和清除队列的选项。

@参数includeActivity：如果为“true”，toast活动也将被隐藏。默认值为“false”。
@param clearqueue：如果为“true”，则从队列中删除所有toast视图。默认值为“true”。
 */
- (void)hideAllToasts:(BOOL)includeActivity clearQueue:(BOOL)clearQueue;

/**
 从队列中删除所有toast视图。这对活跃的toast视图没有影响。
 */
- (void)clearToastQueue;

/**
在指定位置创建并显示新的toast活动指示器视图。
@警告：每个父视图只能显示一个toast活动指示器视图。后续
对“makeToastActivity:”的调用将被忽略，直到调用hideToastActivity。
@警告` maketoastactivity:`独立于showtoas:方法工作。
在显示Toast视图时，可以显示和取消活跃的Toast视图。“makeToastActivity:”
对showToast:方法的排队行为没有影响。

@参数position：定位toast的中心点。可以是预定义的CSTOastPosition之一
常量或包装在“nsvalue”对象中的“cgpoint”。
 */
- (void)makeToastActivity:(id)position;

/**
关闭活动的Toast活动指示器视图。
 */
- (void)hideToastActivity;

/**
 使用默认的持续时间和位置将任何视图显示为toast。

@参数toast：将显示为toast的视图
 */
- (void)showToast:(UIView *)toast;

/**
 在指定的位置和持续时间内将任何视图显示为toast。当toast视图完成时，完成块执行。
如果toast视图从tap中被取消，则“didTap”将变为“YES”。

@参数Toast：要显示为Toast的视图
@参数duration：Toast持续时间
@参数Toast：定位Toast的中心点。可以是预定义的CSTOastPosition之一
常量或包装在“nsvalue”对象中的“cgpoint”。
@参数completion：toast视图消失后执行的完成块。
如果toast视图从tap中取消，则didtap将为“是”。
 */
- (void)showToast:(UIView *)toast
         duration:(NSTimeInterval)duration
         position:(id)position
       completion:(void(^)(BOOL didTap))completion;

@end

/**
 “CSToastStyle”实例定义通过“makeToast:”方法创建的toast视图的外观，
以及直接使用toastViewForMessage:title:image:style:”创建的toast视图的外观。

@警告：' CSToastStyle '为默认toast视图提供了相对简单的样式选项。
如果需要一个具有更复杂UI的toast视图，
创建自定义UIView子类并使用' showToast: '方法来呈现它可能更有意义。
 */
@interface CSToastStyle : NSObject

/**
背景颜色。默认为' [UIColor blackColor] '，不透明度为80%。 */
@property (strong, nonatomic) UIColor *backgroundColor;

/**
标题的颜色。默认值是' [UIColor whiteColor] '。
 */
@property (strong, nonatomic) UIColor *titleColor;

/**
消息的颜色。默认值是' [UIColor whiteColor] '。
 */
@property (strong, nonatomic) UIColor *messageColor;

/**
 从0.0到1.0的百分比值，表示Toast视图相对于其SuperView的最大宽度。
默认值为0.8（SuperView宽度的80%）。
 */
@property (assign, nonatomic) CGFloat maxWidthPercentage;

/**
 从0.0到1.0的百分比值，表示Toast视图相对于其SuperView的最大高度。
默认值为0.8（SuperView高度的80%）。
 */
@property (assign, nonatomic) CGFloat maxHeightPercentage;

/**
 从toast视图的水平边缘到内容的间距。
当图像出现时，这也用作图像和文本之间的填充。
默认是10.0。
 */
@property (assign, nonatomic) CGFloat horizontalPadding;

/**
从Toast视图的垂直边缘到内容的间距。
当出现标题时，它也用作标题和消息之间的填充。
默认值为10.0。
 */
@property (assign, nonatomic) CGFloat verticalPadding;

/**
 圆角半径。默认是10.0。
 */
@property (assign, nonatomic) CGFloat cornerRadius;

/**
标题字体。默认值为`[uifont-boldSystemFontOfSize:16.0]`。
 */
@property (strong, nonatomic) UIFont *titleFont;

/**
消息的字体。默认值是' [UIFont systemFontOfSize:16.0] '。
 */
@property (strong, nonatomic) UIFont *messageFont;

/**
标题文本对齐。默认设置是“NSTextAlignmentLeft”。
 */
@property (assign, nonatomic) NSTextAlignment titleAlignment;

/**
消息文本对齐。默认设置是“NSTextAlignmentLeft”。
 */
@property (assign, nonatomic) NSTextAlignment messageAlignment;

/**
标题的最大行数。默认值为0（无限制）。
 */
@property (assign, nonatomic) NSInteger titleNumberOfLines;

/**
消息的最大行数。默认值是0(没有限制)。
 */
@property (assign, nonatomic) NSInteger messageNumberOfLines;

/**
启用或禁用Toast视图上的阴影。默认值为“否”。
 */
@property (assign, nonatomic) BOOL displayShadow;

/**
阴影颜色。默认值为`[uicolor blackcolor]`。
 */
@property (strong, nonatomic) UIColor *shadowColor;

/**
值从0.0到1.0，表示阴影的不透明度。
默认值为0.8(80%不透明度)。
 */
@property (assign, nonatomic) CGFloat shadowOpacity;

/**
阴影半径。默认是6.0。
 */
@property (assign, nonatomic) CGFloat shadowRadius;

/**
阴影偏移量。默认值是' CGSizeMake(4.0, 4.0) '。
 */
@property (assign, nonatomic) CGSize shadowOffset;

/**
图像的大小。默认值是“CGSizeMake(80.0, 80.0)”。
 */
@property (assign, nonatomic) CGSize imageSize;

/**
调用“makeToastActivity:”时toast活动视图的大小。
默认值是“CGSizeMake(100.0, 100.0)”。
 */
@property (assign, nonatomic) CGSize activitySize;

/**
淡入/淡出动画持续时间。默认是0.2。

 */
@property (assign, nonatomic) NSTimeInterval fadeDuration;

/**
创建一个“CSToastStyle”的新实例，并设置所有默认值。
 */
- (instancetype)initWithDefaultStyle NS_DESIGNATED_INITIALIZER;

/**
 @警告：只应该使用指定的初始化器来创建“CSToastStyle”的实例。
 */
- (instancetype)init NS_UNAVAILABLE;

@end

/**
 “CSToastManager”为所有toast通知提供一般配置选项。由单例实例支持。
 */
@interface CSToastManager : NSObject

/**
 在单例上设置共享样式。使用nil样式调用“makeToast:”方法
(或“toastViewForMessage:title:image:style:”)时，将使用共享样式。
默认情况下，这被设置为' CSToastStyle '的默认样式。
@参数sharedStyle：共享样式
 */
+ (void)setSharedStyle:(CSToastStyle *)sharedStyle;

/**
 从singlton获取共享样式。默认情况下，这是“CSToastStyle”的默认样式。

@ return 共享样式
 */
+ (CSToastStyle *)sharedStyle;

/**
启用或禁用tap在toast视图上消失。默认是“是的”。

@参数 tapToDismissEnabled：是或不是
 */
+ (void)setTapToDismissEnabled:(BOOL)tapToDismissEnabled;

/**
如果启用了tap to dismiss，则返回“YES”，否则返回“NO”。
默认是“是的”。

@return BOOL是或不是
 */
+ (BOOL)isTapToDismissEnabled;

/**
 启用或禁用toast视图的排队行为。当回答“是”时，toast视图将一个接一个
地出现。当“否”时，多个Toast视图将同时出现(根据它们的位置可能重叠)。
这对toast活动视图没有影响，它独立于正常的toast视图运行。默认设置是“不”。

@参数queueEnabled：是或否
 */
+ (void)setQueueEnabled:(BOOL)queueEnabled;

/**
如果启用队列，则返回“YES”，否则返回“NO”。默认设置是“不”。

@return BOOL
 */
+ (BOOL)isQueueEnabled;

/**
 设置默认持续时间。用于不需要显式持续时间的“makeToast:”和“showToast:”方法。默认是3.0。
@参数 duration：toast 显示持续时间
 */
+ (void)setDefaultDuration:(NSTimeInterval)duration;

/**
返回默认持续时间。默认是3.0。

 @return duration The toast duration
*/
+ (NSTimeInterval)defaultDuration;

/**
 设置默认位置。用于不需要明确位置的“makeToast:”和“showToast:”方法。默认设置是“CSToastPositionBottom”。
参数position：可以是预定义的CSToastPosition常量之一，也可以是包装在“NSValue”对象中的“CGPoint”。
 */
+ (void)setDefaultPosition:(id)position;

/**
返回默认toast位置。默认设置是“CSToastPositionBottom”。
@return定位默认中心点。将是预定义的CSToastPosition常量之一，或包装在' NSValue '对象中的' CGPoint '。
 */
+ (id)defaultPosition;

@end
```

``` swift
//
//  UIView+Toast.m
//  Toast
//
//  Copyright (c) 2011-2017 Charles Scalesse.
//


#import "UIView+Toast.h"
#import <QuartzCore/QuartzCore.h>
#import <objc/runtime.h>

// Positions
NSString * CSToastPositionTop                       = @"CSToastPositionTop";
NSString * CSToastPositionCenter                    = @"CSToastPositionCenter";
NSString * CSToastPositionBottom                    = @"CSToastPositionBottom";

// Keys for values associated with toast views
static const NSString * CSToastTimerKey             = @"CSToastTimerKey";
static const NSString * CSToastDurationKey          = @"CSToastDurationKey";
static const NSString * CSToastPositionKey          = @"CSToastPositionKey";
static const NSString * CSToastCompletionKey        = @"CSToastCompletionKey";

// Keys for values associated with self
static const NSString * CSToastActiveKey            = @"CSToastActiveKey";
static const NSString * CSToastActivityViewKey      = @"CSToastActivityViewKey";
static const NSString * CSToastQueueKey             = @"CSToastQueueKey";

@interface UIView (ToastPrivate)

/**
 These private methods are being prefixed with "cs_" to reduce the likelihood of non-obvious
 naming conflicts with other UIView methods.
 
 @discussion Should the public API also use the cs_ prefix? Technically it should, but it
 results in code that is less legible. The current public method names seem unlikely to cause
 conflicts so I think we should favor the cleaner API for now.
 */
- (void)cs_showToast:(UIView *)toast duration:(NSTimeInterval)duration position:(id)position;
- (void)cs_hideToast:(UIView *)toast;
- (void)cs_hideToast:(UIView *)toast fromTap:(BOOL)fromTap;
- (void)cs_toastTimerDidFinish:(NSTimer *)timer;
- (void)cs_handleToastTapped:(UITapGestureRecognizer *)recognizer;
- (CGPoint)cs_centerPointForPosition:(id)position withToast:(UIView *)toast;
- (NSMutableArray *)cs_toastQueue;

@end

@implementation UIView (Toast)

#pragma mark - Make Toast Methods

- (void)makeToast:(NSString *)message {
    [self makeToast:message duration:[CSToastManager defaultDuration] position:[CSToastManager defaultPosition] style:nil];
}

- (void)makeToast:(NSString *)message duration:(NSTimeInterval)duration position:(id)position {
    [self makeToast:message duration:duration position:position style:nil];
}

- (void)makeToast:(NSString *)message duration:(NSTimeInterval)duration position:(id)position style:(CSToastStyle *)style {
    UIView *toast = [self toastViewForMessage:message title:nil image:nil style:style];
    [self showToast:toast duration:duration position:position completion:nil];
}

- (void)makeToast:(NSString *)message duration:(NSTimeInterval)duration position:(id)position title:(NSString *)title image:(UIImage *)image style:(CSToastStyle *)style completion:(void(^)(BOOL didTap))completion {
    UIView *toast = [self toastViewForMessage:message title:title image:image style:style];
    [self showToast:toast duration:duration position:position completion:completion];
}

#pragma mark - Show Toast Methods

- (void)showToast:(UIView *)toast {
    [self showToast:toast duration:[CSToastManager defaultDuration] position:[CSToastManager defaultPosition] completion:nil];
}

- (void)showToast:(UIView *)toast duration:(NSTimeInterval)duration position:(id)position completion:(void(^)(BOOL didTap))completion {
    // sanity
    if (toast == nil) return;
    
    // store the completion block on the toast view
    objc_setAssociatedObject(toast, &CSToastCompletionKey, completion, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    
    if ([CSToastManager isQueueEnabled] && [self.cs_activeToasts count] > 0) {
        // we're about to queue this toast view so we need to store the duration and position as well
        objc_setAssociatedObject(toast, &CSToastDurationKey, @(duration), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        objc_setAssociatedObject(toast, &CSToastPositionKey, position, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        
        // enqueue
        [self.cs_toastQueue addObject:toast];
    } else {
        // present
        [self cs_showToast:toast duration:duration position:position];
    }
}

#pragma mark - Hide Toast Methods

- (void)hideToast {
    [self hideToast:[[self cs_activeToasts] firstObject]];
}

- (void)hideToast:(UIView *)toast {
    // sanity
    if (!toast || ![[self cs_activeToasts] containsObject:toast]) return;
    
    [self cs_hideToast:toast];
}

- (void)hideAllToasts {
    [self hideAllToasts:NO clearQueue:YES];
}

- (void)hideAllToasts:(BOOL)includeActivity clearQueue:(BOOL)clearQueue {
    if (clearQueue) {
        [self clearToastQueue];
    }
    
    for (UIView *toast in [self cs_activeToasts]) {
        [self hideToast:toast];
    }
    
    if (includeActivity) {
        [self hideToastActivity];
    }
}

- (void)clearToastQueue {
    [[self cs_toastQueue] removeAllObjects];
}

#pragma mark - Private Show/Hide Methods

- (void)cs_showToast:(UIView *)toast duration:(NSTimeInterval)duration position:(id)position {
    toast.center = [self cs_centerPointForPosition:position withToast:toast];
    toast.alpha = 0.0;
    
    if ([CSToastManager isTapToDismissEnabled]) {
        UITapGestureRecognizer *recognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(cs_handleToastTapped:)];
        [toast addGestureRecognizer:recognizer];
        toast.userInteractionEnabled = YES;
        toast.exclusiveTouch = YES;
    }
    
    [[self cs_activeToasts] addObject:toast];
    
    [self addSubview:toast];
    
    [UIView animateWithDuration:[[CSToastManager sharedStyle] fadeDuration]
                          delay:0.0
                        options:(UIViewAnimationOptionCurveEaseOut | UIViewAnimationOptionAllowUserInteraction)
                     animations:^{
                         toast.alpha = 1.0;
                     } completion:^(BOOL finished) {
                         NSTimer *timer = [NSTimer timerWithTimeInterval:duration target:self selector:@selector(cs_toastTimerDidFinish:) userInfo:toast repeats:NO];
                         [[NSRunLoop mainRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
                         objc_setAssociatedObject(toast, &CSToastTimerKey, timer, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
                     }];
}

- (void)cs_hideToast:(UIView *)toast {
    [self cs_hideToast:toast fromTap:NO];
}

- (void)cs_hideToast:(UIView *)toast fromTap:(BOOL)fromTap {
    NSTimer *timer = (NSTimer *)objc_getAssociatedObject(toast, &CSToastTimerKey);
    [timer invalidate];
    
    [UIView animateWithDuration:[[CSToastManager sharedStyle] fadeDuration]
                          delay:0.0
                        options:(UIViewAnimationOptionCurveEaseIn | UIViewAnimationOptionBeginFromCurrentState)
                     animations:^{
                         toast.alpha = 0.0;
                     } completion:^(BOOL finished) {
                         [toast removeFromSuperview];
                         
                         // remove
                         [[self cs_activeToasts] removeObject:toast];
                         
                         // execute the completion block, if necessary
                         void (^completion)(BOOL didTap) = objc_getAssociatedObject(toast, &CSToastCompletionKey);
                         if (completion) {
                             completion(fromTap);
                         }
                         
                         if ([self.cs_toastQueue count] > 0) {
                             // dequeue
                             UIView *nextToast = [[self cs_toastQueue] firstObject];
                             [[self cs_toastQueue] removeObjectAtIndex:0];
                             
                             // present the next toast
                             NSTimeInterval duration = [objc_getAssociatedObject(nextToast, &CSToastDurationKey) doubleValue];
                             id position = objc_getAssociatedObject(nextToast, &CSToastPositionKey);
                             [self cs_showToast:nextToast duration:duration position:position];
                         }
                     }];
}

#pragma mark - View Construction

- (UIView *)toastViewForMessage:(NSString *)message title:(NSString *)title image:(UIImage *)image style:(CSToastStyle *)style {
    // sanity
    if (message == nil && title == nil && image == nil) return nil;
    
    // default to the shared style
    if (style == nil) {
        style = [CSToastManager sharedStyle];
    }
    
    // dynamically build a toast view with any combination of message, title, & image
    UILabel *messageLabel = nil;
    UILabel *titleLabel = nil;
    UIImageView *imageView = nil;
    
    UIView *wrapperView = [[UIView alloc] init];
    wrapperView.autoresizingMask = (UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin);
    wrapperView.layer.cornerRadius = style.cornerRadius;
    
    if (style.displayShadow) {
        wrapperView.layer.shadowColor = style.shadowColor.CGColor;
        wrapperView.layer.shadowOpacity = style.shadowOpacity;
        wrapperView.layer.shadowRadius = style.shadowRadius;
        wrapperView.layer.shadowOffset = style.shadowOffset;
    }
    
    wrapperView.backgroundColor = style.backgroundColor;
    
    if(image != nil) {
        imageView = [[UIImageView alloc] initWithImage:image];
        imageView.contentMode = UIViewContentModeScaleAspectFit;
        imageView.frame = CGRectMake(style.horizontalPadding, style.verticalPadding, style.imageSize.width, style.imageSize.height);
    }
    
    CGRect imageRect = CGRectZero;
    
    if(imageView != nil) {
        imageRect.origin.x = style.horizontalPadding;
        imageRect.origin.y = style.verticalPadding;
        imageRect.size.width = imageView.bounds.size.width;
        imageRect.size.height = imageView.bounds.size.height;
    }
    
    if (title != nil) {
        titleLabel = [[UILabel alloc] init];
        titleLabel.numberOfLines = style.titleNumberOfLines;
        titleLabel.font = style.titleFont;
        titleLabel.textAlignment = style.titleAlignment;
        titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        titleLabel.textColor = style.titleColor;
        titleLabel.backgroundColor = [UIColor clearColor];
        titleLabel.alpha = 1.0;
        titleLabel.text = title;
        
        // size the title label according to the length of the text
        CGSize maxSizeTitle = CGSizeMake((self.bounds.size.width * style.maxWidthPercentage) - imageRect.size.width, self.bounds.size.height * style.maxHeightPercentage);
        CGSize expectedSizeTitle = [titleLabel sizeThatFits:maxSizeTitle];
        // UILabel can return a size larger than the max size when the number of lines is 1
        expectedSizeTitle = CGSizeMake(MIN(maxSizeTitle.width, expectedSizeTitle.width), MIN(maxSizeTitle.height, expectedSizeTitle.height));
        titleLabel.frame = CGRectMake(0.0, 0.0, expectedSizeTitle.width, expectedSizeTitle.height);
    }
    
    if (message != nil) {
        messageLabel = [[UILabel alloc] init];
        messageLabel.numberOfLines = style.messageNumberOfLines;
        messageLabel.font = style.messageFont;
        messageLabel.textAlignment = style.messageAlignment;
        messageLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        messageLabel.textColor = style.messageColor;
        messageLabel.backgroundColor = [UIColor clearColor];
        messageLabel.alpha = 1.0;
        messageLabel.text = message;
        
        CGSize maxSizeMessage = CGSizeMake((self.bounds.size.width * style.maxWidthPercentage) - imageRect.size.width, self.bounds.size.height * style.maxHeightPercentage);
        CGSize expectedSizeMessage = [messageLabel sizeThatFits:maxSizeMessage];
        // UILabel can return a size larger than the max size when the number of lines is 1
        expectedSizeMessage = CGSizeMake(MIN(maxSizeMessage.width, expectedSizeMessage.width), MIN(maxSizeMessage.height, expectedSizeMessage.height));
        messageLabel.frame = CGRectMake(0.0, 0.0, expectedSizeMessage.width, expectedSizeMessage.height);
    }
    
    CGRect titleRect = CGRectZero;
    
    if(titleLabel != nil) {
        titleRect.origin.x = imageRect.origin.x + imageRect.size.width + style.horizontalPadding;
        titleRect.origin.y = style.verticalPadding;
        titleRect.size.width = titleLabel.bounds.size.width;
        titleRect.size.height = titleLabel.bounds.size.height;
    }
    
    CGRect messageRect = CGRectZero;
    
    if(messageLabel != nil) {
        messageRect.origin.x = imageRect.origin.x + imageRect.size.width + style.horizontalPadding;
        messageRect.origin.y = titleRect.origin.y + titleRect.size.height + style.verticalPadding;
        messageRect.size.width = messageLabel.bounds.size.width;
        messageRect.size.height = messageLabel.bounds.size.height;
    }
    
    CGFloat longerWidth = MAX(titleRect.size.width, messageRect.size.width);
    CGFloat longerX = MAX(titleRect.origin.x, messageRect.origin.x);
    
    // Wrapper width uses the longerWidth or the image width, whatever is larger. Same logic applies to the wrapper height.
    CGFloat wrapperWidth = MAX((imageRect.size.width + (style.horizontalPadding * 2.0)), (longerX + longerWidth + style.horizontalPadding));
    CGFloat wrapperHeight = MAX((messageRect.origin.y + messageRect.size.height + style.verticalPadding), (imageRect.size.height + (style.verticalPadding * 2.0)));
    
    wrapperView.frame = CGRectMake(0.0, 0.0, wrapperWidth, wrapperHeight);
    
    if(titleLabel != nil) {
        titleLabel.frame = titleRect;
        [wrapperView addSubview:titleLabel];
    }
    
    if(messageLabel != nil) {
        messageLabel.frame = messageRect;
        [wrapperView addSubview:messageLabel];
    }
    
    if(imageView != nil) {
        [wrapperView addSubview:imageView];
    }
    
    return wrapperView;
}

#pragma mark - Storage

- (NSMutableArray *)cs_activeToasts {
    NSMutableArray *cs_activeToasts = objc_getAssociatedObject(self, &CSToastActiveKey);
    if (cs_activeToasts == nil) {
        cs_activeToasts = [[NSMutableArray alloc] init];
        objc_setAssociatedObject(self, &CSToastActiveKey, cs_activeToasts, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return cs_activeToasts;
}

- (NSMutableArray *)cs_toastQueue {
    NSMutableArray *cs_toastQueue = objc_getAssociatedObject(self, &CSToastQueueKey);
    if (cs_toastQueue == nil) {
        cs_toastQueue = [[NSMutableArray alloc] init];
        objc_setAssociatedObject(self, &CSToastQueueKey, cs_toastQueue, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return cs_toastQueue;
}

#pragma mark - Events

- (void)cs_toastTimerDidFinish:(NSTimer *)timer {
    [self cs_hideToast:(UIView *)timer.userInfo];
}

- (void)cs_handleToastTapped:(UITapGestureRecognizer *)recognizer {
    UIView *toast = recognizer.view;
    NSTimer *timer = (NSTimer *)objc_getAssociatedObject(toast, &CSToastTimerKey);
    [timer invalidate];
    
    [self cs_hideToast:toast fromTap:YES];
}

#pragma mark - Activity Methods

- (void)makeToastActivity:(id)position {
    // sanity
    UIView *existingActivityView = (UIView *)objc_getAssociatedObject(self, &CSToastActivityViewKey);
    if (existingActivityView != nil) return;
    
    CSToastStyle *style = [CSToastManager sharedStyle];
    
    UIView *activityView = [[UIView alloc] initWithFrame:CGRectMake(0.0, 0.0, style.activitySize.width, style.activitySize.height)];
    activityView.center = [self cs_centerPointForPosition:position withToast:activityView];
    activityView.backgroundColor = style.backgroundColor;
    activityView.alpha = 0.0;
    activityView.autoresizingMask = (UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin);
    activityView.layer.cornerRadius = style.cornerRadius;
    
    if (style.displayShadow) {
        activityView.layer.shadowColor = style.shadowColor.CGColor;
        activityView.layer.shadowOpacity = style.shadowOpacity;
        activityView.layer.shadowRadius = style.shadowRadius;
        activityView.layer.shadowOffset = style.shadowOffset;
    }
    
    UIActivityIndicatorView *activityIndicatorView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    activityIndicatorView.center = CGPointMake(activityView.bounds.size.width / 2, activityView.bounds.size.height / 2);
    [activityView addSubview:activityIndicatorView];
    [activityIndicatorView startAnimating];
    
    // associate the activity view with self
    objc_setAssociatedObject (self, &CSToastActivityViewKey, activityView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    
    [self addSubview:activityView];
    
    [UIView animateWithDuration:style.fadeDuration
                          delay:0.0
                        options:UIViewAnimationOptionCurveEaseOut
                     animations:^{
                         activityView.alpha = 1.0;
                     } completion:nil];
}

- (void)hideToastActivity {
    UIView *existingActivityView = (UIView *)objc_getAssociatedObject(self, &CSToastActivityViewKey);
    if (existingActivityView != nil) {
        [UIView animateWithDuration:[[CSToastManager sharedStyle] fadeDuration]
                              delay:0.0
                            options:(UIViewAnimationOptionCurveEaseIn | UIViewAnimationOptionBeginFromCurrentState)
                         animations:^{
                             existingActivityView.alpha = 0.0;
                         } completion:^(BOOL finished) {
                             [existingActivityView removeFromSuperview];
                             objc_setAssociatedObject (self, &CSToastActivityViewKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
                         }];
    }
}

#pragma mark - Helpers

- (CGPoint)cs_centerPointForPosition:(id)point withToast:(UIView *)toast {
    CSToastStyle *style = [CSToastManager sharedStyle];
    
    UIEdgeInsets safeInsets = UIEdgeInsetsZero;
    if (@available(iOS 11.0, *)) {
        safeInsets = self.safeAreaInsets;
    }
    
    CGFloat topPadding = style.verticalPadding + safeInsets.top;
    CGFloat bottomPadding = style.verticalPadding + safeInsets.bottom;
    
    if([point isKindOfClass:[NSString class]]) {
        if([point caseInsensitiveCompare:CSToastPositionTop] == NSOrderedSame) {
            return CGPointMake(self.bounds.size.width / 2.0, (toast.frame.size.height / 2.0) + topPadding);
        } else if([point caseInsensitiveCompare:CSToastPositionCenter] == NSOrderedSame) {
            return CGPointMake(self.bounds.size.width / 2.0, self.bounds.size.height / 2.0);
        }
    } else if ([point isKindOfClass:[NSValue class]]) {
        return [point CGPointValue];
    }
    
    // default to bottom
    return CGPointMake(self.bounds.size.width / 2.0, (self.bounds.size.height - (toast.frame.size.height / 2.0)) - bottomPadding);
}

@end

@implementation CSToastStyle

#pragma mark - Constructors

- (instancetype)initWithDefaultStyle {
    self = [super init];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.8];
        self.titleColor = [UIColor whiteColor];
        self.messageColor = [UIColor whiteColor];
        self.maxWidthPercentage = 0.8;
        self.maxHeightPercentage = 0.8;
        self.horizontalPadding = 10.0;
        self.verticalPadding = 10.0;
        self.cornerRadius = 10.0;
        self.titleFont = [UIFont boldSystemFontOfSize:16.0];
        self.messageFont = [UIFont systemFontOfSize:16.0];
        self.titleAlignment = NSTextAlignmentLeft;
        self.messageAlignment = NSTextAlignmentLeft;
        self.titleNumberOfLines = 0;
        self.messageNumberOfLines = 0;
        self.displayShadow = NO;
        self.shadowOpacity = 0.8;
        self.shadowRadius = 6.0;
        self.shadowOffset = CGSizeMake(4.0, 4.0);
        self.imageSize = CGSizeMake(80.0, 80.0);
        self.activitySize = CGSizeMake(100.0, 100.0);
        self.fadeDuration = 0.2;
    }
    return self;
}

- (void)setMaxWidthPercentage:(CGFloat)maxWidthPercentage {
    _maxWidthPercentage = MAX(MIN(maxWidthPercentage, 1.0), 0.0);
}

- (void)setMaxHeightPercentage:(CGFloat)maxHeightPercentage {
    _maxHeightPercentage = MAX(MIN(maxHeightPercentage, 1.0), 0.0);
}

- (instancetype)init NS_UNAVAILABLE {
    return nil;
}

@end

@interface CSToastManager ()

@property (strong, nonatomic) CSToastStyle *sharedStyle;
@property (assign, nonatomic, getter=isTapToDismissEnabled) BOOL tapToDismissEnabled;
@property (assign, nonatomic, getter=isQueueEnabled) BOOL queueEnabled;
@property (assign, nonatomic) NSTimeInterval defaultDuration;
@property (strong, nonatomic) id defaultPosition;

@end

@implementation CSToastManager

#pragma mark - Constructors

+ (instancetype)sharedManager {
    static CSToastManager *_sharedManager = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        _sharedManager = [[self alloc] init];
    });
    
    return _sharedManager;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        self.sharedStyle = [[CSToastStyle alloc] initWithDefaultStyle];
        self.tapToDismissEnabled = YES;
        self.queueEnabled = NO;
        self.defaultDuration = 3.0;
        self.defaultPosition = CSToastPositionBottom;
    }
    return self;
}

#pragma mark - Singleton Methods

+ (void)setSharedStyle:(CSToastStyle *)sharedStyle {
    [[self sharedManager] setSharedStyle:sharedStyle];
}

+ (CSToastStyle *)sharedStyle {
    return [[self sharedManager] sharedStyle];
}

+ (void)setTapToDismissEnabled:(BOOL)tapToDismissEnabled {
    [[self sharedManager] setTapToDismissEnabled:tapToDismissEnabled];
}

+ (BOOL)isTapToDismissEnabled {
    return [[self sharedManager] isTapToDismissEnabled];
}

+ (void)setQueueEnabled:(BOOL)queueEnabled {
    [[self sharedManager] setQueueEnabled:queueEnabled];
}

+ (BOOL)isQueueEnabled {
    return [[self sharedManager] isQueueEnabled];
}

+ (void)setDefaultDuration:(NSTimeInterval)duration {
    [[self sharedManager] setDefaultDuration:duration];
}

+ (NSTimeInterval)defaultDuration {
    return [[self sharedManager] defaultDuration];
}

+ (void)setDefaultPosition:(id)position {
    if ([position isKindOfClass:[NSString class]] || [position isKindOfClass:[NSValue class]]) {
        [[self sharedManager] setDefaultPosition:position];
    }
}

+ (id)defaultPosition {
    return [[self sharedManager] defaultPosition];
}

@end
```

## Toast 应用

### 1、默认样式

``` swift
//  ViewController.m

#import "ViewController.h"
#import "Masonry.h"
#import "Toast.h"

@interface ViewController ()

@property(nonatomic, strong)UIView *redView;
@property(nonatomic, strong)UIView *greenView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    [button setTitle:@"显示Toast" forState:UIControlStateNormal];
    [button setBackgroundColor:[UIColor blueColor]];
    [button setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [button addTarget:self action:@selector(buttonClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:button];
    [button mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.equalTo(self.view);
        make.left.right.equalTo(self.view);
    }];
    
}

- (void)buttonClick{
    // 默认显示时间和位置
    [self.view makeToast:@"toast出现了"];
    // 自定义显示时间和位置
    [self.view makeToast:@"Toast出现了" duration:3 position:CSToastPositionCenter];
}

@end
```

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/338-20250903164222059)

### 2、自定义样式

自定义一个以下样式的 Toast:

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/180)

``` swift
//
//  ToastView.h
//  FrameworksTest
//

#import <UIKit/UIKit.h>


@interface ToastView : UIView

- (instancetype)initWithFrame:(CGRect)frame andImage:(UIImage *)image andMessage:(NSString *)meaage andTitle:(NSString *)tilte;

@end
```

``` swift
//
//  ToastView.m
//  FrameworksTest


#import "ToastView.h"
#import "Masonry.h"

@interface ToastView()

@property (nonatomic, strong)UILabel *titleLabel;
@property (nonatomic, strong)UILabel *messageLabel;
@property (nonatomic, strong)UIImageView *toastImageView;

@end

@implementation ToastView

- (instancetype)initWithFrame:(CGRect)frame andImage:(UIImage *)image andMessage:(NSString *)meaage andTitle:(NSString *)tilte{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor greenColor];
        [self drawViewAndImage:image andMessage:meaage andTitle:tilte];
    }
    return self;
}

- (void)drawViewAndImage:(UIImage *)image andMessage:(NSString *)meaage andTitle:(NSString *)tilte{
    
    self.toastImageView = [[UIImageView alloc]initWithFrame:CGRectZero];
    [self.toastImageView setImage:image];
    [self addSubview:self.toastImageView];
    
    self.titleLabel = [[UILabel alloc]initWithFrame:CGRectZero];
    self.titleLabel.text = tilte;
    self.titleLabel.font = [UIFont boldSystemFontOfSize:15];
    self.titleLabel.textAlignment = NSTextAlignmentCenter;
    self.titleLabel.numberOfLines = 0;
    self.titleLabel.textColor = [UIColor redColor];
    [self addSubview:self.titleLabel];
    
    self.messageLabel = [[UILabel alloc]initWithFrame:CGRectZero];
    self.messageLabel.text = meaage;
    self.messageLabel.font = [UIFont boldSystemFontOfSize:15];
    self.messageLabel.textAlignment = NSTextAlignmentCenter;
    self.messageLabel.numberOfLines = 0;
    self.messageLabel.textColor = [UIColor redColor];
    [self addSubview:self.messageLabel];
    
    [self setUpdateConstraints];

}

- (void)setUpdateConstraints{
    
    [self.toastImageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.equalTo(self);
        make.size.mas_equalTo(CGSizeMake(80, 80));
    }];
    
    [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.toastImageView.mas_bottom).offset(10);
        make.left.equalTo(self).offset(10);
        make.right.equalTo(self).offset(-10);
    }];
    
    [self.messageLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.titleLabel.mas_bottom).offset(10);
        make.left.equalTo(self).offset(10);
        make.right.equalTo(self).offset(-10);
    }];
    
}
@end
```

``` swift
- (void)buttonClick{
    ToastView *tv = [[ToastView alloc]initWithFrame:CGRectZero andImage:[UIImage imageNamed:@"Toast"] andMessage:@"Toastchu出现了" andTitle:@"我是Toasta啊"];
    [self.view addSubview:tv];
    [tv mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.equalTo(self.view);
        make.size.mas_equalTo(CGSizeMake(200, 250));
    }];
    [self.view showToast:tv duration:6.0 position:CSToastPositionCenter completion:^(BOOL didTap) {
        NSLog(@"显示成功");
    }];
}
```

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/338-20250903164644369)

### 3、队列排队显示的 Toast

``` swift
#import "ViewController.h"
#import "Masonry.h"
#import "Toast.h"
#import "ToastView.h"

@interface ViewController ()

@property(nonatomic, strong)UIView *redView;
@property(nonatomic, strong)UIView *greenView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    [button setTitle:@"显示Toast" forState:UIControlStateNormal];
    [button setBackgroundColor:[UIColor blueColor]];
    [button setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [button addTarget:self action:@selector(buttonClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:button];
    [button mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.equalTo(self.view);
        make.left.equalTo(self.view);
        make.width.mas_equalTo(self.view.frame.size.width / 2);
    }];
    
    UIButton *cancelButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [cancelButton setTitle:@"隐藏Toast" forState:UIControlStateNormal];
    [cancelButton setBackgroundColor:[UIColor redColor]];
    [cancelButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [cancelButton addTarget:self action:@selector(cancelButtonClick) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:cancelButton];
    [cancelButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.equalTo(self.view);
        make.left.equalTo(button.mas_right);
        make.width.mas_equalTo(self.view.frame.size.width / 2);
    }];
    
}

- (void)buttonClick{
    
    [CSToastManager setQueueEnabled:YES];
    
    [self.view makeToast:@"我是Toast 1" duration:2.0
        position:CSToastPositionTop];
    
    [self.view makeToast:@"我是Toast 2" duration:2.0
        position:CSToastPositionCenter];
    
    [self.view makeToast:@"我是Toast 3" duration:2.0
        position:CSToastPositionBottom];
    
}

- (void)cancelButtonClick{
    [self.view hideToast];
}
@end
```

![](https://cdn.jsdelivr.net/gh/fengyanxin/YXBlogPic/img/338-20250903164842341)

## 参考资料

>1、[Objective-C 的 Toast 提示的学习笔记](https://www.jianshu.com/p/c415bd156896?ivk_sa=1024320u)