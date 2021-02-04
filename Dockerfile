FROM 770742559283.dkr.ecr.sa-east-1.amazonaws.com/ruby-base-image:latest

ENV APP_HOME /remindful
ENV RACK_ENV production
ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true
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
