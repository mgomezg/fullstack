# Use an official node runtime as a parent image
FROM node:8

RUN mkdir /front

WORKDIR /front

COPY . /front

ENV PATH /front/node_modules/.bin:$PATH

RUN yarn

CMD ["npm", "start"]