FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm ci
# If you are building your code for production
# RUN npm ci --only=production


EXPOSE 80
CMD [ "npm", "start" ]