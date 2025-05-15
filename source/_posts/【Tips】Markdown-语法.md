---
title: 【Tips】Markdown 语法
date: 2023-03-25 10:00:21
tags:
- Tips
categories:
- Tips
---

# Markdown

## 一、Markdown纯文本基本语法

### 1. 标题

Markdown 支持两种标题的语法，类 Setext 和类 atx 形式。 类 Setext 形式是用底线的形式，利用 = （最高阶标题）和 - （第二阶标题），例如：

```
This is an H1
=======

This is an H2
----------
```
<!-- more -->

效果如下：

This is an H1
=======

This is an H2
----------

任何数量的 = 和 - 都可以有效果。

这里需要注意一点，由于分割线也是 “----”， 因此在使用分割线时，一定要空一行，不然会把上方的文字识别为第二阶标题。原因会在后面的段落和换行中说到。
类 Atx 形式则是在行首插入 1 到 6 个 # ，对应到标题 1 到 6 阶，例如：

```
# this is H1
## this is H2
###### this is H6
```

效果不再展示，但要注意的是，标准语法一般在 # 后跟个空格再写文字，不然可能会无法识别。

### 2. 字体

#### 粗/斜/删除线/下划线

Markdown 使用星号（\*）和底线（_）作为标记强调字词的符号，你可以随便用你喜欢的样式，唯一的限制是，你用什么符号开启标签，就要用什么符号结束。但个人感觉写中文时还是（*）比较好用，因为它不区分全角半角，不用切换输入法。 示例：

```
**这是加粗**
__这也是加粗__
*这是倾斜*
_这也是倾斜_
***这是加粗倾斜***
~~这是加删除线~~
```

效果如下： 
**这是加粗**
__这也是加粗__
*这是倾斜*
_这也是倾斜_
***这是加粗倾斜***
~~这是加删除线~~

注意：强调也可以直接插在文字中间，但是如果你的 * 和 _ 两边都有空白的话，它们就只会被当成普通的符号。 如果要在文字前后直接插入普通的星号或底线，你可以用反斜线 \ 。

#### 字体、字号、颜色

如果想要指定字体大小、颜色和类型可以通过`<font></font>`语法来完成。

```js
指定字体类型： <font face="黑体">我是黑体字</font>
指定字体大小： <font size=12>我是12号字</font>
指定字体颜色：<font color=#0099ff>我是蓝色字</font> #0099ff 为颜色的16进制代码
指定字体颜色、字号、字体类型<font color=#0099ff size=12 face="黑体">黑体</font>
```

效果如下：

指定字体类型： <font face="黑体">我是黑体字</font>
指定字体大小： <font size=12>我是12号字</font>
指定字体颜色：<font color=#0099ff>我是蓝色字</font> #0099ff 为颜色的16进制代码
指定字体颜色、字号、字体类型<font color=#0099ff size=12 face="黑体">黑体</font>


### 3. 分割线

你可以在一行中用三个以上的星号、减号、底线来建立一个分隔线，行内不能有其他东西。你也可以在星号或是减号中间插入空格。下面每种写法都可以建立分隔线：

```
* * *
***
**********
- - -
_________________
```

效果如下：

* * *
***
_________________

### 4. 引用

在引用的文字前加 > 即可。 在 Markdown 文件中建立一个区块引用，那会看起来像是你自己先断好行，然后在每行的最前面加上 > ：

```
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
> 
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.
```

效果如下：

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
> 
Markdown 也允许你偷懒只在整个段落的第一行最前面加上 > ：

```
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
```

效果如下：

>This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

区块引用可以嵌套（例如：引用内的引用），只要根据层次加上不同数量的 > ：

```
> This is the first level of quoting.
>
> > This is nested blockquote.
>
> > > > Back to the first level.
```

效果如下：

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> > > > Back to the first level.

引用的区块内也可以使用其他的 Markdown 语法，包括标题、列表、代码区块等。

### 5. 列表

Markdown 支持有序列表和无序列表。 无序列表使用星号、加号或是减号作为列表标记。 示例：

```
- 列表内容
+ 列表内容
* 列表内容
注意：- + * 跟内容之间都要有一个空格
```

效果如下： 
- 列表内容
+ 列表内容
* 列表内容

有序列表则使用数字接着一个英文句点作为标记。 示例：

```
1. 列表内容
2. 列表内容
3. 列表内容
注意：序号跟内容之间要有空格 
```
效果如下： 
1. 列表内容
2. 列表内容
3. 列表内容

列表可以嵌套，上一级和下一级之间敲三个空格即可。

```
* 一级无序列表内容

   * 二级无序列表内容
   * 二级无序列表内容
   * 二级无序列表内容
```

效果如下： 
* 一级无序列表内容

   * 二级无序列表内容
   * 二级无序列表内容
   * 二级无序列表内容

要让列表看起来更漂亮，你可以把内容用固定的缩进整理好：

```
*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
    Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
    viverra nec, fringilla in, laoreet vitae, risus.
*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
    Suspendisse id sem consectetuer libero luctus adipiscing
```

效果如下： 
*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
    Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
    viverra nec, fringilla in, laoreet vitae, risus.
*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
    Suspendisse id sem consectetuer libero luctus adipiscing

