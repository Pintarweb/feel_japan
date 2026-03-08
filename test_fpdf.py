import sys

def go():
    lines = []
    with open("d:/AntiGravity Project/feeljapan_brochure/generate_brochure.py", "r", encoding="utf-8") as f:
        src = f.read()
    
    # We want to use regex or just eval the sections
    import ast
    # let's write a simple matcher since ast might be overkill, actually we have access to it directly
    
    import re
    # Just run the parts of the code we need:
    from fpdf import FPDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('helvetica', '', 11)
    
    with open("d:/AntiGravity Project/feeljapan_brochure/generate_brochure.py", "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    for x in lines:
        if "multi_cell(0, 6" in x:
            print("trying line", x.strip())
            # test this line inside generate_brochure context
            
go()
