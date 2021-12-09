FROM nikolaik/python-nodejs:python3.8-nodejs16
COPY . /application
WORKDIR /application
RUN pip install frictionless==4.22.3
RUN npm install --production
RUN npm build
CMD ["npm start"]
