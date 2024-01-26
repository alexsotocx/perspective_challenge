# .devcontainer/Dockerfile
FROM ubuntu:22.04

RUN apt update && export DEBIAN_FRONTEND=noninteractive \
		&& apt install -y --no-install-recommends \
		ca-certificates \
		curl \
		git \
		python3 \
		unzip \
		zip \
		wget \
		neovim \
		&& apt-get clean && rm -rf /var/lib/apt/lists/*

# Install nvm and node
ENV NODE_VERSION 18

ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR && \
          curl https://raw.githubusercontent.com/creationix/nvm/v0.39.7/install.sh | bash 

RUN /bin/bash -c ". $NVM_DIR/nvm.sh \
 && nvm install v$NODE_VERSION \
 && nvm alias default v$NODE_VERSION \
 && npm install -g yarn" \
 && ln -s $NVM_DIR/versions/node/v$NODE_VERSION/bin/node /usr/local/bin/node \
 && ln -s $NVM_DIR/versions/node/v$NODE_VERSION/bin/npm /usr/local/bin/npm \
 && ln -s $NVM_DIR/versions/node/v$NODE_VERSION/bin/yarn /usr/local/bin/yarn

