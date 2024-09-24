import qrcode
from PIL import Image
import os
import csv
from qr_code_generator.constants import mapping




def bulk_read(data_file, qr_data={}, qr_list = []):
    with open(data_file, mode ='r', encoding='utf-8-sig') as file: 
        csvFile = csv.DictReader(file)
        for row in csvFile:
            data = dict(row)
            for key, value in data.items():
                k = mapping.KEY_MAPPING[key]
                qr_data[k] = value
            qr_list.append(qr_data)
    return qr_list

#  Generate deep link
def generate_deep_link(deep_link):
    params = mapping.DEFAULT_PARAMS.copy()
    params.update(deep_link)
    query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
    # fallback_url = "https://google.com"
    print(f"{mapping.BASE_URL}?{query_string}")
    return f"{mapping.BASE_URL}?{query_string}"

#  Generate QR code with deep link embedded

def generate_qr_code(deep_link, output):
    """
    Generate a QR code from a given deep link.

    Parameters:
    - deep_link (str): The deep link to encode in the QR code.
    - file_name (str): The name of the file to save the QR code image. Default is "qr_code.png".

    Returns:
    - None
    """
    try:
        # load ONDC logo
        logo_path = os.path.join(os.path.dirname(__file__), "assets/ondc-network-vertical.png")

        # Create QR code with deep link embedded
        qr = qrcode.QRCode(
            # version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=8,
            border=4,
        )
        qr.add_data(deep_link)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        qr_img = img.convert("RGBA")

        # # Load the logo image
        logo = Image.open(logo_path)
        logo = logo.convert("RGBA")

        # taking base width
        basewidth = 150

        # adjust image size
        wpercent = (basewidth/float(logo.size[0]))
        hsize = int((float(logo.size[1])*float(wpercent)))
        logo = logo.resize((basewidth, hsize), Image.LANCZOS)

        # # Calculate the position to center the logo on the QR code
        logo_position = ((qr_img.size[0] - logo.size[0]) // 2, (qr_img.size[1] - logo.size[1]) // 2)

        # # Paste the logo onto the QR code
        qr_img.paste(logo, logo_position, logo)


        qr_img.save(output)

    except FileNotFoundError:
        print(f"Logo file not found at: {logo_path}")
        raise
    except Exception as e:
        print(f"Exception at: {e}")
        raise