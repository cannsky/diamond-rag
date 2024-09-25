import json
from io import read_json_file, write_json_file

def load_data():
    return read_json_file("data/data.json")

def save_data(data):
    write_json_file("data/data.json", data)

def get_new_job_id():
    data = load_data()
    if data is None:
        data = { "jobCount": 0 }
    job_id = data["jobCount"]
    data["jobCount"] += 1
    save_data(data)
    return job_id