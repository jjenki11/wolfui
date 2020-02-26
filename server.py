
import json
import urllib.request
from flask import Flask, request
from flask_cors import CORS
import os
from pathlib import Path

PORT=1337

app = Flask('main')
CORS(app)

@app.route("/test", methods=["GET"])
def test():
    return json.dumps({"status":"ready"})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=PORT)
