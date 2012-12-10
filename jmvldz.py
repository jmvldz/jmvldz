# jmvldz.py - main flask file for jmvldz.com
# written by Josh Valdez

# imports
from flask import Flask, request, redirect, url_for, abort, \
    render_template, flash

# config
DEBUG = True

# application
app = Flask(__name__)
app.config.from_object(__name__)

# routes
@app.route('/')
def show_index():
    return render_template('index.html')

@app.route('/mind')
def show_vis():
    return render_template('retweet_network.html')

# main
if __name__ == '__main__':
    app.run()
