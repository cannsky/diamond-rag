import os
import json

def check_directory(file_path: str):
    directory = os.path.dirname(file_path)

    if not os.path.exists(directory):
        os.makedirs(directory)

def read_file(file_path: str):
    check_directory(file_path)
    
    if not os.path.exists(file_path):
        with open(file_path, "w") as file:
            file.write("")
            return None
    else:
        try:
            with open(file_path, "r") as file:
                return file.read()
        except Exception as e:
            return None

def write_file(file_path: str, content: str):
    check_directory(file_path)

    with open(file_path, "w") as file:
        file.write(content)

def read_json_file(file_path: str):
    check_directory(file_path)
    
    if not os.path.exists(file_path):
        with open(file_path, "w") as file:
            json.dump({}, file)
            return None
    else:
        try:
            with open(file_path, "r") as file:
                return json.load(file)
        except Exception as e:
            return None

def write_json_file(file_path: str, content: dict):
    check_directory(file_path)
    
    with open(file_path, "w") as file:
        json.dump(content, file, indent = 4)