from qr_code_generator import generate_deep_link, generate_qr_code
import json
import sys


try:
    query_string = json.loads(sys.argv[1])
    deep_link = generate_deep_link(**query_string)
    output_path = "/path/to/save/qr_code.png"

    # Example usage:
    generate_qr_code(deep_link, output_path)
except json.JSONDecodeError:
    print("Invalid JSON input.")
    raise
except Exception as e:
    print(f"An unexpected error occurred: {e}")
    raise