#!/bin/sh
# 권한 주기 
# chmod u+x codetest.sh
# 실행 방법 terminal 에서 
# ./codetest.sh

source config.sh

echo "\x1B[93m[[ get-credentials ]]\x1B[0m"
gcloud container clusters get-credentials ${CLUSTER_NAME} --zone ${ZONE} --project ${PROJECT_ID}
POD_NAME=$(kubectl get pods --selector=app=${APP_NAME} --output=jsonpath={.items..metadata.name} --namespace=${NAMESPACE})
DIR=$(pwd)

date 
echo 'APP_NAME:' $APP_NAME

echo '\x1B[93m[[ Local >> Kube Pod ]]\x1B[0m'
IFS=' ' read -ra PODS <<< "$POD_NAME"
for i in "${PODS[@]}"; do
    kubectl cp ./app $i:/usr/src --namespace=${NAMESPACE}
    kubectl exec $i --namespace=${NAMESPACE} -c $APP_NAME -- pm2 restart 0
done

echo '\x1B[93m[[ Code Uploaded! ]]\x1B[0m'
