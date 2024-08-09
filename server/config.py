# Standard library imports

# Remote library imports
from flask import Flask, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
#uuid obtained from: import uuid; uuid.uuid4().hex on python shell
app.secret_key = b'6b64a1595dca473d9bf52494ea658e31';
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

bcrypt = Bcrypt(app);

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

#configure the socketIO
#https://flask-socketio.readthedocs.io/en/latest/getting_started.html#initialization
#https://medium.com/@adrianhuber17/how-to-build-a-simple-real-time-application-using-flask-react-and-socket-io-7ec2ce2da977
socketio = SocketIO(app, cors_allowed_origins="*")
