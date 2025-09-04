---
title: 【OC】原生富文本 NSAttributedString 的使用
date: 2025-09-04 10:33:36
tags:
- OC
- iOS
categories:
- iOS
---

## 什么是 NSAttributedString？

`NSAttributedString`（属性字符串）是 `Foundation` 框架中的一个类，它允许你在一个字符串中为不同的字符范围应用不同的属性（如字体、颜色、间距等）。与普通的 `NSString` 只能存储纯文本不同，`NSAttributedString` 可以存储富文本信息。

但是，`NSAttributedString` 是不可变的，一旦创建就不能再修改。

如果想要在创建富文本后，修改字符串的内容和属性，可以使用 `NSAttributedString` 的可变版本 `NSMutableAttributedString`，它给我们提供了丰富的 `API` 来进行自定义。

<!-- more -->

## 创建和初始化

### 1. 从字符串创建

``` swift
NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:@"Hello World"];
```

### 2. 从现有属性字符串创建

``` swift
NSAttributedString *existingString = [[NSAttributedString alloc] initWithString:@"Existing"];
NSMutableAttributedString *mutableString = [[NSMutableAttributedString alloc] initWithAttributedString:existingString];
```

## 常用属性设置方法

### 1. 设置字体

``` swift
NSDictionary *attributes = @{
    NSFontAttributeName: [UIFont systemFontOfSize:18 weight:UIFontWeightBold]
};
[attributedString addAttributes:attributes range:NSMakeRange(0, 5)];
```

### 2. 设置文字颜色

``` swift
[attributedString addAttribute:NSForegroundColorAttributeName 
                         value:[UIColor redColor] 
                         range:NSMakeRange(6, 5)];
```

### 3. 设置背景色

``` swift
[attributedString addAttribute:NSBackgroundColorAttributeName 
                         value:[UIColor yellowColor] 
                         range:NSMakeRange(0, 5)];
```

### 4. 设置段落样式

``` swift
NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
paragraphStyle.lineSpacing = 8;
paragraphStyle.alignment = NSTextAlignmentCenter;

[attributedString addAttribute:NSParagraphStyleAttributeName 
                         value:paragraphStyle 
                         range:NSMakeRange(0, attributedString.length)];
```

### 5. 设置下划线

``` swift
[attributedString addAttribute:NSUnderlineStyleAttributeName 
                         value:@(NSUnderlineStyleSingle) 
                         range:NSMakeRange(0, 5)];
```

### 6. 设置删除线

``` swift
[attributedString addAttribute:NSStrikethroughStyleAttributeName 
                         value:@(NSUnderlineStyleSingle) 
                         range:NSMakeRange(6, 5)];
```

### 7. 设置字间距

``` swift
[attributedString addAttribute:NSKernAttributeName 
                         value:@(2.0) 
                         range:NSMakeRange(0, attributedString.length)];
```

## 常用操作方法

### 1. 追加字符串

``` swift
NSAttributedString *appendString = [[NSAttributedString alloc] initWithString:@" Appended"];
[attributedString appendAttributedString:appendString];
```

### 2. 插入字符串

``` swift
NSAttributedString *insertString = [[NSAttributedString alloc] initWithString:@"Inserted "];
[attributedString insertAttributedString:insertString atIndex:0];
```

### 3. 替换字符串

``` swift
NSAttributedString *replaceString = [[NSAttributedString alloc] initWithString:@"New"];
[attributedString replaceCharactersInRange:NSMakeRange(0, 5) withAttributedString:replaceString];
```

### 4. 删除字符串

``` swift
[attributedString deleteCharactersInRange:NSMakeRange(0, 5)];
```

### 5. 设置整个字符串的属性

``` swift
[attributedString setAttributes:@{
    NSFontAttributeName: [UIFont systemFontOfSize:16],
    NSForegroundColorAttributeName: [UIColor blueColor]
} range:NSMakeRange(0, attributedString.length)];
```

### 6. 移除属性

``` swift
[attributedString removeAttribute:NSForegroundColorAttributeName range:NSMakeRange(0, 5)];
```

## 实用示例

### 示例1：创建富文本标签

