FROM node:latest

ENV PROJECT_ROOT=$HOME/sequelize-boilerplate

COPY ./ $PROJECT_ROOT

WORKDIR $PROJECT_ROOT

RUN npm install -s

EXPOSE 8080

CMD npm run start:prod