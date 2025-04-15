---
title: 【iOS】如何访问私有库中的图片、Xib资源
date: 2025-04-15 13:27:35
tags:
- OC
- iOS
categories:
- iOS
---

我们制作私有库时，若要在私有库中使用图片，需要在podSpec文件中指定图片来源。

``` swift
s.resource_bundles = {
    'KDIBaseUI' => ['KDIBaseUI/Assets/*']
}
```

这样，图片会放在一个`资源bundle`中。

对于私有库工程来说，直接通过 `[UIImage imageNamed:@"xxx"]` 的形式访问即可。比较麻烦的是，从其他工程访问私有库图片的情况。

<!-- more -->

### 从其他工程访问私有库图片

其他工程使用私有库时，私有库的 `资源bundle` 在 `mainBundle` 的目录下。我们想要访问图片，第一步是找到这个 `资源bundle`，然后才能找到图片。

``` swift
+ (UIImage *)imageNamed:(NSString *)imageName bundleNamed:(NSString *)bundleNamed {
    UIImage *image = nil;
    //根据bundleNamed寻找指定bundle
    NSURL *bundleURL = [[NSBundle mainBundle] URLForResource:bundleNamed withExtension:@"bundle"];
    if (bundleURL) {
        NSBundle *bundle = [NSBundle bundleWithURL:bundleURL];
        NSInteger scale = [[UIScreen mainScreen] scale];
        NSString *scaleName = [NSString stringWithFormat:@"%@@%zdx.png", imageName, scale];
        
        //加载图片
        image = [UIImage imageWithContentsOfFile:[bundle pathForResource:scaleName ofType:nil]];
        
        //如果没有对应scale的图，则尝试使用2x图
        if (image == nil) {
            scaleName = [NSString stringWithFormat:@"%@@2x.png", imageName];
        }
        
        image = [UIImage imageWithContentsOfFile:[bundle pathForResource:scaleName ofType:nil]];
    }
    return image;
}
```

### 从其他工程使用私有库 Xib 文件

`Xib`文件其实也是一种资源，所以需要将 `Xib` 文件放到 **图片资源** 所在的文件夹内。

我们平时注册 `tableViewCell` 的 `Xib` 时，一般是这样的操作：

``` swift
[self.tableView registerNib:[UINib nibWithNibName:@"KDOHNormalTableViewCell" bundle:nil] forCellReuseIdentifier:@"KDOHNormalTableViewCell"];
```

如果这个 `Xib` 是来自于私有库的，那么在加载这个 `cell` 时，肯定会报找不到资源的错误：

``` swift
Terminating app due to uncaught exception 'NSInternalInconsistencyException', reason: 'Could not load NIB in bundle: 'KDOHLanguageBundle </private/var/containers/Bundle/Application/B5FBD4F0-A97A-4576-A763-AF466BB67BB4/XXX.app> (loaded)' with name 'KDOHNormalTableViewCell''
```

原因在于：默认情况下，是从 `mainBundle中` 寻找这个 `Xib` 的，但实际上这个 `Xib` 位于私有库的资源 `bundle` 中。所以我们注册 `cell`时，需要指定查找的 `bundle`：

``` swift
NSBundle *bundle = [NSBundle subBundleWithBundleName:@"KDIBaseUI" targetClass:[self class]];
[self.tableView registerNib:[UINib nibWithNibName:@"KDOHNormalTableViewCell" bundle:bundle] forCellReuseIdentifier:@"KDOHNormalTableViewCell"];
```

查找 `bundle` 细节代码如下：

``` swift
/// 从指定类所在的bundle里，获取某个子bundle
/// @param bundleName 子bundle名字
/// @param targetClass 指定类
+ (instancetype)subBundleWithBundleName:(NSString *)bundleName targetClass:(Class)targetClass {
    
    NSBundle *bundle = [NSBundle bundleForClass:targetClass];
    NSString *path = [bundle pathForResource:bundleName ofType:@"bundle"];
    
    return path?[NSBundle bundleWithPath:path]:[NSBundle mainBundle];
}
```

### 总结

访问私有库中的资源，需要指定该资源所在的 `bundle`。