``` swift
- (void)setupAttributedLabel {
    NSString *text = @"价格: ¥199 原价: ¥299";
    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:text];
    
    // 设置价格颜色和字体
    [attributedString addAttributes:@{
        NSForegroundColorAttributeName: [UIColor redColor],
        NSFontAttributeName: [UIFont boldSystemFontOfSize:18]
    } range:[text rangeOfString:@"¥199"]];
    
    // 设置原价删除线
    [attributedString addAttributes:@{
        NSForegroundColorAttributeName: [UIColor grayColor],
        NSStrikethroughStyleAttributeName: @(NSUnderlineStyleSingle),
        NSStrikethroughColorAttributeName: [UIColor grayColor]
    } range:[text rangeOfString:@"¥299"]];
    
    self.priceLabel.attributedText = attributedString;
}
```

### 示例2：按钮富文本

``` swift
- (void)setupAttributedButton {
    NSString *text = @"登录 即表示同意《用户协议》和《隐私政策》";
    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:text];
    
    // 设置协议链接样式
    [attributedString addAttributes:@{
        NSForegroundColorAttributeName: [UIColor blueColor],
        NSUnderlineStyleAttributeName: @(NSUnderlineStyleSingle)
    } range:[text rangeOfString:@"《用户协议》"]];
    
    [attributedString addAttributes:@{
        NSForegroundColorAttributeName: [UIColor blueColor],
        NSUnderlineStyleAttributeName: @(NSUnderlineStyleSingle)
    } range:[text rangeOfString:@"《隐私政策》"]];
    
    [self.agreementButton setAttributedTitle:attributedString forState:UIControlStateNormal];
}
```

### 示例3：多样式文本组合

``` swift
- (NSAttributedString *)createComplexAttributedString {
    NSMutableAttributedString *result = [[NSMutableAttributedString alloc] init];
    
    // 第一部分：图标+文字
    NSTextAttachment *attachment = [[NSTextAttachment alloc] init];
    attachment.image = [UIImage imageNamed:@"icon_star"];
    attachment.bounds = CGRectMake(0, -2, 16, 16);
    
    NSAttributedString *iconString = [NSAttributedString attributedStringWithAttachment:attachment];
    [result appendAttributedString:iconString];
    
    NSAttributedString *spaceString = [[NSAttributedString alloc] initWithString:@" "];
    [result appendAttributedString:spaceString];
    
    NSAttributedString *textString = [[NSAttributedString alloc] initWithString:@"五星好评" attributes:@{
        NSFontAttributeName: [UIFont systemFontOfSize:14],
        NSForegroundColorAttributeName: [UIColor orangeColor]
    }];
    [result appendAttributedString:textString];
    
    // 第二部分：换行
    NSAttributedString *newLineString = [[NSAttributedString alloc] initWithString:@"\n"];
    [result appendAttributedString:newLineString];
    
    // 第三部分：描述文字
    NSAttributedString *descString = [[NSAttributedString alloc] initWithString:@"感谢您的支持！" attributes:@{
        NSFontAttributeName: [UIFont systemFontOfSize:12],
        NSForegroundColorAttributeName: [UIColor grayColor]
    }];
    [result appendAttributedString:descString];
    
    return result;
}
```

## 注意事项

1. 范围检查：确保 `NSMakeRange` 的范围不会超出字符串长度
2. 性能优化：批量使用 `addAttributes:` 而不是多次调用 `addAttribute:`
3. 内存管理：大量的富文本操作可能影响性能
4. 复用：对于频繁使用的富文本，考虑缓存创建结果

## 常用属性键值列表

属性键|描述|值类型
:---:|:--:|:--:
NSFontAttributeName|字体|UIFont
NSForegroundColorAttributeName|文字颜色|UIColor
NSBackgroundColorAttributeName|背景颜色|UIColor
NSParagraphStyleAttributeName	|段落样式|NSParagraphStyle
NSKernAttributeName|字间距|NSNumber
NSStrikethroughStyleAttributeName|删除线样式|NSNumber
NSUnderlineStyleAttributeName	|下划线样式|NSNumber
NSStrokeColorAttributeName	|描边颜色|UIColor
NSStrokeWidthAttributeName|描边宽度|NSNumber
NSShadowAttributeName|阴影|NSShadow
NSLinkAttributeName|链接|NSURL/NSString


