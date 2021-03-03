#!/bin/sh
# 권한 주기 
# chmod u+x config.sh
# 실행 방법 terminal 에서 
# ./config.sh

echo "\x1B[93m[[ get config ]]\x1B[0m"

CLOUDRUNSTAMP=`date '+%Y%m%d%H%M%S'`
PROJECT_ID="plog-2021-03-03"
APP_NAME="blog-api"
ZONE="asia-northeast3-b"
REGIONS_NAME="seoul"
CLUSTER_NAME="kubecluster-seoul"
NAMESPACE="default"