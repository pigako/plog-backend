FROM node:14-alpine

# 환경 설정
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# 패키지 파일 복사
COPY package.json .
COPY package-lock.json .

# npm 설치
RUN npm install
RUN npm audit fix

# 앱 소스 추가
COPY ./ .

# Production
RUN npm run build
CMD [ "npm", "run", "start" ]

# Development
# RUN npm install pm2 -g
# CMD ["pm2-runtime", "./app.js"]