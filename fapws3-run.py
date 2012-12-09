import fapws._evwsgi as evwsgi
from fapws import base

from jmvldz import app

evwsgi.start('127.0.0.1', '5000')
evwsgi.set_base_module(base)

evwsgi.wsgi_cb(('/', app))
evwsgi.set_debug(0)
evwsgi.run()
