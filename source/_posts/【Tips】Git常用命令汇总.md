---
title: 【Tips】Git常用命令汇总
date: 2022-12-08 08:46:58
tags:
- Tips
categories:
- Tips
---

# Git常用命令汇总

## 常用命令

### git init

```
$ git init 
```

<!-- more -->

在本地新建一个repo，进入一个项目目录，执行git init，会初始化一个repo，并在当前文件夹下创建一个.git文件夹。

### git add

```
$ git add README
```

在提交之前, Git有一个`暂存区(staging area)`,可以放入新添加的文件或者加入新的改动, commit时提交的改动是上一次加入到staging area中的改动, 而不是我们`disk`上的改动。`git add .`会递归地添加当前工作目录中的所有文件.

### git commit

```
$ git commit -m "first commit"
$ git commit -a
$ git commit --amend
```

>提交已经被add进来的改动。

`git commit -m “the commit message"`
`git commit -a` 会先把所有已经`track`的文件的改动add进来，然后提交(有点像svn的一次提交，不用先暂存)。对于没有track的文件，还是需要`git add`一下。
`git commit --amend` 增补提交，会使用与当前提交节点相同的父节点进行一次新的提交，旧的提交将会被取消。

### git remote

```
$ git remote
$ git remote -v
$ git remote add [alias] [url]
$ git remote rm [alias]
$ git remote rename [old-alias] [new-alias]
$ git remote set-url [alias] [url]
```

>**`git remote`: list，add and delete remote repository aliases。
因为不需要每次都用完整的url，所以Git为每一个remote repo的url都建立一个别名，然后用git remote来管理这个list。**

`git remote`：列出remote aliases。
如果你clone一个project，Git会自动将原来的url添加进来，别名就叫做: origin。
`git remote -v`：可以看见每一个别名对应的实际url。
`git remote add [alias] [url]`： 添加一个新的remote repo。
`git remote rm [alias]`： 删除一个存在的remote alias。
`git remote rename [old-alias] [new-alias]`： 重命名。
`git remote set-url [alias] [url]`：更新url，可以加上—push和fetch参数，为同一个别名set不同的存取地址。

### git branch

```
$ git branch -v
$ git branch
$ git branch [branch-name]
$ git branch -d [branch-name]
$ git branch -D [branch-name]

```

>**git branch，可以用来列出分支，创建分支和删除分支。**

`git branch -v`： 可以看见每一个分支的最后一次提交。
`git branch`： 列出本地所有分支，当前分支会被星号标示出。
`git branch [branch-name]`: 创建一个新的分支(当你用这种方式创建分支的时候，分支是基于你的上一次提交建立的)。 
`git branch -d [branch-name]`: 删除指定分支。（*查看哪些分支已被并入当前分支，清单中带有`*`字符的表示当前所在的分支。一般来说，列表中没有`*`的分支通常都可以用 `git branch -d` 来删掉。对于未合并的分支，用 git branch -d 删除该分支会导致失败。不过，如果你坚信你要删除它，可以用大写的删除选项 `git branch -D` 强制执行*）

### git checkout

```
$ git checkout [branch-name]
$ git checkout -b [branch-name]
$ git checkout --<filename>
```

`git checkout [branch-name]` ： 切换到一个分支。
`git checkout -b [branch-name]`：创建并切换到新的分支。这个命令是将 `git branch newbranch` 和 `git checkout newbranch` 合在一起的结果。

checkout 还有另一个作用：替换本地改动。

`git checkout --<filename>`：此命令会使用HEAD中的最新内容替换掉你的工作目录中的文件，已添加到暂存区的改动以及新文件都不会受到影响。

<font color=#FF0000>**注意: git checkout filename 会删除该文件中所有没有暂存和提交的改动,这个操作是不可逆的.**</font>

### git merge

```
$ git merge [alias]/[branch]
```

>**git merge，把一个分支merge进当前的分支。**

`git merge [alias]/[branch]`：把远程分支merge到当前分支。

如果出现冲突，需要手动修改，可以用`git mergetool`。解决冲突的时候可以用到`git diff`，解决完之后用`git add`添加，即表示冲突已经被resolved。

### git push

```
$ git push [alias] [branch]
```
>**push your new branches and data to a remote repository aliases.**

`git push [alias] [branch]` ：将会把当前分支 merge 到 [alias] 上的 [branch] 分支。如果分支已经存在，将会更新，如果不存在，将会添加这个分支。

如果有多个人向同一个 `remote repo` push代码， Git会首先在你试图 push 的分支上运行 git log，检查它的历史中是否能看到 server 上的 branch 现在的 tip，如果本地历史中不能看到server的tip，说明本地的代码不是最新的，Git会拒绝你的push，让你先`fetch + merge (pull)`，之后再 push，这样就保证了所有人的改动都会被考虑进来。

### git pull

```
$ git pull
```

>**fetch from a remote repo and try to merge into the current branch. 
pull == fetch + merge FETCH_HEAD**

`git pull`：会首先执行`git fetch`，然后执行`git merge`，把取来的分支的 head `merge` 到当前分支。这个 merge 操作会产生一个新的commit。    
如果使用`--rebase`参数，它会执行`git rebase`来取代原来的`git merge`。

### git clone

```
$ git clone [url]
$ git clone [url] [newname]
```

`git clone [url]`：获取一个url对应的远程Git repo， 创建一个local copy。

clone下来的repo会以url最后一个斜线后面的名称命名,创建一个文件夹，如果想要指定特定的名称，可以`git clone [url] newname`指定。

### git tag

```
git tag v1.0
git tag -a v1.0
git push -v origin refs/tags/0.1.0
```

>**tag a point in history as import.**

`git tag v1.0`，会在一个提交上建立永久性的书签，通常是发布一个release版本或者ship了什么东西之后加tag。

`git tag -a v1.0`, -a 参数会允许你添加一些信息，即make an annotated tag。当你运行git tag -a命令的时候，Git会打开一个编辑器让你输入tag信息。

`git push -v origin refs/tags/0.1.0`， 推送标签至远端。
     
我们可以利用commit SHA来给一个过去的提交打tag:
`git tag -a v0.9 XXXX`

push的时候是不包含tag的，如果想包含，可以在push时加上`--tags`参数。

fetch的时候，branch HEAD可以reach的tags是自动被fetch下来的，tags that aren’t reachable from branch heads will be skipped。如果想确保所有的tags都被包含进来，需要加上`--tags`选项。
