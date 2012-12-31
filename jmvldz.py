# jmvldz.py - main flask file for jmvldz.com
# written by Josh Valdez

# imports
import stripe, os
from flask import Flask, request, render_template

# config
DEBUG = True
COMPANY = {'name': 'Joshua Miles Valdez'}

# stripe config
STRIPE_KEYS_T = {
    'secret_key': 'sk_test_di8yqIu1WG4SS1HnLKmxhHEq',
    'publishable_key': 'pk_test_4favssQkxAyb333FIyM1Ybjr'
}

STRIPE_KEYS_S = {
    'secret_key': os.environ['SECRET_KEY'],
    'publishable_key': os.environ['PUBLISHABLE_KEY']
}

stripe.api_key = STRIPE_KEYS_S['secret_key']

# payments
STOLLER = {'name': 'Elliot', 'amount': '250', 'cents': '25000',
            'description': 'Amends Website Upgrade'}


# application
app = Flask(__name__)
app.config.from_object(__name__)

# helper functions
def cents(amount):
    return amount + '00'

# routes
@app.route('/')
def show_index():
    return render_template('index.html')

@app.route('/mind')
def show_vis():
    return render_template('retweet_network.html')

@app.route('/stoller')
def stoller():
    return render_template('payment.html', key = STRIPE_KEYS_S['publishable_key'],
                           client = STOLLER, company = COMPANY)

@app.route('/charge', methods = ['POST'])
def charge():
    customer = stripe.Customer.create(
        email = 'stoller@stanford.edu',
        card = request.form['stripeToken'])

    charge = stripe.Charge.create(
        customer = customer.id,
        amount = STOLLER['cents'],
        currency = 'usd',
        description = STOLLER['description'])

    return render_template('charge.html', client = STOLLER)


# main
if __name__ == '__main__':
    app.run()
