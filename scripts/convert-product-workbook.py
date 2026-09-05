import json
from pathlib import Path
import pandas as pd

source = Path('Zehongyan_Biotech.xlsx')
output = Path('storage/product-workbook.json')
output.parent.mkdir(parents=True, exist_ok=True)
frame = pd.read_excel(source, sheet_name=0).fillna('')
frame.iloc[:, 0:3] = frame.iloc[:, 0:3].replace('', pd.NA).ffill().fillna('')
columns = list(frame.columns)
level1 = ''
level2 = ''
rows = []
for _, item in frame.iterrows():
    level1 = str(item[columns[0]]).strip() or level1
    level2 = str(item[columns[1]]).strip() or level2
    row = {
        'level1': level1,
        'level2': level2,
        'level3': str(item[columns[2]]).strip(),
        'productName': str(item[columns[4]]).strip(),
        'brand': str(item[columns[5]]).strip(),
        'catNo': str(item[columns[6]]).strip(),
        'citationNote': str(item[columns[7]]).strip(),
        'sourceNote': str(item[columns[8]]).strip(),
    }
    if row['level1'] and row['level2'] and row['level3'] and row['productName']:
        rows.append(row)
output.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'rows': len(rows), 'output': str(output)}, ensure_ascii=False))
