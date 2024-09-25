from utils import find_context
from context import handle_context
from data import get_new_job_id

class Job:
    def __init__(self, prompt, socketio):
        self.prompt = prompt
        self.id = get_new_job_id()
        self.socketio = socketio
    def execute(self):
        context, user_prompt, iteration_count, save_memory = find_context(self.prompt)
        if iteration_count is None:
            iteration_count = 0
        for i in range(iteration_count):
            handle_context(context, user_prompt, self)