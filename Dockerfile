FROM nikolaik/python-nodejs:python3.8-nodejs16
COPY . /application
WORKDIR /application
RUN pip install frictionless==4.22.*
RUN npm install
RUN npm run build
ENTRYPOINT ["npm", "start"]
EXPOSE 4040
