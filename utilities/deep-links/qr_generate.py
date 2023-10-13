import qrcode
import json
import sys

BASE_URL = "beckn://ondc"

DEFAULT_PARAMS = {
    "context.action": "search"
}

#  Generate deep link
def generate_deep_link(**kwargs):
    params = DEFAULT_PARAMS.copy()
    params.update(kwargs)
    query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
    return f"{BASE_URL}?{query_string}"

#  Generate QR code with deep link embedded

def generate_qr_code(deep_link, file_name="qr_code.png"):
    """
    Generate a QR code from a given deep link.

    Parameters:
    - deep_link (str): The deep link to encode in the QR code.
    - file_name (str): The name of the file to save the QR code image. Default is "qr_code.png".

    Returns:
    - None
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(deep_link)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(file_name)


query_string=json.loads(sys.argv[1])
deep_link = generate_deep_link(**query_string)

# Example usage:
generate_qr_code(deep_link)