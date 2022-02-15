# untuk nampung container node

FROM node:15.4

WORKDIR /app
# copy package.json ke workdir kita
COPY package.json . 
RUN npm install
# copy semua file  
COPY . .
# jalanin localhost-nya
CMD npm run start:dev