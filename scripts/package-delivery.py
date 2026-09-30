"""Refresh the complete source listing and downloadable delivery archives."""
from pathlib import Path
import zipfile
files = [Path(n) for n in ['index.html', 'package.json', 'vite.config.js', 'netlify.toml', '.gitignore', '.env.example', 'PORTRAIT.md']]
files += sorted(Path('src').glob('*')) + sorted(Path('scripts').glob('*.js')) + sorted(Path('scripts').glob('*.py'))
files += [p for p in sorted(Path('public').rglob('*')) if p.is_file() and p.suffix in ['.svg', '.xml', '.txt', '.json', '.md']]
if Path('LOGO-SOURCES.md').exists(): files.append(Path('LOGO-SOURCES.md'))
lang = {'.html':'html','.js':'javascript','.css':'css','.json':'json','.svg':'xml','.xml':'xml','.toml':'toml','.py':'python'}
with Path('SOURCE.md').open('w') as out:
    out.write('# Complete authored source\n\nAll implementation files are included below. Binary assets and the dependency lockfile are included in the source archive. See README.md for setup and deployment.\n\n')
    for p in files:
        out.write(f'## {p}\n\n```{lang.get(p.suffix,"text")}\n{p.read_text().rstrip()}\n```\n\n')
Path('artifacts').mkdir(exist_ok=True)
with zipfile.ZipFile('artifacts/yaseen-portfolio-source.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for p in files + [Path('README.md'), Path('SOURCE.md'), Path('package-lock.json')] + [p for p in Path('public').rglob('*') if p.is_file() and p.suffix not in ['.svg','.xml','.txt','.json','.md']]:
        z.write(p, p)
with zipfile.ZipFile('artifacts/yaseen-portfolio-dist.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for p in Path('dist').rglob('*'):
        if p.is_file(): z.write(p, p.relative_to('dist'))
