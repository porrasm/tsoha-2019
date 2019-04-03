from flask import render_template
from application import app

@app.route("/", defaults={"path": ''})
@app.route("/<path:path>")
def index(path):
    return render_template("index.html")