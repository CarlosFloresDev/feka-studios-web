# Une las pantallas de capturas/_partes en capturas/<nombre>-completa.png
import json
from PIL import Image
for name in ('escritorio', 'movil'):
    meta = json.load(open(f'capturas/_partes/{name}.json'))
    d = meta['dpr']
    out = Image.new('RGB', (meta['vw'] * d, meta['h'] * d))
    for p in meta['parts']:
        out.paste(Image.open(p['f']).convert('RGB'), (0, p['y'] * d))
    out.save(f'capturas/{name}-completa.png', optimize=True)
    print(name, out.size)
