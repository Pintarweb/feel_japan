with open('generate_brochure.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('–', '-')

with open('generate_brochure.py', 'w', encoding='utf-8') as f:
    f.write(text)
print("Replaced!")
