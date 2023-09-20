# use latest Node LTS (Boron)
FROM gcr.io/cloud-builders/npm:node-8.11.0
# install Firebase CLI

RUN npm install -g firebase-tools
RUN npm install --save firebase-functions@latest
ENTRYPOINT ["/usr/local/bin/firebase"]