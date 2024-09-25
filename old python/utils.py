import requests
import json
from openai import OpenAI

LLM_API_URL = "http://localhost:11434/api/generate"
OPEN_AI_CLIENT = OpenAI(
    organization = "org-DWFpVohWTUZR0nrwM4r1aQ5D",
    project = "proj_719VYmwvi2zE6y4ptmNSjmTN"
)

def convert_json_object(json_string: str):
    json_string = extract_json_string(json_string)

    if json_string:
        try:
            return json.loads(json_string)
        except json.JsonDecodeError as e:
            return None
    else:
        return None

def extract_json_string(json_string: str):
    start = None
    stack = []

    for i, char in enumerate(json_string):
        if char == "{":
            if start is None:
                start = i
            stack.append(char)
        elif char == "}":
            if stack:
                stack.pop()
                if not stack:
                    return json_string[start:i+1]
    
    return None

def find_context(prompt: str):
    find_context_prompt_prefix = read_file("prompts/find_context/find_context_prefix.txt")
    find_context_prompt_suffix = read_file("prompts/find_context/find_context_suffix.txt")

    find_context_prompt = find_context_prompt_prefix + prompt + find_context_prompt_suffix

    response = send_request_to_api(prompt = find_context_prompt)

    response_dictionary = convert_json_object(response)

    return response_dictionary["context"], response_dictionary["user_prompt"], response_dictionary["iteration_count"], response_dictionary["save_memory"]

def send_request(model: str = "gemma2", prompt: str = ""):
    payload = { "model": model, "prompt": prompt, "stream": False }
    headers = { "Content-Type": "application/json" }
    response = requests.post(LLM_API_URL, data = json.dumps(payload), headers = headers)

    if response.status_code == 200:
        return response.json()["response"]
    else:
        return { "error" : "An Error Occured. Error Code: " + response.status_code }

def send_request_to_api(model: str = "gpt-4o-mini", prompt: str = ""):
    stream = OPEN_AI_CLIENT.chat.completions.create(
        model = model,
        messages = [{"role": "user", "content": prompt}],
    )

    return stream.choices[0].message.content

def send_streamed_request(model: str = "gemma2", prompt: str = "", socketio = None):
    payload = { "model": model, "prompt": prompt, "stream": True }
    headers = { "Content-Type": "application/json" }
    response = requests.post(LLM_API_URL, data = json.dumps(payload), headers = headers, stream = True)

    if response.status_code == 200:
        response_data = ""
        for chunk in response.iter_content(chunk_size = 1024):
            try:
                response_data = json.loads(chunk.decode("utf-8"))["response"]
                socketio.emit("stream", { "data": response_data })
            except json.JsonDecodeError as e:
                socketio.emit("stream", { "data": "END_OF_STREAM_DATA" })
    else:
        socketio.emit("stream", { "data": "END_OF_STREAM_DATA" })

    socketio.emit("stream", { "data": "END_OF_STREAM_DATA" })

def send_streamed_request_to_api(model: str = "gpt-4o-mini", prompt: str = "", socketio = None):
    stream = OPEN_AI_CLIENT.chat.completions.create(
        model = model,
        messages = [{"role": "user", "content": prompt}],
        stream = True,
    )

    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            try:
                response_data = chunk.choices[0].delta.content
                socketio.emit("stream", { "data": response_data })
            except json.JsonDecodeError as e:
                socketio.emit("stream", { "data": "END_OF_STREAM_DATA" })
        else:
            socketio.emit("stream", { "data": "END_OF_STREAM_DATA" })

    socketio.emit("stream", { "data": "END_OF_STREAM_DATA" })

def send_image_generation_request_to_api(model: str = "dall-e-3", prompt: str = "", image_size: str = "1024x1024"):
    response = OPEN_AI_CLIENT.images.create(
        model = model,
        prompt = prompt,
        n = 1
        image_size = image_size
    )

    return response.json().data[0]["url"]