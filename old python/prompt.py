import json
from iox import read_file, write_json_file

file_name = input("Enter a file name: ")

prefix_file_path = f"inputs/{file_name}_prefix.txt"
suffix_file_path = f"inputs/{file_name}_suffix.txt"

prompt_prefix = read_file(prefix_file_path)
prompt_suffix = read_file(suffix_file_path)

data = { "prompts": [] }

data["prompts"].append( { "type": "textGeneration", "prefix": prompt_prefix, "suffix": prompt_suffix })

write_json_file(f"prompts/{file_name}.json", data)