---
title: 【iOS】设计模式6大原则在iOS中的应用
date: 2025-11-19 11:12:03
tags:
- OC
- iOS
categories:
- iOS
---

编程中的 **六大基本原则（SOLID原则）** 是面向对象设计和编程的核心准则，遵循这六大原则可以帮助我们创建更易维护、扩展和理解的代码。

下面就让我们来具体了解一下这六大原则，和它们在 iOS 中的应用：

## 一、单一职责原则（Single Responsibility Principle，SRP）

**定义：** 一个类应该只有一个引起变化的原因，或者说一个类应该只有一个责任。

**关键思想：**
1. 一个类应该专注于一种类型的任务，只有一个责任；
2. 一个类应该只有一个原因引起它变化。

<!-- more -->

**优点：** 提高代码可读性，降低修改风险，便于维护

**下面是一个错误的例子：**

``` swift
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Employee : NSObject // 这是一个工人的基本信息的内容
@property (nonatomic, strong) NSString* name;
@property (nonatomic, assign) NSInteger age;
-(void)calculateSalary:(Employee*)employee; // 计算了工人的薪资
@end

NS_ASSUME_NONNULL_END

#import "Employee.h"

@implementation Employee
-(void)calculateSalary:(Employee *)employee {
    NSLog(@"calcurlatSalry: name: %@, age : %ld", employee.name, employee.age);
}
@end
```

这个案例我们可以看出我们这里出现了这个类包含了多个职能，这很显然不符合我们的单一职能原则，我们这个工人的类别就应该仅仅包含一个工人的一个基本信息，而不应该涉及计算薪资的一个内容。

**这里我们给出一个正确的例子：**

``` swift
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Employee : NSObject
@property (nonatomic, strong) NSString* name;
@property (nonatomic, assign) NSInteger age;
@end

NS_ASSUME_NONNULL_END

#import <Foundation/Foundation.h>
@class Employee;
NS_ASSUME_NONNULL_BEGIN

@interface SalaryCaculator : NSObject
-(void)calculateSalary:(Employee*)employee;
@end
  
NS_ASSUME_NONNULL_END
#import "SalaryCaculator.h"
#import "Employee.h"
@implementation SalaryCaculator
-(void)calculateSalary:(Employee *)employee {
    NSLog(@"calcurlatSalry: name: %@, age : %ld", employee.name, employee.age);
}
@end
```

在这个案例中我们把两个内容分开了，创建了一个新的类来负责他对应的一个工作，从而保证了一个类只负责一个职能，符合我们的一个单一职能原则。

遵循单一职责原则是一个重要的设计原则，可以帮助我们写出更加**模块化、可维护和可扩展**的代码。

## 二、开闭原则 (Open/Closed Principle - OCP)

开闭原则，是面向对象设计中的一个基本原则，它由勃兰特·梅耶（Bertrand Meyer）提出，并由罗伯特·C·马丁（Robert C. Martin）进一步发扬光大。

**定义：** 软件实体（类、模块、函数等）应该对扩展开放，对修改关闭。

**解释：** 这意味着一个软件实体可以通过扩展来应对新的行为需求，而不需要修改已有的代码。这可以通过抽象和接口实现，以确保对于新增功能的引入，不需要修改现有的代码，而是通过扩展来实现。

**关键点：**
1. **对扩展开放：** 新的功能应该通过新增代码而不是修改已有代码的方式引入。
2. **对修改关闭：** 已有的代码在引入新的功能时不应该被修改，以确保稳定性。

``` swift
//下面是一个有关于Car的例子
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Car : NSObject
@property (nonatomic, strong) NSString* brand;
@end

NS_ASSUME_NONNULL_END

#import "Car.h"

@implementation Car
- (void) startEngine { // 一个汽车启动的业务
    NSLog(@"the car go to ran");
}
@end
``` 

根据我们这个原则的思想来说的话，我们如果想添加一个新的功能，比方说自动泊车，我们应该是添加一个方法，而不是在原先的方法上进行修改：

