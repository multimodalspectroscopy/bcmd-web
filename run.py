from app import app
import pprint

if __name__ == '__main__':
    try:
        pprint.pprint(app.config)
        app.run(host=app.config['HOST'])
    except AttributeError:
        print("CONFIG.HOST not found")
        app.run()
