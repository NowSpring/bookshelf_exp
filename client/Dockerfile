# pull official base image
FROM node:20

WORKDIR /usr/src/vite-project

RUN apt-get update && apt-get install -y git

COPY mysite/vite-project/package*.json ./
RUN npm install

COPY mysite/vite-project ./

COPY . .

ENV HOST https://react-frontend-4z2i5enysq-uc.a.run.app

EXPOSE 5173

CMD ["npm", "run", "dev"]