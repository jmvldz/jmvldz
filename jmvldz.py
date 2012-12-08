# jmvldz.py - main flask file for jmvldz.com
# written by Josh Valdez

# imports
from flask import Flask, request, g, redirect, url_for, abort, \
    render_template, flash

# config
DEBUG = True

# application
app = Flask(__name__)
app.config.from_object(__name__)

# main
if __name__ == '__main__':
    app.run()
