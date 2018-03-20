import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    try:
        SECRET_KEY = os.environ['SECRET_KEY']
        MONGO_URI = os.environ['MONGODB_URI']
        MONGO_DBNAME = MONGO_URI.split('/')[-1]
    except KeyError:
        MONGO_URI = 'mongodb://db:27017/bcmd-web'
        MONGO_DBNAME = 'bcmd-web'

    try:
        BASIC_AUTH_USERNAME = os.environ['ADMIN_USER']
        BASIC_AUTH_PASSWORD = os.environ['ADMIN_PASS']
    except KeyError:
        BASIC_AUTH_USERNAME = "LOCAL_USER"
        BASIC_AUTH_PASSWORD = "LOCAL_PASSWORD"

class ProductionConfig(Config):
    DEBUG = False



class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True

class DockerConfig(StagingConfig):
    HOST = '0.0.0.0'