``` swift
#import "Car.h"

NS_ASSUME_NONNULL_BEGIN
//这里创建一个抽象类来实现，这个抽象类表示所有的一个汽车装饰器
@interface CarDecorator : Car
@property (nonatomic, strong) Car* car;
-(instancetype)initWithCar:(Car*)car;
@end

NS_ASSUME_NONNULL_END

#import "CarDecorator.h"
//这里是这个抽象类的一个具体实现
@implementation CarDecorator
- (instancetype)initWithCar:(Car *)car {
    if ([super init]) {
        self.car = car;
    }
    return self;
}
- (void)startEngine {
    [self.car startEngine];
}
@end
//下面是一个具体某一类别的实现：
#import "CarDecorator.h"

NS_ASSUME_NONNULL_BEGIN

@interface ElectricCarDecorator : CarDecorator
-(void)autoParking;
@end

NS_ASSUME_NONNULL_END
#import "ElectricCarDecorator.h"

@implementation ElectricCarDecorator
-(void)autoParking { // 创建一个新的方法用于实现我们的一个自动泊车
    NSLog(@"Auto Parking");
}
- (void)startEngine { //在这里重写父类的方法，让这个方法在实现我们想要的自动泊车功
    [super startEngine];
    [self autoParking];
}
@end
```

这上面的我们创建了一个新的抽象类来执行他新的一个方法，然后在子类中重写有关于父类的一个方法，既保证了代码不会被修改的同时，实现了一个新的功能，这就体现出了我们的一个开闭原则。

## 三、里氏替换原则 (Liskov Substitution Principle - LSP)

**定义：** 子类型必须能够替换它们的父类型而不引起程序错误

**关键思想：** 
1. 子类型必须能够替代基类型，而程序的行为不会发生变化。
2. 子类型应该继承基类型的行为，并且能够按照期望使用。

**注意点：** 子类不应强化前置条件或弱化后置条件

这里我们可以看出这项原则一个核心是为来保证类的一个扩展是不会给已经存在的系统引入新的错误，防止我们采用多态的时候出现一个代码上的问题。

下面给出一个经典的长方形不是正方形的一个例子：

``` swift
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol Shape <NSObject>
- (NSInteger)calculateArea; //定义一个协议方法，也就是一个公共的接口
@end

NS_ASSUME_NONNULL_END

#import <Foundation/Foundation.h>
#import "Shape.h"
NS_ASSUME_NONNULL_BEGIN

@interface Squre : NSObject<Shape> //实现一个正方形类来实现对应的接口的内容
@property (nonatomic, assign) NSInteger length;
@end

NS_ASSUME_NONNULL_END

#import "Squre.h"

@implementation Squre
- (NSInteger)calculateArea {
    return self.length * self.length;
}
@end
  
#import "Shape.h"
#import <Foundation/Foundation.h>
NS_ASSUME_NONNULL_BEGIN

@interface Rectangle : NSObject<Shape> //实现长方形类来实现对应接口的内容
@property (nonatomic, assign) NSInteger width;
@property (nonatomic, assign) NSInteger height;
@end

NS_ASSUME_NONNULL_END

#import "Rectangle.h"

@implementation Rectangle
- (NSInteger)calculateArea {
    return self.width * self.height;
}
@end
```

这里我们把长方形和正方形分成两个不同的类别遵循不同的协议，这样才不会出现里氏替换原则中将正方形替换成长方形，然后设置长宽出现与预期的结果实际不符的一个情况。

## 四、接口隔离原则 (Interface Segregation Principle - ISP)

**定义：** 一个类不应该被迫依赖它们不使用的接口。具体来说，一个类对其他类的依赖关系应该建立在最小的接口集上。

**关键点：**
1. 一个类不应该被迫依赖它不使用的接口。
2. 客户端不应该被迫依赖它不使用的方法。

**优点：** 这两点意味着接口设计应该精简，只包含客户端需要的方法，避免将不相关的方法强行放在同一个接口中。减少不必要的依赖，提高系统灵活性。

这里我们举一个例子：假设我们设计一个多功能设备，里面可能包含了打印机和扫描仪，但是一般的设备可能不具备对应的一个扫描的一个功能，但是如果这个类遵循这个协议就会导致对应的一个问题，实现了一个他不具备的一个功能。

下面是一个小而专的接口：

``` swift
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol Printable <NSObject> //设置打印的接口
- (void) printDoucment;
@end

NS_ASSUME_NONNULL_END

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol Scanabel <NSObject> //设置扫描的接口
-(void) scanDoucment;
@end

NS_ASSUME_NONNULL_END
  
#import <Foundation/Foundation.h>
#import "Printable.h"
NS_ASSUME_NONNULL_BEGIN

@interface Printer : NSObject <Printable> //普通打印机的一个实现，如果是多功能则多遵循一个协议就可以了，

@end

NS_ASSUME_NONNULL_END

  
#import "Printer.h"

@implementation Printer
-(void)printDoucment {
    NSLog(!"common Printer");
}
@end
```

## 五、依赖倒置原则 (Dependency Inversion Principle - DIP)

**定义：**
1. 高层模块不应该依赖于低层模块，两者都应该依赖于抽象。
2. 抽象不应该依赖于细节，细节应该依赖于抽象。

