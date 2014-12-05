import requests
import json
import cgi
from bs4 import BeautifulSoup
from flask import Flask
from flask import request, make_response

app = Flask(__name__)

@app.route('/fetch')
def fetch():
  url = request.args.get('url')
  if url and not url.startswith('http'):
    url = 'http://' + url

  html = requests.get(url).content
  soup = BeautifulSoup(html)
  response = make_response(json.dumps({'html': cgi.escape(soup.prettify())}), 200)
  response.headers['Content-type'] = 'application/json'
  return response

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=4242)
