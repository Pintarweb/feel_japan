import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def extract_text_from_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as zf:
            xml_content = zf.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # The XML namespace for Word
            WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
            PARA = WORD_NAMESPACE + 'p'
            TEXT = WORD_NAMESPACE + 't'
            
            paragraphs = []
            for paragraph in tree.iter(PARA):
                texts = [node.text for node in paragraph.iter(TEXT) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            
            return '\n'.join(paragraphs)
    except Exception as e:
        return f'Error: {e}'

print('--- Fuji Climbing Itin.docx ---')
print(extract_text_from_docx(r'd:\AntiGravity Project\feeljapan_brochure\public\Draft Brochure\Fuji Climbing Itin.docx'))
print('\n--- Fuji Climbing Quotation.docx ---')
print(extract_text_from_docx(r'd:\AntiGravity Project\feeljapan_brochure\public\Draft Brochure\Fuji Climbing Quotation.docx'))
