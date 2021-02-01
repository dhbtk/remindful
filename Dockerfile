FROM ruby:3.0.0-alpine

# for build.
# docker build -t cit/staging .

ENV APP_HOME /remindful
ENV RACK_ENV production
ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true

RUN apk --update add \
  build-base \
  nodejs \
  tzdata \
  postgresql-dev \
  libxslt-dev \
  libxml2-dev \
  imagemagick \
  openssl \
  openssh \
  curl \
  jq \
  git \
  less \
  yarn

WORKDIR $APP_HOME
COPY Gemfile Gemfile.lock $APP_HOME/
RUN gem install bundler:2.2.3 \
     && bundle config set without 'development test' \
     && echo "install: --no-rdoc --no-ri \nupdate:  --no-rdoc --no-ri" >> .gemrc \
     && bundle install --jobs 20 --retry 5 --full-index

COPY . $APP_HOME/

RUN yarn install --pure-lockfile

RUN \
 DATABASE_URL=postgresql://nohost \
 REDIS_URL=redis:does_not_exist \
 SECRET_KEY_BASE=not_this_one \
 bundle exec rake assets:precompile
