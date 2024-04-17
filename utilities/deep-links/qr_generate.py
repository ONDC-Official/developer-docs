import argparse
import json
import os
from qr_code_generator import generate_deep_link, generate_qr_code, bulk_read

def generate_qr(query_string):
    deep_link = generate_deep_link(query_string)
    output_path = f"./qr_code_generator/output/{(query_string['context.bpp_id']).split('/')[0]}"
    if not os.path.isdir(output_path):
        os.makedirs(output_path, exist_ok=True)
    output_path = f"{output_path}/{query_string['message.intent.provider.id']}.png"

    generate_qr_code(deep_link, output_path)
    return True

try:
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', type=str, help='JSON data')
    parser.add_argument('--file', type=str, help='CSV file')

    args = parser.parse_args()

    if args.data:
        query_string = json.loads(args.data)
        generate_qr(query_string)
    elif args.file:
        for query_string in bulk_read(args.file):
            generate_qr(query_string)
    else:
        parser.print_help()

except json.JSONDecodeError:
    print("Error: Invalid JSON input.")
    raise
except Exception as e:
    print(f"An unexpected error occurred: {e}")
    raise