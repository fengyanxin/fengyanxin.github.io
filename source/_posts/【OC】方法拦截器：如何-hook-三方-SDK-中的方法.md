---
title: 【OC】方法拦截器：如何 hook 三方 SDK 中的方法?
date: 2023-10-13 16:43:33
tags:
- OC
- iOS
categories:
- iOS
---

## 一、前因

缘由：项目中使用 `Pod` 集成了一个三方的远端SDK，这个SDK中的某个类遵循了一个代理协议，这个代理中有很多方法实现。现在的需求是，我在使用这个SDK的类时，只想实现代理方法中的其中一个方法，而不想把所有方法都实现一遍，而且也没办法全部实现。但是，我如果在引用类中遵循代理，就得把所有方法都实现一遍，这显然不现实；如果只实现固定方法，其他方法就会失效，这也不行。

<!-- more -->

所以，我就有了一个思路：**不遵循代理，只是对需要实现的方法进行监听，在其执行时，不执行原有方法流程，转而执行自定义方法。**

这个思路显然是可行的，接下来就是如何把这个方法 `hook` 出来的问题。

## 二、后果

有了思路，剩下的就是验证思路和解决问题，经过一段时间的思考和查阅资料，就有了如下结果和方案：

### 1、初版：对三方源码有入侵

这个方案，对三方源码有一定的入侵，但是因为入侵较小，所以决定尝试一下。

创建一个 `NSObject`的 `Category`，为什么会选择 `NSObject`，因为他是所有对象类的基类，注册监听方法时更为方便和通用。

#### NSObject+SRModuleAuthorization.h

在 `NSObject+SRModuleAuthorization.h` 实现代码如下:

``` Swift
@interface NSObject (SRModuleAuthorization)

- (void)registerNeedMonitorSEL:(SEL)sel;

@end
```

`.h` 只对外暴露一个注册需要被监听方法的API。

#### NSObject+SRModuleAuthorization.m

在`NSObject+SRModuleAuthorization.m` 实现代码如下:

``` Swift
// 注册需要被拦截的方法
- (void)registerNeedMonitorSEL:(SEL)sel{
    // 获取方法的名称，根据该方法名称设置自定义的方法名称
    NSString *methodName = NSStringFromSelector(sel);
    NSString *newMethodName = [NSString stringWithFormat:@"sr_auth_%@", methodName];
    // 获取自定义方法的实例
    SEL newSel = NSSelectorFromString(newMethodName);
    Method newMethod = class_getInstanceMethod([self class], newSel);
    // 判断是否已经添加了自定义的方法，如果为空就添加自定义方法
    if (!newMethod){
        // 获取被拦截方法的结构体对象
        Method method = class_getInstanceMethod(self.class, sel);
        // 获取被拦截方法的方法签名字符串
        const char *functionType  = method_getTypeEncoding(method);
        NSString *functionTypeStr = [NSString stringWithUTF8String:functionType];
        // 判断方法签名的字符串中，：8是否是最后两个字符
        // 如果是则代表无参方法，否则是有参方法
        // 针对这两种方法添加不同的自定义拦截方法
        NSRange range = [functionTypeStr rangeOfString:@":8"];
        Method intercetionMethod;
        if (range.location + range.length < functionTypeStr.length){
            // 有参拦截方法
            intercetionMethod = class_getInstanceMethod(self.class, @selector(intercetion::));
        }else{
            // 无参拦截方法
            intercetionMethod = class_getInstanceMethod(self.class, @selector(intercetion));
        }
        // 获取自定义拦截方法的实例，
        // 并将自定义方法的selector与实例关联，动态的添加进当前类型
        IMP imp = method_getImplementation(intercetionMethod);
        class_addMethod([self class], newSel, imp, functionType);
        // 最后重新获取自定义方法的方法结构体
        // 并与被监听方法进行实例交换，交换后，
        // 被监听的方法被调用时，就会执行我们自定义的方法实例，即intercetion
        Method method2 = class_getInstanceMethod(self.class, newSel);
        method_exchangeImplementations(method, method2);
    }
}
```

下面是无参拦截方法的实现：

``` Swift
// 无参拦截方法
- (void)intercetion{
    NSString *methodName = NSStringFromSelector(_cmd);
//    NSString *newMethodName = [NSString stringWithFormat:@"dl_auth_%@", methodName];
    NSString *newMethodName = [NSString stringWithFormat:@"%@", methodName];
    SEL newSel = NSSelectorFromString(newMethodName);
    NSMethodSignature *signature = [[self class] instanceMethodSignatureForSelector:newSel];
    if (signature){
        NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:signature];
        invocation.target   = self;
        invocation.selector = newSel;
        // 是否执行原方法
//        [invocation invoke];
    }
    // 执行自定义代码
}
```

有参拦截方法是一个可变参数列表，我们可以遍历 `invocation` 对象的参数，以达到传参的目的。

