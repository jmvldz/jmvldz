# jmvldz.py - main flask file for jmvldz.com
# written by Josh Valdez

# imports
import os, stripe
from flask import Flask, request, render_template

# config
DEBUG = True
PUBLISHABLE_KEY = 'pk_foo'
SECRET_KEY = 'sk_bar'

# stripe config
#stripe_keys = {
#    'secret_key': os.environ['SECRET_KEY'],
#    'publishable_key': os.environ['PUBLISHABLE_KEY']
#}

stripe_keys = {
    'secret_key': 'sk_test_di8yqIu1WG4SS1HnLKmxhHEq',
    'publishable_key': 'pk_test_4favssQkxAyb333FIyM1Ybjr'
}

stripe.api_key = stripe_keys['secret_key']

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

@app.route('/payment')
def payment():
    return render_template('payment.html', key=stripe_keys['publishable_key'])

@app.route('/charge', methods=['POST'])
def charge():
    # amount in cents
    amount = 500

    customer = stripe.Customer.create(
        email = 'customer@example.com',
        card = request.form['stripeToken'])

    charge = stripe.Charge.create(
        customer = customer.id,
        amount = amount,
        currency = 'usd',
        description = 'Flask Charge')

    return render_template('charge.html', amount = amount)


# main
if __name__ == '__main__':
    app.run()
