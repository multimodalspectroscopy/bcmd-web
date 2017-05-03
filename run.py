from app import app
import pprint

if __name__ == '__main__':
    try:
        app.run(host=app.config['HOST'])
    except AttributeError:
        app.run()