## 设置段落样式扩展

### 使用 NSMutableParagraphStyle

`NSMutableParagraphStyle` 是专门用于设置段落样式的类，可以控制*行间距、段落间距、对齐方式*等。

#### 1. 基本设置方法

``` swift
// 创建段落样式
NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];

// 设置行间距
paragraphStyle.lineSpacing = 10; // 行间距10pt

// 设置段落间距
paragraphStyle.paragraphSpacing = 15; // 段落间距15pt

// 应用到属性字符串
NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:@"你的文本内容"];
[attributedString addAttribute:NSParagraphStyleAttributeName 
                         value:paragraphStyle 
                         range:NSMakeRange(0, attributedString.length)];
```

#### 2. 完整示例

``` swift
- (void)setupTextWithLineAndParagraphSpacing {
    NSString *text = @"这是第一段文本。\n这是第二段文本，包含多行文字，用于演示行间距和段落间距的效果。\n这是第三段文本。";
    
    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:text];
    
    // 创建段落样式
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    paragraphStyle.lineSpacing = 8;          // 行间距8pt
    paragraphStyle.paragraphSpacing = 16;    // 段落间距16pt
    paragraphStyle.alignment = NSTextAlignmentLeft; // 左对齐
    
    // 应用到整个文本
    [attributedString addAttribute:NSParagraphStyleAttributeName 
                             value:paragraphStyle 
                             range:NSMakeRange(0, attributedString.length)];
    
    self.textLabel.attributedText = attributedString;
    self.textLabel.numberOfLines = 0; // 多行显示
}
```

### 更多 NSMutableParagraphStyle 属性

``` swift
@property (NS_NONATOMIC_IOSONLY) CGFloat lineSpacing;
@property (NS_NONATOMIC_IOSONLY) CGFloat paragraphSpacing;
@property (NS_NONATOMIC_IOSONLY) CGFloat firstLineHeadIndent;
@property (NS_NONATOMIC_IOSONLY) CGFloat headIndent;
@property (NS_NONATOMIC_IOSONLY) CGFloat tailIndent;
@property (NS_NONATOMIC_IOSONLY) NSLineBreakMode lineBreakMode;
@property (NS_NONATOMIC_IOSONLY) CGFloat minimumLineHeight;
@property (NS_NONATOMIC_IOSONLY) CGFloat maximumLineHeight;
@property (NS_NONATOMIC_IOSONLY) NSWritingDirection baseWritingDirection;
@property (NS_NONATOMIC_IOSONLY) CGFloat lineHeightMultiple;
@property (NS_NONATOMIC_IOSONLY) CGFloat paragraphSpacingBefore;
@property (NS_NONATOMIC_IOSONLY) float hyphenationFactor;
```

#### 1. 行间距和段落间距

`lineSpacing` - 行间距

``` swift
@property CGFloat lineSpacing;
```

含义：行与行之间的垂直间距（单位为点）
效果：在每行文字之间添加额外的垂直空间

示例：

``` swift
paragraphStyle.lineSpacing = 10; // 行间距10pt
```

`paragraphSpacing` - 段落间距

``` swift
@property CGFloat paragraphSpacing;
```

含义：段落之间的垂直间距（换行符 \n 后的间距）
效果：在段落之间添加额外的垂直空间

示例：

``` swift
paragraphStyle.paragraphSpacing = 15; // 段落间距15pt
```

`paragraphSpacingBefore` - 段前间距

``` swift
@property CGFloat paragraphSpacingBefore;
```

含义：段落开始前的垂直间距
效果：在段落开始前添加额外的垂直空间

示例：

``` swift
paragraphStyle.paragraphSpacingBefore = 10; // 段前间距10pt
```

#### 2. 缩进相关

`firstLineHeadIndent` - 首行缩进

``` swift
@property CGFloat firstLineHeadIndent;
```

含义：段落第一行的缩进量
效果：像中文段落那样首行缩进2个字符

