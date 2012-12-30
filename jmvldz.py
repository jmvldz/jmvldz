# jmvldz.py - main flask file for jmvldz.com
# written by Josh Valdez

# imports
import stripe
from flask import Flask, request, render_template

# config
DEBUG = True
PUBLISHABLE_KEY = 'pk_foo'
SECRET_KEY = 'sk_bar'
COMPANY = {'name': 'Joshua Miles Valdez'}

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
def payment():
    amount = '250'
    client = {'name': 'Elliot', 'amount': amount, 'cents': cents(amount),
              'description': 'Amends Website Upgrade'}
    return render_template('payment.html', key =stripe_keys['publishable_key'],
                           client = client, company = COMPANY)

@app.route('/charge')
def charge():
    amount = int(request.form['data-amount'])

    customer = stripe.Customer.create(
        email = 'stoller@stanford.edu',
        card = request.form['stripeToken'])

    charge = stripe.Charge.create(
        customer = customer.id,
        amount = amount,
        currency = 'usd',
        description = request.form['data-description'])

    return render_template('charge.html', amount = amount)


# main
if __name__ == '__main__':
    app.run()
