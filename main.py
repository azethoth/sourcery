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

  # get the html and parse it
  html = requests.get(url).content
  soup = BeautifulSoup(html)

  # count the number of tags
  tags = {}
  for tag in soup.findAll():
    count = tags.get(tag.name, 0)
    tags[tag.name] = count + 1

  # convert it into a prettified string and then into a list
  html_string = cgi.escape(soup.prettify())
  html_list = html_string.split('\n')

  response = make_response(json.dumps({'lines': html_list, 'tags': tags}), 200)
  response.headers['Content-type'] = 'application/json'
  return response

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=4242)
