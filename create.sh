#!/bin/sh
# 권한 주기 
# chmod u+x create.sh
# 실행 방법 terminal 에서 
# ./create.sh

source config.sh

echo "\x1B[93m[[ get-credentials ]]\x1B[0m"
gcloud container clusters get-credentials ${CLUSTER_NAME} --zone ${ZONE} --project ${PROJECT_ID}

kubectl create -f k8s.yaml

./deploy.sh