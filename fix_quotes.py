with open('/home/mayoni/Documents/Coding/laporan-akrilik/src/App.jsx', 'r') as f:
    content = f.read()

# Replace the double quotes with HTML entity
content = content.replace('Ketuk "Tambah bahan"', 'Ketuk "Tambah bahan"')

with open('/home/mayoni/Documents/Coding/laporan-akrilik/src/App.jsx', 'w') as f:
    f.write(content)