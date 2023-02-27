from flask import (Flask, render_template, request)

app = Flask(__name__)


@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/note')
def note():
    return render_template('note.html')


@app.route('/project')
def project():
    return render_template('project.html')

if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug=True)
