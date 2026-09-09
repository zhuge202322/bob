import json
import re
from pathlib import Path

import pdfplumber
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / '产品'
OUTPUT = ROOT / 'storage' / 'product-pdf-import.json'
IMAGE_DIR = ROOT / 'public' / 'manuals' / 'products'

LANG_CONFIG = {
    'en': {'glob': '*English*.pdf', 'category_count': r'(?P<name>.+?)\s+(?P<count>\d+)\s+products$', 'fields': {'spec': 'Spec.:', 'storage': 'Storage', 'type': 'Type', 'features': 'Features', 'application': 'Application', 'shipping': 'Shipping', 'packaging': 'Packaging'}},
    'zh': {'glob': '*中文*.pdf', 'category_count': r'(?P<name>.+?)\s*[（(](?P<count>\d+)个产品[）)]$', 'fields': {'spec': '规格', 'storage': '储存', 'type': '类型', 'features': '特性', 'application': '应用', 'shipping': '运输', 'packaging': '包装'}},
    'ru': {'glob': '*русском*.pdf', 'category_count': r'(?P<name>.+?)\s+(?P<count>\d+)\s+продукт', 'fields': {'spec': 'Спец.', 'storage': 'Хранение', 'type': 'Тип', 'features': 'Характеристики', 'application': 'Применение', 'shipping': 'Транспортировка', 'packaging': 'Упаковка'}},
}


def clean(value: str) -> str:
    return re.sub(r'\s+', ' ', value or '').strip()


def normalize_category(value: str) -> str:
    return clean(re.sub(r'[·…]+', '', value)).strip(' .')


def find_pdf(pattern: str) -> Path:
    matches = sorted(PDF_DIR.glob(pattern))
    if not matches:
        raise FileNotFoundError(f'No PDF matching {pattern!r} in {PDF_DIR}')
    return matches[0]


def content_level3(path: Path, language: str) -> list[str]:
    """Read the ordered level-3 category list from the two contents pages."""
    config = LANG_CONFIG[language]
    level2_names: set[str] = set()
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages[4:]:
            for raw in (page.extract_text() or '').splitlines():
                line = clean(raw)
                match = re.match(config['category_count'], line, re.I)
                if match:
                    level2_names.add(normalize_category(match.group('name')))
    result: list[str] = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages[1:3]:
            for raw in (page.extract_text() or '').splitlines():
                line = clean(raw)
                if not line or line.startswith(('ZEHOLYN', '©')) or line in {'Contents', '目 录', 'Содержание', 'Scientific Reagents', 'Laboratory Consumables', '科研试剂', '实验室耗材'}:
                    continue
                match = re.match(r'(.+?)\s+(\d+)\s*$', line)
                if not match:
                    continue
                name, page_no = normalize_category(match.group(1)), int(match.group(2))
                if name in level2_names or page_no <= 3:
                    continue
                result.append(name)
    return result


def parse_field_block(lines: list[str], config: dict) -> dict[str, str]:
    joined = '\n'.join(lines)
    fields = config['fields']
    # Cat.No line also contains specification and storage in all three PDFs.
    cat_line = lines[0] if lines else ''
    marker = re.escape(fields['spec'])
    storage = rf'{re.escape(fields["storage"])}:?'
    spec_match = re.search(rf'{marker}\s*(.*?)\s+{storage}\s+(.+)$', cat_line, re.I)
    result = {'catNo': '', 'spec': '', 'storage': '', 'type': '', 'features': '', 'application': '', 'shipping': '', 'packaging': ''}
    cat_match = re.search(r'Cat\.No\s+(.+?)(?=\s+(?:Spec\.:|规格|Спец\.))', cat_line, re.I)
    if cat_match:
        result['catNo'] = clean(cat_match.group(1))
    if spec_match:
        result['spec'], result['storage'] = clean(spec_match.group(1)), clean(spec_match.group(2))

    labels = [('type', fields['type']), ('features', fields['features']), ('application', fields['application']), ('shipping', fields['shipping']), ('packaging', fields['packaging'])]
    all_labels = '|'.join(re.escape(item[1]) for item in labels)
    for index, (key, label) in enumerate(labels):
        pattern = rf'(?m)^{re.escape(label)}\s+(.+?)(?=^(?:{all_labels})\s+|^ZEHOLYN|^©|\Z)'
        match = re.search(pattern, joined, re.I | re.S)
        if match:
            result[key] = clean(match.group(1))
    return result


