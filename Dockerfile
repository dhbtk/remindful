FROM ruby:3.0.2-buster

RUN apt-get update -qq \
 && apt-get -y upgrade --no-install-recommends \
 && apt-get -y --fix-broken install --no-install-recommends \
  apt-transport-https \
  file \
  g++ \
  gcc \
  git \
  gnupg \
  imagemagick \
  libxml2-dev \
  make \
  ruby-dev \
  wget \
  libpq-dev \
  \
 && wget -qO- https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
 && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
 && wget -qO- https://deb.nodesource.com/setup_14.x | bash - \
 && apt-get -y --fix-broken install --no-install-recommends \
  nodejs \
  yarn

ENV APP_HOME /remindful
ENV RACK_ENV production
ENV RAILS_ENV production
ARG MASTER_KEY
ENV RAILS_MASTER_KEY $MASTER_KEY

WORKDIR $APP_HOME
COPY Gemfile Gemfile.lock $APP_HOME/

RUN gem install bundler:2.2.3 \
     && bundle config set without 'development test' \
     && echo "install: --no-rdoc --no-ri \nupdate:  --no-rdoc --no-ri" >> .gemrc \
     && bundle install --jobs 20 --retry 5 --full-index

COPY package.json yarn.lock $APP_HOME/

RUN yarn install --pure-lockfile

COPY . $APP_HOME/

RUN \
 DATABASE_URL=postgresql://nohost \
 REDIS_URL=redis:does_not_exist \
 SECRET_KEY_BASE=not_this_one \
 bundle exec rake assets:precompile
