from flask import Flask
from flask import render_template, redirect,url_for
from flask import request

app = Flask(__name__)

@app.route('/')
def ShowSomething():
	return render_template('welcome.html')

@app.route('/login', methods=['POST','GET'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username']=='admin' and request.form['password']=='112211':
            return redirect(url_for('home',username=request.form['username']))
        else:
            error = 'Invalid username/password'
    return render_template('test_login.html', error=error)

@app.route('/home')
def home():
    return render_template('test_home.html', username=request.args.get('username'))

if __name__ == '__main__':
    app.debug = True
    app.run('0.0.0.0',80)