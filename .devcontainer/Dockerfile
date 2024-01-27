# .devcontainer/Dockerfile
FROM ubuntu:22.04

RUN apt update && export DEBIAN_FRONTEND=noninteractive \
		&& apt install -y --no-install-recommends \
		build-essential \
		ca-certificates \
		curl \
		git \
		python3 \
		unzip \
		zip \
		wget \
		&& apt-get clean && rm -rf /var/lib/apt/lists/*

# Install nvm and node
ENV NODE_VERSION 18

ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR && \
          curl https://raw.githubusercontent.com/creationix/nvm/v0.39.7/install.sh | bash 

RUN /bin/bash -c ". $NVM_DIR/nvm.sh \
	&& nvm install v$NODE_VERSION \
	&& nvm alias default v$NODE_VERSION \
	&& npm install -g yarn \
	&& ln -s \$(which node) /usr/local/bin/node \
	&& ln -s \$(which npm) /usr/local/bin/npm"

# Install NeoVim
RUN curl -o /tmp/nvim.appimage -L https://github.com/matsuu/neovim-aarch64-appimage/releases/download/v0.9.4/nvim-v0.9.4-aarch64.appimage \
	&& chmod u+x /tmp/nvim.appimage \
	&& /tmp/nvim.appimage --appimage-extract \
	&& mv squashfs-root /opt/nvim \
	&& ln -s /opt/nvim/AppRun /usr/local/bin/nvim \
	&& rm /tmp/nvim.appimage

