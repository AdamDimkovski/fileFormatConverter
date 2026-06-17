import pytesseract
from docx import Document
from PIL import Image
import os

# Update this to match your Tesseract installation location
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

image_path = "input\\images2.webp"
txt_path = "output\\images.txt"
docx_path = "docx\\doc.docx"

# Convert Image to TXT file
txt = pytesseract.image_to_string(Image.open(image_path))

with open(txt_path, "w") as f:
    f.write(txt)

# Convert TXT file to docx
document = Document()

with open(txt_path, 'r', encoding='cp1252') as file:
    file_content = file.read()

    document.add_paragraph(file_content)
    document.save(docx_path)











