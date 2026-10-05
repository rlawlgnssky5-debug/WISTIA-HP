"""Lossy web delivery copies of approved generated artwork, no visual edits"""
import json
import os
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'assets/img/studio-3d/manifest.json').read_text(encoding='utf-8'))
proof = root / 'tests/qa/studio-3d-sources'
proof.mkdir(parents=True, exist_ok=True)
codex_runtime_dir = Path(os.environ.get('CODEX_HOME', Path.home() / '.codex'))
for item in manifest['assets']:
    source = codex_runtime_dir / manifest['source_directory'] / item['source']
    if not source.is_file():
        raise FileNotFoundError(source)
    original = proof / (item['name'] + '.png')
    if not original.exists():
        original.write_bytes(source.read_bytes())
    with Image.open(source) as picture:
        picture.thumbnail((512, 512) if item['transparent'] else (1280, 720), Image.Resampling.LANCZOS)
        picture.save(root / item['output'], 'WEBP', quality=88, method=6, exact=True)
        print(item['name'], picture.size, (root / item['output']).stat().st_size)
