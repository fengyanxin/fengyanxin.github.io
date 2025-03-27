---
title: 【OC】在 OC 中如何实现字符串枚举？
date: 2025-03-27 09:34:40
tags:
- OC
- iOS
categories:
- iOS
---

# 一、常见枚举写法

### 1、C 语言模式的枚举写法：enum

``` swift
typedef enum{
    KLTypeRed = 1,
    KLTypeGreen = 2,
    KLTypeOrange = 3,
} KLType;
```

### 2、普通【整型】枚举写法 ：NS_ENUM

``` swift
typedef NS_ENUM(NSUInteger, KLType) {
    KLTypeRed = 1,
    KLTypeGreen = 2,
    KLTypeOrange = 3,
};
```

### 3、位移枚举 ：NS_OPTIONS

``` swift
typedef NS_OPTIONS(NSUInteger, KLType) {
    KLTypeRed = 1 << 0,
    KLTypeGreen = 1 << 1,
    KLTypeOrange = 1 << 2,
};
```

# 二、字符串类型枚举实现方式探索

### 1、基于普通枚举，定义 C 方法实现

``` swift
// 先定义一个常见的枚举
typedef NS_ENUM(NSUInteger, KLType) {
    KLTypeRed    = 1,
    KLTypeGreen  = 2,
    KLTypeOrange = 3,
};
// 定义一个C方法，C方法就是通过枚举值匹配字符串
NSString *KLTypeString(KLType status) {
    switch (status) {
        case KLTypeRed:
            return @"红色";
        case KLTypeGreen:
            return @"绿色";
        case KLTypeOrange:
            return @"橘色";
        default:
            return @"";
    }
}
```

### 2、基于普通枚举，定义 C 数组，设置枚举值为 index

``` swift
// 先定义一个常见的枚举
typedef NS_ENUM(NSUInteger, KLType) {
    KLTypeRed    = 1,
    KLTypeGreen  = 2,
    KLTypeOrange = 3,
};
// 这个是 Map NSString * 类型的数组
NSString *KLTypeStringMap[] = {
    [KLTypeRed]    = @"红色",
    [KLTypeGreen]  = @"绿色",
    [KLTypeOrange] = @"橘色"
};


// 使用：
KLType type = KLTypeRed;
NSLog(@"%@", KLTypeStringMap[type]); //  NSLog: 红色
```

### 3、日常做法，宏定义

``` swift
#define static NSString * const KLTypeStringRed = @"红色";
#define static NSString * const KLTypeStringGreen = @"绿色";
#define static NSString * const KLTypeStringOrange = @"橘色";
```

### 4、定义一种新的数据类型

``` swift
// 定义一个新的类型 是 NSSting * 类型 类型名字叫 KLTypeStr
typedef NSString *KLTypeStr NS_STRING_ENUM;

static KLTypeStr const KLTypeStringRed    = @"红色";
static KLTypeStr const KLTypeStringGreen  = @"绿色";
static KLTypeStr const KLTypeStringOrange = @"橘色";
```

### 5、Apple 官方的做法

``` swift
.h 文件中 -------------
typedef NSString *KLTypeStr NS_STRING_ENUM;

FOUNDATION_EXPORT KLTypeStr const KLTypeStringRed;
FOUNDATION_EXPORT KLTypeStr const KLTypeStringGreen;
FOUNDATION_EXPORT KLTypeStr const KLTypeStringOrange;

.m 文件中 --------------
NSString * const KLTypeStringRed    = @"红色";
NSString * const KLTypeStringGreen  = @"绿色";
NSString * const KLTypeStringOrange = @"橘色"; 
```

ps：比较的时候 `Str1 == Str2` 直接比较的是内存地址，效率更高。
由于过多的宏定义会产生过多的二进制文件，故如果宏定义比较多，建议用 `FOUNDATION_EXPORT`。