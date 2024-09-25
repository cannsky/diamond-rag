from utils import find_context, send_request, send_streamed_request, send_streamed_request_to_api
from job import Job
#from tts import synthesize
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, resources = {r"/*": {"origins": "*"}})

@app.route("/api/messages", methods=["POST"])
def recieve_mesage():
    data = request.get_json()
    message = data.get("message")

    @socketio.on("connect")
    def handle_connect():
        print("Client connected")
    
    @socketio.on("disconnect")
    def handle_disconnect():
        print("Client disconnected")

    job = Job(message, socketio)
    job.execute()

    if message:
        return jsonify({"success": True, "message": "Message recieved"})
    else:
        return jsonify({"success": False, "message": "Message recieved"}), 400

if __name__ == "__main__":
    socketio.run(app, host = "0.0.0.0", port = 7000)

#while True:
    #user_input = input("Enter a prompt: ")

    #job = Job(user_input)
    #job.execute()
    
    # response = send_request(prompt = user_prompt)
    # print(response)
    # synthesize(response)