列表项目可以包含多个段落，每个项目下的段落都必须缩进 4 个空格或是 1 个制表符：
```
1.  This is a list item with two paragraphs. Lorem ipsum dolor
    sit amet, consectetuer adipiscing elit. Aliquam hendrerit
    mi posuere lectus.

    Vestibulum enim wisi, viverra nec, fringilla in, laoreet
    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum
    sit amet velit.

2.  Suspendisse id sem consectetuer libero luctus adipiscing.
```
效果如下： 
1.  This is a list item with two paragraphs. Lorem ipsum dolor
    sit amet, consectetuer adipiscing elit. Aliquam hendrerit
    mi posuere lectus.

    Vestibulum enim wisi, viverra nec, fringilla in, laoreet
    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum
    sit amet velit.

2.  Suspendisse id sem consectetuer libero luctus adipiscing.

如果你每行都有缩进，看起来会看好很多，当然，再次地，如果你很懒惰，Markdown 也允许：

```
*   This is a list item with two paragraphs.

    This is the second paragraph in the list item. You're
only required to indent the first line. Lorem ipsum dolor
sit amet, consectetuer adipiscing elit.

*   Another item in the same list.
```

效果不再展示。 此外： 如果要在列表项目内放进引用，那 > 就需要缩进， 如果要放代码区块的话，该区块就需要缩进两次，也就是 8 个空格或是 2 个制表符。

### 6. 表格

示例：

```
表头|表头|表头
---|:--:|---:
内容|内容|内容
内容|内容|内容

第二行分割表头和内容。
- 有一个就行，为了对齐，多加了几个
文字默认居左
-两边加：表示文字居中
-右边加：表示文字居右
注：原生的语法两边都要用 | 包起来。此处省略
```

效果如下： 

表头|表头|表头
---|:--:|---:
内容|内容|内容
内容|内容|内容

### 7. 代码

在Markdown中加入代码块有两种方式： 第一种，只要简单地缩进 4 个空格或是 1 个制表符就可以:

```
这是一个普通段落：

    这是一个代码区块。

(当然，前面要有一个空行和前面的文字分隔开)
```

效果如下：

这是一个普通段落：

    这是一个代码区块。

第二种方法似乎是更为常用， 单行代码：代码之间分别用一个反引号包起来即可；
```
这里有一句代码`代码内容`。
```
效果如下： 
这里有一句代码`代码内容`。

代码块：代码之间分别用三个反引号包起来，且两边的反引号单独占一行

```
\```
  代码...
  代码...
  代码...
\```
\ 是为了防止转译，实际是没有的。
```
效果如下：

```
  代码...
  代码...
  代码...
```
还可以在上面的 ``` 后面注明你的代码类型，可以产生相应的代码高亮。

### 8. 段落和换行

一个 Markdown 段落是由一个或多个连续的文本行组成，它的前后要有一个以上的空行（空行的定义是显示上看起来像是空的，便会被视为空行。比方说，若某一行只包含空格和制表符，则该行也会被视为空行）。普通段落不该用空格或制表符来缩进。 我们在两个不同的文字块之间，一定要空行以示区分，不然就会被归入同一文字块中。 

#### 换行

Markdown 允许段落内的强迫换行（插入换行符）。 如果想要空一行，在插入处先按入两个以上的空格然后回车，即可。

* 方法1：连敲2个以上空格+enter键；
* 方法2：利用html语法，`<br>`。

#### 缩进/空格

但有时也可以使用标记来强制空行和空格，比如需要首行缩进的时候： 一个空格大小的表示：\  或 \  两个空格的大小表示：\ 或 \ 不换行空格：\ 或 \ 强制空行： \

>由于平时中文的排版习惯，首行通常缩进两字符什么的，所以顺便也了解以下操作,在markdown里这个还稍微有点麻烦，不是敲两下空格键就搞定的。这里需要借用html方面的空格实体。
首先明确1个汉字=2个空格大小
1、一个空格大小的表示&ensp; &#8194;两种用法显示效果一致。
2、两个空格大小的表示&emsp; &#8195;两种用法显示效果一致。
3、不换行空格的表示&nbsp; &#160;也是占一个空格的宽度大小。

### 9. 插入超链接

链接分两种。一种是链接到其他网上地址的，还有一种是链接到本文中的某个位置的。
两种的基本格式一样`[]()`。需要添加链接的文字内容用`[方括号]`来括起来，后面紧跟着带有网址的`(圆括号)`，如果要加上连接的title文字，在网址后面，把 title文字放到双引号里面。

```
[超链接名](超链接地址 "超链接title")
title可加可不加
文字链接 [链接名称](http://链接网址)
网址链接 <http://链接网址>
实例：
[Github](https://github.com/fengyanxin) &emsp;<https://github.com/fengyanxin>
```

效果如下：

[Github](https://github.com/fengyanxin)：<https://github.com/fengyanxin>

### 10. 插入图片

添加图片形式和链接相似，只需要在链接的基础上前方加一个`！` 感叹号。

```
![图片alt](图片地址  "optional title")
图片alt就是显示在图片下面的文字，相当于对图片内容的解释，可以不写。
图片地址链接可以是图片的本地地址或网址。
图片optional title是图片的标题，当鼠标悬置于图片上时显示的内容。title可加可不加。
```

效果如下：

![](https://raw.githubusercontent.com/fengyanxin/YXBlogPic/main/16781754751832.jpg)
