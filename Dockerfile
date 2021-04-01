FROM node:14-alpine

# 환경 설정
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# 앱 디렉터리 생성
WORKDIR /usr/src/app

COPY api-account.json .
COPY ./ .

# npm 설치
RUN npm install
RUN npm audit fix

# Production
RUN npm run build
CMD [ "npm", "run", "start" ]