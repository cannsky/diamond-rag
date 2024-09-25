from utils import send_streamed_request_to_api
from io import read_file, read_json_file, write_json_file
import json

def generate_text(key, user_prompt, job_id, socketio):
    def generate_prompt(key, user_prompt):
        prompt = read_json_file("prompts/" + key + ".json")
        context_prompt = prompt["prefix"] + user_prompt + prompt["suffix"]
        return context_prompt

    def send_request_to_api(context_prompt, socketio):
        response = send_streamed_request_to_api(prompt = context_prompt, socketio = socketio)
        return response

    def generate_output(key, response, job_id):
        output = read_json_file("outputs/" + key + "/" + str(job_id) + ".json")
        output.append(response)
        write_json_file("outputs/" + key + "/" + str(job_id) + ".json", output)

    context_prompt = generate_prompt(key, user_prompt)
    response = send_request_to_api(context_prompt, socketio)
    generate_output(key, response, job_id)

def generate_image():
    # todo: implement
    return None

def handle_context(context, user_prompt, job):
    actions = {
        "item_generation": lambda: generate_text("item_generation", user_prompt, job.id, job.socketio),
        "memory": lambda: print("Memory"),
    }
    actions.get(context, lambda: print("No context"))()