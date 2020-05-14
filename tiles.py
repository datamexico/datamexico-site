import json
import requests

for locale in ["en", "es"]:
  r = requests.get("http://localhost:3300/api/tiles?locale={}".format(locale))
  with open("static/tiles/{}.json".format(locale), "w") as file:
    file.write(json.dumps(r.json()))
    file.close()