示例：

``` swift
paragraphStyle.firstLineHeadIndent = 20; // 首行缩进20pt
```

`headIndent` - 头部缩进

``` swift
@property CGFloat headIndent;
```

含义：除第一行外所有行的缩进量
效果：创建悬挂缩进效果

示例：

``` swift
paragraphStyle.headIndent = 30; // 除首行外缩进30pt
```

`tailIndent` - 尾部缩进

``` swift
@property CGFloat tailIndent;
```

含义：文本行尾部的缩进量（正值向左缩进，负值向右扩展）
效果：控制文本右侧的边界

示例：

``` swift
paragraphStyle.tailIndent = -20; // 向右扩展20pt
```

#### 3. 行高控制

`minimumLineHeight` - 最小行高

``` swift
@property CGFloat minimumLineHeight;
```

含义：行的最小高度
效果：确保每行至少有这么高

示例：

``` swift
paragraphStyle.minimumLineHeight = 25; // 最小行高25pt
```

`maximumLineHeight` - 最大行高

``` swift
@property CGFloat maximumLineHeight;
```

含义：行的最大高度
效果：限制每行的最大高度

示例：

``` swift
paragraphStyle.maximumLineHeight = 30; // 最大行高30pt
```

`lineHeightMultiple` - 行高倍数

``` swift
@property CGFloat lineHeightMultiple;
```

含义：行高相对于字体大小的倍数
效果：`行高 = 字体大小 × lineHeightMultiple`

示例：

``` swift
paragraphStyle.lineHeightMultiple = 1.5; // 行高是字体的1.5倍
```

#### 4. 其他重要属性

`lineBreakMode` - 换行模式

``` swift
@property NSLineBreakMode lineBreakMode;
```

含义：当文本超出边界时的换行方式
常用值：

* `NSLineBreakByWordWrapping` - 按单词换行
* `NSLineBreakByCharWrapping` - 按字符换行
* `NSLineBreakByTruncatingTail` - 末尾显示省略号
* `NSLineBreakByTruncatingMiddle` - 中间显示省略号
* `NSLineBreakByTruncatingHead` - 开头显示省略号

示例：

``` swift
paragraphStyle.lineBreakMode = NSLineBreakByWordWrapping;
```

`baseWritingDirection` - 书写方向

``` swift
@property NSWritingDirection baseWritingDirection;
```

含义：文本的书写方向
常用值：

* `NSWritingDirectionNatural` - 自然方向（根据语言自动判断）
* `NSWritingDirectionLeftToRight` - 从左到右
* `NSWritingDirectionRightToLeft` - 从右到左

示例：

``` swift
paragraphStyle.baseWritingDirection = NSWritingDirectionLeftToRight;
```

`hyphenationFactor` - 连字符因子

``` swift
@property float hyphenationFactor;
```

含义：断字连接的概率（0.0-1.0）
效果：控制英文单词在行末是否使用连字符断开
示例：

``` swift
paragraphStyle.hyphenationFactor = 0.5; // 50%的概率使用连字符
```

#### 完整示例

``` swift
- (NSMutableParagraphStyle *)createCompleteParagraphStyle {
    NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
    
    // 间距设置
    style.lineSpacing = 8;              // 行间距8pt
    style.paragraphSpacing = 16;        // 段落间距16pt
    style.paragraphSpacingBefore = 8;   // 段前间距8pt
    
    // 缩进设置
    style.firstLineHeadIndent = 20;     // 首行缩进20pt
    style.headIndent = 10;              // 其他行缩进10pt
    style.tailIndent = -10;             // 向右扩展10pt
    
    // 行高控制
    style.minimumLineHeight = 20;       // 最小行高20pt
    style.maximumLineHeight = 30;       // 最大行高30pt
    style.lineHeightMultiple = 1.2;     // 行高是字体的1.2倍
    
    // 其他设置
    style.lineBreakMode = NSLineBreakByWordWrapping; // 按单词换行
    style.baseWritingDirection = NSWritingDirectionLeftToRight; // 从左到右
    style.hyphenationFactor = 0.3;      // 30%概率使用连字符
    
    return style;
}
```