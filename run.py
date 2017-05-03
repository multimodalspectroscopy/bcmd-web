from app import app

if __name__ == '__main__':
    try:
        print(app.config.HOST)
        app.run(host=app.config.HOST)
    except AttributeError:
        app.run()
