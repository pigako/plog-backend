#!/bin/sh
# 권한 주기 
# chmod u+x logviewer.sh
# 실행 방법 terminal 에서 
# ./logviewer.sh

if [ "$#" -lt 1 ]; then
    echo "\x1B[93m사용예시:\x1B[0m \x1B[92m$0 [Numbers]\x1B[0m"
    echo "\x1B[93m예제코드:\x1B[0m \x1B[92m$0 0\x1B[0m"
    
    exit 1
fi
args=("$@")

source config.sh

echo "\x1B[93m[[ get-credentials ]]\x1B[0m"
gcloud container clusters get-credentials ${CLUSTER_NAME} --zone ${zone} --project ${PROJECT_ID}
POD_NAME=$(kubectl get pods --selector=app=${APP_NAME} --output=jsonpath={.items..metadata.name} --namespace=${NAMESPACE})

echo '[[ Logs Start ]]'

echo '\x1B[93m[[ Local >> Kube Pod ]]\x1B[0m'
IFS=' ' read -ra PODS <<< "$POD_NAME"
idx=0
for i in "${PODS[@]}"; do
    if [ $args == $idx ]; then
        kubectl logs -f $i --namespace=${NAMESPACE}
    fi
    
    ((idx++))
done
