from flask import Flask, render_template, request

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)


with app.app_context():
    db.create_all()  # 创建所有数据库表


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/home')
def home1():
    return render_template('home.html')


@app.route('/note')
def note():
    return render_template('note.html')


@app.route('/project')
def project():
    return render_template('project.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            return "Passwords do not match!"

        users = Users(username=username, email=email, password=password)
        db.session.add(users)
        db.session.commit()
        users = Users.query.all()
        for user in users:
            print(user.id, user.username, user.email)
        return "User created successfully!"

    return render_template('signup.html')


if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug=True)
