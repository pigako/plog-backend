#!/bin/sh -e
# 권한 주기 
# chmod u+x deploy.sh
# 실행 방법 terminal 에서 
# ./deploy.sh

source config.sh

echo "\x1B[93m[[ get-credentials ]]\x1B[0m"
gcloud container clusters get-credentials ${CLUSTER_NAME} --zone ${ZONE} --project ${PROJECT_ID}

gcloud builds submit --config cloudbuild.yaml --project ${PROJECT_ID} \
--substitutions=_CLOUDRUNSTAMP=${CLOUDRUNSTAMP},_APP_NAME=${APP_NAME},_ZONE=${ZONE},_CLUSTER_NAME=${CLUSTER_NAME},_NAMESPACE=${NAMESPACE}
