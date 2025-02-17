---
title: 【Tips】Mac 如何取消 sudo 时输入密码的提示
date: 2025-02-17 09:29:15
tags:
- Tips
categories:
- Tips
---

## 问题描述

由于我想访问 GitHub 速度更快一些，使用了 SwitchHosts 对系统 Hosts 文件进行实时读写，在每一次同步远端文件进行写入时都提示要输入 Sudo 密码。

然后，我就想如何才能不每次都提示。

<!-- more -->

## 解决方案

### 确定自己的用户名

打开终端，使用 `whoami` 命令查看自己的用户名: `<user-account-name>`

``` swift
whoami
```

### 修改 sudoers 文件

1. 得到用户名称后就可以修改权限了

``` swift
% sudo vi /etc/sudoers
Password: 
```

2. 输入密码后修改或增加用户权限

``` swift
# root and users in group wheel can run anything on any machine as any user
<user-account-name>   ALL = (ALL)NOPASSWD:ALL
```

保存即可，下次再用 sudo 命令就无需再输入密码了。