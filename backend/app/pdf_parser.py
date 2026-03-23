import requests
import fitz  # pymupdf
import os


def extract_text_from_pdf(url):
    response = requests.get(url)

    temp_path = "temp.pdf"

    with open(temp_path, "wb") as f:
        f.write(response.content)

    doc = fitz.open(temp_path)

    text = ""
    for page in doc:
        text += page.get_text()

    doc.close()
    os.remove(temp_path)

    return text