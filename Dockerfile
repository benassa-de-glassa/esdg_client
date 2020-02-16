FROM node:13.8.0-alpine3.10

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install react-scripts@3.4.0 -g

COPY . /app

# start app
CMD ["npm", "start"]