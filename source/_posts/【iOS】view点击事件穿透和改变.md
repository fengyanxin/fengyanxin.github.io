---
title: 【iOS】view点击事件穿透
date: 2025-03-28 14:59:01
tags:
- OC
- iOS
categories:
- iOS
---

## 事件传递

当触摸一个视图时，首先系统会捕捉此事件，并为此事件创建一个 UIEvent 对象，将此对象加入当前应用程序的事件队列中，然后由 UIApplication 对象从队列中，一个一个取出来进行分发，首先分发给 UIWindow 对象，然后由 UIWindow 对象分发给触摸的视图对象，也就是第一响应者对象。

<!-- more -->

## 响应者链

事件被交由第一响应者对象处理，如果第一响应者不处理，事件被沿着响应者链向上传递，交给下一个响应者（next responder）。一般来说，第一响应者是个视图对象或者其子类对象，当其被触摸后事件被交由它处理，如果它不处理，事件就会被传递给它的视图控制器对象（如果存在），然后是它的父视图（superView）对象（如果存在），以此类推，直到顶层视图。接下来会沿着顶层视图（top view）到窗口（UIWindow对象）再到程序（UIApplication对象）。如果整个过程都没有响应这个事件，该事件就被丢弃。一般情况下，在响应者链中只要对象处理这个事件，事件就停止传递。但是有时候可以在视图的相应方法中根据一些条件判断来决定是否需要继续传递事件。

## 简单理解

用户点击屏幕后的事件传递，UIApplication 先响应事件，然后传递给 UIWindow。如果 window 可以响应。就开始遍历 window 的 subviews。遍历的过程中，如果第一个遍历的 view1 可以响应，那就遍历这个 view1 的 subviews（依次这样不停地查找，直至查找到合适的响应事件 view ）。如果 view1 不可以响应，那就开始对 view2 进行判断和子视图的遍历。依次类推 view3，view4……

如果最后没有找到合适的响应 view，这个消息就会被抛弃。（整个遍历的过程就是树的先序遍历）。

## 简单使用

1. 视图覆盖的情况 想要透过上层视图的响应事件 响应下面的事件

``` swift
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
    UIView *hitView = [super hitTest:point withEvent:event];
    
    if (hitView == 上层视图view) {
        return 想要响应的下层视图view;
    }
    return hitView;
}
```

2. 视图覆盖 但是不想要响应上层视图 view 事件

``` swift
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
    UIView *hitView = [super hitTest:point withEvent:event];

    if (hitView == 不想要响应视图的view) {
        return nil; // 此处返回空即不相应任何事件
    }
    return hitView;
}
```

3. 让超出父视图范围的子视图响应事件

``` swift
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
    UIView *view = [super hitTest:point withEvent:event];
    
    if (view == nil) {
        for (UIView *subView in self.subviews) {
            CGPoint tp = [subView convertPoint:point fromView:self];
            if (CGRectContainsPoint(subView.bounds, tp)) {
                view = subView;
            }
        }
    }
    return view;
}
```