``` Swift
//有参拦截方法
- (void)intercetion: (id)param1 :(id)param2,...{
    NSString *methodName = NSStringFromSelector(_cmd);
//    NSString *newMethodName = [NSString stringWithFormat:@"dl_auth_%@", methodName];
    NSString *newMethodName = [NSString stringWithFormat:@"%@", methodName];
    SEL newSel = NSSelectorFromString(newMethodName);
    NSMethodSignature *signature = [[self class] instanceMethodSignatureForSelector:newSel];
    NSMutableArray *params = [NSMutableArray array];
    if (signature){
        NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:signature];
        invocation.target   = self;
        invocation.selector = newSel;
        // 参数个数signature.numberOfArguments 默认有一个_cmd 一个target 所以要-2, 正常参数从第三个开始
        if (signature.numberOfArguments) {
            NSInteger argCount = signature.numberOfArguments;
            va_list args;
            if (argCount > 2){
                [params addObject:param1];
            }
            if (argCount > 3){
                [params addObject:param2];
            }
            va_start(args, param2);
            for (int i = 4; i < argCount; i++) {
                param2 = va_arg(args, id);
                [params addObject:param2];
            }
            va_end(args);
            
            if (params.count != argCount-2){
               NSLog(@"proxy --- 传参有误! please check it! ---");
               return;
            }
        }
        
        // 是否执行原方法
//        [invocation invoke];
        
        // 执行自定义代码
       
    }
}
```

这里有一个问题：因为参数遍历转化时， `va_arg(args, id)` 方法会把传递过来的参数转化成 `id` 类型，如果的不 `NSObject` 类型的参数无法完成转化。所以，如果被监听的方法的参数类型不是对象类型，会发生错误。

实现起来很简单，只需要在被监听的类的初始化方法里，调用 `registerNeedMonitorSEL` 方法即可，如下:

``` Swift
// 无参
[self registerNeedMonitorSEL:@selector(test)];
// 有参
[self registerNeedMonitorSEL:@selector(test:)];
// 多参
[self registerNeedMonitorSEL:@selector(test:test1:)];
```

分析：这个方法虽然解决了我的问题，但是缺点也是很明显的:

问题1: 对参数类型不是`NSObject`的方法无法监听，可能发生崩溃的情况。

问题2: 如何是监听三方SDK的方法，会对其造成代码入侵，SDK更新方法会失效。

### 2、进阶版：对三方源码无入侵

初版的方案显然不尽如人意，所以，针对以上问题，我又开始了新一轮的思考。

如何在不入侵三方源码的情况下，对方法进行 `hook` 呢？

结果就有了下面的方案：

实现思路：对需要的监听方法的类做一个category扩展，利用 `Method Swizzling` 对监听的方法进行转换，然后把它 `hook` 出来。

下面说一下我的代码实现：

首先，对监听方法的类做一个 `category` 扩展。

``` Swift
@interface TUIBaseChatViewController (PHHookMethod)

@end
```

然后，在category的 `.m` 文件里实现如下代码：

``` Swift
+ (void)load{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        // 假如要监听方法,则把下面这行代码打开
        __gbh_tracer_swizzleMethod([self class], @selector(messageController:onSelectMessageAvatar:), @selector(__gbh_tracer_messageController:onSelectMessageAvatar:));
    });
}
```

这段代码很好理解，就是在程序启动时就注册方法监听，等到方法执行时，对其进行转换，转换方法看下面：

``` Swift
void __gbh_tracer_swizzleMethod(Class class, SEL originalSelector, SEL swizzledSelector){
    Method originalMethod = class_getInstanceMethod(class, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
    
    BOOL didAddMethod =
    class_addMethod(class,
                    originalSelector,
                    method_getImplementation(swizzledMethod),
                    method_getTypeEncoding(swizzledMethod));
    
    if (didAddMethod) {
        class_replaceMethod(class,
                            swizzledSelector,
                            method_getImplementation(originalMethod),
                            method_getTypeEncoding(originalMethod));
    } else {
        method_exchangeImplementations(originalMethod, swizzledMethod);
    }
}
```

这是一个标准的 `swizzling` 写法，当然了  `github` 上面也有关于 `swizzling` 的开源库，用起来也顺手，这里就不多说了。

然后就是 `swizzling` 转换到的方法：

``` Swift
- (void)__gbh_tracer_messageController:(TUIBaseMessageController *)controller onSelectMessageAvatar:(TUIMessageCell *)cell{
//    [self __gbh_tracer_messageController:controller onSelectMessageAvatar:cell]; //由于方法已经被交换,这里调用的实际上是messageController:onSelectMessageAvatar:方法
    
    // 执行自定义方法
    [self clickMessageAvatar:cell];
}
```

转换后的方法我们既可以让其继续执行以前的方法流程，也可以执行自己定义的方法，简直不要太爽。

这就是一整个 `hook` 流程，即简单又方便，以后，我只需要往工程里面添加这个 `Category` ，这个被监听的方法就会被 `hook` 出来，可以让我为所欲为，还不会出现之前的报错和源码入侵的问题。

## 三、参考资料

>膜拜大神！
>https://www.jianshu.com/p/57827c100a3f
>https://www.cnblogs.com/n1ckyxu/p/6186850.html
>https://www.jianshu.com/p/99d06ad0fa51
>https://blog.csdn.net/u014600626/article/details/119271920
>http://yulingtianxia.com/blog/2017/04/17/Objective-C-Method-Swizzling/#more



