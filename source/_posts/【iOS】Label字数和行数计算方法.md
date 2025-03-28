---
title: 【OC】Label字数和行数的计算方法
date: 2025-03-28 15:29:42
tags:
- OC
- iOS
categories:
- iOS
---

在 iOS 中，UILabel 常常需要计算高度来实现动态高度变化，以下是一些关于 label 字数和行数的计算方法总结，以备需要之时查看。

### 1、计算label行数：

``` swift
- (NSUInteger)lineCount
{
   CGSize size = [self sizeThatFits:CGSizeMake(self.frame.size.width, CGFLOAT_MAX)];
   return MAX((int)(size.height / self.font.lineHeight), 0);
}
```

<!-- more -->

### 2、返回label中可见字符串长度：

``` swift
- (NSUInteger)fitString:(NSString *)string intoLabel:(UILabel *)label{
   UIFont *font           = label.font;
   NSLineBreakModemode    = label.lineBreakMode;
   CGFloat labelWidth     = label.frame.size.width;
   CGFloat labelHeight    = label.frame.size.height;
   CGSize  sizeConstraint = CGSizeMake(labelWidth, CGFLOAT_MAX);
if([stringsizeWithFont:fontconstrainedToSize:sizeConstraintlineBreakMode:mode].height> labelHeight) {
       NSString *adjustedString;
       for(NSUIntegeri =1; i < [stringlength]; i++){
           adjustedString = [string substringToIndex:i];
           if ([adjustedString sizeWithFont:font constrainedToSize:sizeConstraint lineBreakMode:mode].height > labelHeight)
               returni -1;
            }
   }
   return [string length];
}
```

``` swift
- (NSUInteger)fitString:(NSString *)string intoLabel:(float)width font:(UIFont * )font lineCount:(NSUInteger)count
{
   CGSize size = [string boundingRectWithSize:CGSizeMake(width, CGFLOAT_MAX)
                                      options:NSStringDrawingTruncatesLastVisibleLine |
                  NSStringDrawingUsesLineFragmentOrigin |
                  NSStringDrawingUsesFontLeading
                                   attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:18]}
                                      context:nil].size;
   CGFloat allLineHeight = font.lineHeight*count;
   if (size.height>allLineHeight) {
       NSString *adjustedString;
       for (NSUInteger i = 1; i < [string length]; i++)
       {
           adjustedString = [string substringToIndex:i];
           CGSize size2 = [adjustedString boundingRectWithSize:CGSizeMake(width, MAXFLOAT)
                                              options:NSStringDrawingTruncatesLastVisibleLine |
                          NSStringDrawingUsesLineFragmentOrigin |
                          NSStringDrawingUsesFontLeading
                                           attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:18]}
                                              context:nil].size;
           if (size2.height > allLineHeight)
               return i - 1;
       }
   }
   return [string length];
}
```

### 3、返回label每一行字符串内容：

``` swift
#import <CoreText/CoreText.h>
-(NSArray *)getLinesArrayOfStringInLabel:(NSString *)text andFont:(UIFont *)font andWidth:(CGFloat)width
{
    //NSString *text = [label text];
    //UIFont   *font = [label font];
    //CGRect    rect = [label frame];
    CTFontRef myFont = CTFontCreateWithName((CFStringRef)font.fontName,
                                            font.pointSize,
                                            NULL);
    NSMutableAttributedString *attStr = [[NSMutableAttributedString alloc] initWithString:text];
    [attStr addAttribute:(NSString *)kCTFontAttributeName value:(__bridge id)myFont range:NSMakeRange(0, attStr.length)];
    CTFramesetterRef frameSetter = CTFramesetterCreateWithAttributedString((__bridge CFAttributedStringRef)attStr);
    CGMutablePathRef path = CGPathCreateMutable();
    CGPathAddRect(path, NULL, CGRectMake(0,0,width,100000));
    CTFrameRef frame = CTFramesetterCreateFrame(frameSetter, CFRangeMake(0, 0), path, NULL);
    NSArray *lines = (__bridge NSArray *)CTFrameGetLines(frame);
    NSMutableArray *linesArray = [[NSMutableArray alloc]init];
    for (id line in lines)
    {
        CTLineRef lineRef = (__bridge CTLineRef )line;
        CFRange lineRange = CTLineGetStringRange(lineRef);
        NSRange range = NSMakeRange(lineRange.location, lineRange.length);
        NSString *lineString = [text substringWithRange:range];
        [linesArray addObject:lineString];
    }
    return (NSArray *)linesArray;
}
```

### 4、获取label固定行数的字符串长度：

``` swift
- (NSUInteger)fitString:(NSString *)string intoLabel:(UILabel *)label lineCount:(NSUInteger)count
{
    NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
    [style setLineBreakMode:label.lineBreakMode];
    NSDictionary *attributes = @{ NSFontAttributeName : label.font, NSParagraphStyleAttributeName : style };
    CGSize size = [string boundingRectWithSize:CGSizeMake(cellWidth - 84 - 24, CGFLOAT_MAX)
                                       options:NSStringDrawingUsesLineFragmentOrigin
                                    attributes:attributes
                                       context:nil].size;
    CGFloat allLineHeight = label.font.lineHeight*count;
    if (size.height>allLineHeight) {
        NSString *adjustedString;
        for (NSUInteger i = 1; i < [string length]; i++)
        {
            adjustedString = [string substringToIndex:i];
            CGSize size2 = [adjustedString boundingRectWithSize:CGSizeMake(cellWidth - 84 - 24, MAXFLOAT)                                                        options:NSStringDrawingUsesLineFragmentOrigin
                                                     attributes:attributes
                                                        context:nil].size;
                if (size2.height > allLineHeight)
                return i - 1;
        }
    }
    return [string length];
}
```