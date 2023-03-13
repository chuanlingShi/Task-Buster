from flask import Flask, render_template, request, url_for, redirect, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, current_user, UserMixin, logout_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, Email, EqualTo
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-goes-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'
login_manager.login_message_category = 'warning'

csrf = CSRFProtect(app)
app.config['WTF_CSRF_CHECK_DEFAULT'] = False


class Users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=50)])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')


class SignupForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=50)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = StringField('Password')
    confirm_password = StringField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/note')
def note():
    return render_template('note.html')


@app.route('/project')
def project():
    return render_template('project.html')


@csrf.exempt
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = Users.query.filter_by(username=username).first()
        if user and user.password == password:

            login_user(user)
            print('You have been logged in!', 'success')
            return redirect(url_for('home'))
        else:

            print('Login failed. Please check your username and password.', 'danger')
    else:
        print(form.errors)
    return render_template('login.html', form=form)


@app.route('/signup', methods=['GET', 'POST'])
@csrf.exempt
def signup():
    form = SignupForm()

    if form.validate_on_submit():

        username = form.username.data
        email = form.email.data
        password = form.password.data

        user = Users.query.filter((Users.username == username) | (Users.email == email)).first()
        if user:
            print('Username or email has already been registered.', 'danger')
            return redirect(url_for('signup'))

        user = Users(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()

        print('Your account has been created successfully. Please log in.', 'success')
        return redirect(url_for('login'))
    else:
        print(form.errors)
    return render_template('signup.html', form=form)


@app.route('/home')
def dashboard():
    if not current_user.is_authenticated:
        flash('Please log in to access this page.', 'warning')
        return redirect(url_for('login'))
    return render_template('home.html')


from flask import make_response


@app.route('/logout')
def logout():
    logout_user()
    response = make_response(redirect(url_for('login')))
    response.set_cookie('username', '', expires=0)
    return response


if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug=True)
