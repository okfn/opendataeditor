FROM nikolaik/python-nodejs:python3.8-nodejs16
COPY . /application
WORKDIR /application
RUN pip install -r requirements
RUN npm install
RUN npm run build
ENTRYPOINT ["npm", "start"]
EXPOSE 4040
