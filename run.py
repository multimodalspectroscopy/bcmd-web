from app import app

if __name__ == '__main__':
    if app.config['HOST']:
        app.run(host=app.config.HOST)
    else:
        app.run()