**关键点：**
1. 高层次的模块（例如业务逻辑）不应该依赖于低层次的模块（例如具体实现），两者都应该依赖于抽象（接口或抽象类）。
2. 抽象不应该依赖于具体的实现，具体的实现应该依赖于抽象。

**实现方式：** 使用依赖注入和控制反转(IoC)

例子：

``` swift
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol LoggerProtocol <NSObject> // 一个抽象的接口
-(void) log:(NSString*)message;
@end

NS_ASSUME_NONNULL_END

#import <Foundation/Foundation.h>
#import "LoggerProtocol.h"
NS_ASSUME_NONNULL_BEGIN

@interface Logger : NSObject<LoggerProtocol> //这里是我们的一个具体的底层实现端
@end

NS_ASSUME_NONNULL_END

#import "Logger.h"

@implementation Logger
- (void)log:(NSString*)message { // 底层实现一个抽象
    NSLog(@"1234 %@", message);
}
@end

#import <Foundation/Foundation.h>
#import "Logger.h"
NS_ASSUME_NONNULL_BEGIN

@interface MyClass : NSObject // 这里是我们的高层调用端
@property (nonatomic, strong) id<LoggerProtocol> logger; //高层调用这个接口
@end

NS_ASSUME_NONNULL_END

//使用的时候我们通过下面的方法来实现：
//  MyClass.logger = [[Logger alloc] init];在这里进行一个依赖注入
//  [MyClass.logger log:@"123"];
```

## 六、迪米特法则/最少知识原则 (Law of Demeter/Least Knowledge Principle - LoD)

迪米特原则（Law of Demeter，LoD），也被称为最少知识原则（Principle of Least Knowledge，PLK）或者直接调用原则（Least Knowledge for Law of Demeter，LKP），是面向对象设计中的一个原则，其核心思想是降低类之间的耦合度，减少对象之间的相互依赖。

**定义：**
一个对象应该对其他对象保持最少的了解。
具体来说，一个类不应该直接调用其他类的内部方法，而是通过它自己的方法或者通过传递给它的对象来完成某项操作。

**关键点：**
1. 一个对象应该对其他对象有最少的了解。
2. 类与类之间应该尽量减少耦合。
3. 不要直接访问其他对象的内部成员，而应该通过该对象提供的公共方法来进行间接访问。

**规则：**
* 只调用属于自身的方法
* 只调用作为参数传入的对象的方法
* 只调用创建的对象的方法
* 只调用自身持有的对象的方法

直接调用原则的另一个表达方式是：**只与直接的朋友通信。**

类之间只要有耦合关系，就叫朋友关系。耦合分为依赖、关联、聚合、组合等。我们称出现为**成员变量、方法参数、方法返回值**中的类为直接朋友。**局部变量、临时变量**则不是直接的朋友。

这里我们以购物车为例子：一个人去超市买东西主要分成三个部分，一个是我们的用户，一个是购物车，一个是商品，这里面我们如果要符合这个设计原则的话，这里的人应该和购物车进行交互，然后购物车和商品进行一个交互，这样符合我们的迪米特法则。

下面给出一段代码示例：

``` swift 
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Product : NSObject // 这个是商品
@property (nonatomic, assign) CGFloat price;
@property (nonatomic, strong) NSString* name;
@end

NS_ASSUME_NONNULL_END
  
#import <Foundation/Foundation.h>
@class Product;
NS_ASSUME_NONNULL_BEGIN

@interface ShopCart : NSObject // 这个是购物车
@property (nonatomic, strong) NSMutableArray<Product*>* products;
-(void) addProduct:(Product*)product;
@end

NS_ASSUME_NONNULL_END

#import "ShopCart.h"

@implementation ShopCart //与商品发生直接关系
- (void)addProduct:(Product *)product {
    [self.products addObject:product];
}
@end

#import <Foundation/Foundation.h>
@class ShopCart;
@class Product;
NS_ASSUME_NONNULL_BEGIN

@interface User : NSObject //用户
@property (nonatomic, strong) ShopCart* shopCart;
-(void)addToCart:(Product*)product;
@end

NS_ASSUME_NONNULL_END
  
#import "User.h"
#import "ShopCart.h"
@implementation User
- (void)addToCart:(Product *)product {
    [self.shopCart addProduct:product]; // 与购物车发生直接关系
}
@end
```

## 参考资料

1、[【iOS】设计模式的六大原则](https://blog.csdn.net/qq_73106050/article/details/144158234)

2、[程序设计-六大设计原则](https://blog.csdn.net/qq_45165610/article/details/136027921)