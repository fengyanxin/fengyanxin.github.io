#!/bin/bash
DIR=`dirname $0`

echo "=====> Start ! <====="

# Generate blog
hexo clean && hexo generate --config _config.yml,_config.github.yml
hexo clean && hexo generate --config _config.yml,_config.atomgit.yml
sleep 5

# 压缩文件
gulp 
sleep 5

# Deploy
hexo deploy --config _config.yml,_config.github.yml
hexo deploy --config _config.yml,_config.atomgit.yml
sleep 5

echo "=====> Deploy finish! <====="

# Push hexo code
git add .
current_date=`date "+%Y-%m-%d %H:%M:%S"`
git commit -m "【modify】Blog updated: $current_date"

sleep 2

git push origin hexo

echo "=====> Push finish! <====="

echo "=====> End ! <====="