def parse_products(path: Path, language: str) -> tuple[list[dict], list[str]]:
    config = LANG_CONFIG[language]
    products: list[dict] = []
    current_level2 = ''
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages[4:]:
            lines = [clean(item) for item in (page.extract_text() or '').splitlines() if clean(item)]
            category_match = next((re.match(config['category_count'], line, re.I) for line in lines if re.match(config['category_count'], line, re.I)), None)
            if category_match:
                current_level2 = normalize_category(category_match.group('name'))
            cat_indices = [index for index, line in enumerate(lines) if line.lower().startswith('cat.no')]
            for position, index in enumerate(cat_indices):
                if index < 2:
                    continue
                block_end = cat_indices[position + 1] if position + 1 < len(cat_indices) else len(lines)
                before = lines[index - 1]
                brand = lines[index - 2]
                if re.search(r'products|продукт|个产品|ZEHOLYN|©', brand, re.I):
                    brand = ''
                parsed = parse_field_block(lines[index:block_end], config)
                if not parsed['catNo']:
                    continue
                source_note = ' '.join(line for line in lines[index:block_end] if 'independent' in line.lower() or 'независим' in line.lower() or '独立' in line)
                products.append({'level2': current_level2, 'productName': before, 'brand': brand, **parsed, 'sourceNote': clean(source_note)})
    return products, content_level3(path, language)


def safe_image_name(index: int, cat_no: str) -> str:
    safe = re.sub(r'[^A-Za-z0-9]+', '-', cat_no).strip('-').lower() or f'item-{index}'
    return f'{index:04d}-{safe}.png'


def extract_images(path: Path, products: list[dict]) -> None:
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(path))
    image_index = 0
    for page in reader.pages[4:]:
        for image in page.images:
            if image_index >= len(products):
                return
            filename = safe_image_name(image_index + 1, products[image_index]['catNo'])
            target = IMAGE_DIR / filename
            if not target.exists():
                target.write_bytes(image.data)
            products[image_index]['imageUrl'] = f'/manuals/products/{filename}'
            image_index += 1
    if image_index != len(products):
        raise RuntimeError(f'Expected {len(products)} product images, extracted {image_index}')


def main() -> None:
    parsed: dict[str, list[dict]] = {}
    level3: dict[str, list[str]] = {}
    for language, config in LANG_CONFIG.items():
        path = find_pdf(config['glob'])
        parsed[language], level3[language] = parse_products(path, language)
        print(f'{language}: {len(parsed[language])} products, {len(level3[language])} level-3 categories from {path.name}')
    if any(len(parsed[language]) != 450 for language in parsed):
        raise RuntimeError('Each PDF must contain exactly 450 products')
    # A small number of CAT No. values are localized in the Chinese/Russian
    # editions (for example KO-plasmid / KO质粒 / KO-плазмида). Product order
    # and names are used for alignment; the English CAT No. remains canonical.
    names = [[item['productName'] for item in parsed[language]] for language in ('en', 'zh', 'ru')]
    if not (names[0] == names[1] == names[2]):
        mismatches = [index for index, values in enumerate(zip(*names)) if len(set(values)) > 1]
        raise RuntimeError(f'Product order differs between language PDFs at rows {mismatches[:10]}')
    if any(len(level3[language]) != 90 for language in level3):
        raise RuntimeError('Expected 90 level-3 categories in each contents list')
    extract_images(find_pdf(LANG_CONFIG['en']['glob']), parsed['en'])
    rows = []
    for index in range(450):
        en, zh, ru = parsed['en'][index], parsed['zh'][index], parsed['ru'][index]
        level3_index = index // 5
        rows.append({
            'level1': 'Research Reagents' if index < 240 else 'Laboratory Consumables',
            'level1Zh': '科研试剂' if index < 240 else '实验室耗材',
            'level1Ru': 'Научные реагенты' if index < 240 else 'Лабораторные расходные материалы',
            'level2': en['level2'], 'level2Zh': zh['level2'], 'level2Ru': ru['level2'],
            'level3': level3['en'][level3_index], 'level3Zh': level3['zh'][level3_index], 'level3Ru': level3['ru'][level3_index],
            'productName': en['productName'], 'productNameZh': zh['productName'], 'productNameRu': ru['productName'],
            'brand': en['brand'], 'catNo': en['catNo'],
            'specification': en['spec'], 'specificationZh': zh['spec'], 'specificationRu': ru['spec'],
            'storage': en['storage'], 'storageZh': zh['storage'], 'storageRu': ru['storage'],
            'type': en['type'], 'typeZh': zh['type'], 'typeRu': ru['type'],
            'features': en['features'], 'featuresZh': zh['features'], 'featuresRu': ru['features'],
            'application': en['application'], 'applicationZh': zh['application'], 'applicationRu': ru['application'],
            'shipping': en['shipping'], 'shippingZh': zh['shipping'], 'shippingRu': ru['shipping'],
            'packaging': en['packaging'], 'packagingZh': zh['packaging'], 'packagingRu': ru['packaging'],
            'sourceNote': en['sourceNote'] or 'ZEHOLYN BIOTECH catalog, September 2026. For Research Use Only (RUO).',
            'imageUrl': en['imageUrl'],
        })
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'wrote {len(rows)} rows to {OUTPUT}')


if __name__ == '__main__':
    main()
