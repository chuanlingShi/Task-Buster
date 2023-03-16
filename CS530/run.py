from flask import Flask, render_template, request, url_for, redirect, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, current_user, UserMixin, logout_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, Email, EqualTo
from flask_wtf.csrf import CSRFProtect
from flask import make_response
import sqlite3

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-goes-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_BINDS'] = {'todo': 'sqlite:///todo.db'}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'
login_manager.login_message_category = 'warning'

csrf = CSRFProtect(app)
app.config['WTF_CSRF_CHECK_DEFAULT'] = False


class Card(db.Model):
    __bind_key__ = 'todo'
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)


@app.route('/save-card', methods=['POST'])
def save_card():
    data = request.get_json()
    title = data['title']
    description = data['description']
    user_id = current_user.id
    status = data['status']
    task_id = data['id']

    card = Card.query.filter_by(id=task_id).first()
    if card:
        card.title = title
        card.description = description
        card.status = status
        db.session.commit()
        message = 'Card updated successfully!'
    else:
        card = Card(title=title, description=description, user_id=user_id, status=status, id=task_id)
        db.session.add(card)
        db.session.commit()
        message = 'Card created successfully!'

    return jsonify({'message': message})


@app.route('/delete-card', methods=['POST'])
def delete_card():
    data = request.get_json()
    card_id = data['id']

    card = Card.query.filter_by(id=card_id).first()
    if card:
        db.session.delete(card)
        db.session.commit()
        message = 'Card deleted successfully!'
    else:
        message = 'Card not found!'

    return jsonify({'message': message})


@app.route('/get-tasks')
def get_tasks():
    user_id = current_user.id
    todo_list = Card.query.filter_by(user_id=user_id).all()
    tasks = {}
    for card in todo_list:
        task = {
            'id': card.id,
            'title': card.title,
            'description': card.description,
            'status': card.status
        }
        if card.status in tasks:
            tasks[card.status].append(task)
        else:
            tasks[card.status] = [task]
    return jsonify(tasks)


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


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


@app.route('/')
def home():
    if not current_user.is_authenticated:
        flash('Please log in to access this page.', 'warning')
        return redirect(url_for('login'))
    return render_template('home.html')


@app.route('/note', methods=['POST', 'GET'])
def note():
    if not current_user.is_authenticated:
        flash('Please log in to access this page.', 'warning')
        return redirect(url_for('login'))
    if request.method == 'POST':
        note_content = request.form['inputField']
        note = Note(content=note_content, user_id=current_user.id)
        try:
            db.session.add(note)
            db.session.commit()
            return redirect(url_for('note'))
        except:
            return 'There was a problem adding that note.'
    else:
        notes = Note.query.filter_by(user_id=current_user.id).all()
    return render_template('note.html', notes=notes)


@app.route('/delete_note/<int:id>')
def delete(id):
    note_to_delete = Note.query.get_or_404(id)

    try:
        db.session.delete(note_to_delete)
        db.session.commit()
        return redirect(url_for('note'))
    except:
        return 'There was a problem deleting that note.'


@app.route('/project', methods=['GET'])
def project():
    if current_user.is_authenticated:
        lists = Card.query.with_entities(Card.status.distinct()).filter_by(
            user_id=current_user.id).all()
        status_list = [status[0] for status in lists]
        return render_template('project.html', lists=status_list)
    else:
        return redirect(url_for('login'))


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
            flash('You have been logged in!', 'success')
            return redirect(url_for('home'))
        else:

            flash('Login failed. Please check your username and password.', 'danger')
    else:
        flash(form.errors)
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
            flash('Username or email has already been registered.', 'danger')
            return redirect(url_for('signup'))

        user = Users(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()

        flash('Your account has been created successfully. Please log in.', 'success')
        return redirect(url_for('login'))
    else:
        flash(form.errors)
    return render_template('signup.html', form=form)


@app.route('/logout')
def logout():
    logout_user()
    response = make_response(redirect(url_for('login')))
    response.set_cookie('username', '', expires=0)
    return response


with app.app_context():
    db.create_all()


@app.route('/home', methods=['GET', 'POST'])
def dashboard():
    if not current_user.is_authenticated:
        flash('Please log in to access this page.', 'warning')
        return redirect(url_for('login'))
    
    tasks = get_Mytasks()
    return render_template('home.html', tasks=tasks)


@app.route('/get-Mytasks')
def get_Mytasks():
    user_id = current_user.id
    todo_list = Card.query.filter_by(user_id=user_id).filter_by(status='In Progress').all()
    tasks = {}
    for card in todo_list:
        task = {
            'id': card.id,
            'title': card.title,
            'description': card.description,
            'status': card.status
        }
        tasks[card.id] = task
    return jsonify(tasks)





@app.route('/get-notes')
def get_notes():
    # connect to the database
    conn = sqlite3.connect('users.db')
    # retrieve data from the database
    cursor = conn.execute('SELECT * FROM note')
    notes = cursor.fetchall()
    conn.close()
    # return the data in JSON format
    return jsonify(notes)






if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug=True)
