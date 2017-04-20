#!/bin/sh
echo "Example: sh build.sh dev|test|production"

RETVAL=0
env=$1

# 环境监察
echo "env: $env"
echo `which node`
echo `which npm`
echo `which cross-env`
echo `which webpack`
echo `which gulp`
echo `which yarn`

nodeBin=`which node`
npmBin=`which npm`
crossBin=`which cross-env`
webpackBin=`which webpack`
gulpBin=`which gulp`
yarnBin=`which yarn`

# 必要的环境检测和安装
if [ -z $nodeBin ]; then
  echo 'Please install nodejs' && exit
fi
if [ -z $crossBin ]; then
  $npmBin install cross-env -g
fi
if [ -z $webpackBin ]; then
  $npmBin install webpack -g
fi
if [ -z $gulpBin ]; then
  $npmBin install gulp -g
fi

# 开发环境
# 此处若需要变更参数，需要更改build/dev-server.js中对应的参数索引
if [ "$env"x = "dev"x ]; then
  npm run dev
  exit
fi

# 检测构建环境
if [ "$env"x != "dev"x ] && [ "$env"x != "test"x ] && [ "$env"x != "production"x ]; then
  echo "Env must be in dev|test|production"
  exit
fi

# 生产环境安装依赖环境
if [ "$env"x = "production"x ]; then
  if [ ! -d "node_modules" ]; then
    echo "Please Install node_modules"
  fi
fi

# 执行build工作
# 执行gulp构建
$gulpBin $env --project
$crossBin NODE_ENV=$env $webpackBin --progress --hide-modules --config ./config/webpack.production.conf.js --display-error-details
$crossBin NODE_ENV=$env npm run production


if [ "$env"x == "production"x ]; then
  # cp -r .bin ./output/
  # cp control.sh build/
fi

RETVAL=$?
exit $RETVAL
