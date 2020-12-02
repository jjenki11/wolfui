
import json
import urllib.request
from flask import Flask, request
from flask_cors import CORS
import os
from pathlib import Path

from master_server import MasterServer

PORT=1337
app = Flask('main')
CORS(app)

MASTER = 'dpmaster.deathmask.net'
#MASTER = 'wolfmaster.s4ndmod.com'
#MASTER = 'master.iortcw.com'
PORT = 27950

ms = MasterServer(MASTER, PORT)

# /get - gives you all servers and all contents
# /post - gives you only content for server in {'ip':<ip-addr>,'port':<port>} body
@app.route("/status", methods=["GET", "POST"])
def status():
    if request.method == 'POST':
        # maybe make multiple handlers for json to check 
        # - if a player is online and say where they are playing
        d = request.get_json()
        x = ms.query_one(d['ip']+":"+str(d['port']))
    else:
        x = ms.query()

    return json.dumps(x)



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=PORT, use_reloader=False)
