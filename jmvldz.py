# jmvldz.py - main flask file for jmvldz.com
# written by Josh Valdez

# imports
import stripe, os
from flask import Flask, request, render_template
from flask_flatpages import FlatPages, pygments_style_defs

# config - TODO
COMPANY = {'name': 'Joshua Miles Valdez'}
STRIPE_KEYS_T = { 'secret_key': 'sk_test_di8yqIu1WG4SS1HnLKmxhHEq', 'publishable_key': 'pk_test_4favssQkxAyb333FIyM1Ybjr' }
STOLLER = {'name': 'Elliot', 'amount': '250', 'cents': '25000', 'description': 'Amends Website Upgrade'}

# application
app = Flask(__name__)
app.config.from_pyfile('config/jmvldz.cfg')
pages = FlatPages(app)

# stripe config
STRIPE_KEYS_S = {
    'secret_key': os.environ['SECRET_KEY'],
    'publishable_key': os.environ['PUBLISHABLE_KEY']
}
stripe.api_key = STRIPE_KEYS_S['secret_key']

# helper functions
def cents(amount):
    return amount + '00'

# routes
@app.route('/')
def show_index():
    return render_template('portfolio/index.html')

@app.route('/mind')
def show_vis():
    return render_template('portfolio/retweet_network.html')

@app.route('/stoller')
def stoller():
    return render_template('payments/payment.html', key = STRIPE_KEYS_S['publishable_key'],
                           client = STOLLER, company = COMPANY)

@app.route('/mt')
def mt():
    return render_template('mt/index.html')

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

    return render_template('payments/charge.html', client = STOLLER)

@app.route('/pygments.css')
def pygments_css():
    return pygments_style_defs('monokai'), 200, {'Content-Type': 'text/css'}

@app.route('/log')
def logs():
    # Articles are pages with a publication date
    articles = (p for p in pages if 'published' in p.meta)
    # Show the 10 most recent articles, most recent first.
    latest = sorted(articles, reverse=True,
                    key=lambda p: p.meta['published'])
    return render_template('log/articles.html', articles=latest[:10])

@app.route('/marketing')
def marketing():
    return render_template('log/marketing-narrow.html')

@app.route('/spin')
def spin():
    return render_template('spin/index.html')

@app.route('/profile.html')
def profile():
    return render_template('spin/profile.html')

@app.route('/home.html')
def home():
    return render_template('spin/home.html')

# main
if __name__ == '__main__':
    app.run()
