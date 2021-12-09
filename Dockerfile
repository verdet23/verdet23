FROM node:17.2-bullseye

ENV LANG C.UTF-8

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3=3.9.2-3 \
    python3-pip=20.3.4-4 \
    openjdk-11-jdk=11.0.13+8-1~deb11u1 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install html5validator==0.4.0

RUN npm install -g eslint@8.4.1 && npm install -g eslint-config-jquery@3.0.0 --save && npm install -g ajv-cli@5.0.0

RUN mkdir -p /var/www/gh-pages

WORKDIR /var/www/gh-pages
