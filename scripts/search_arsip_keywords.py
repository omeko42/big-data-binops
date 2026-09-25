import os

workspace = r'd:\Prototype CAS\EDIT MASTER MASAL'
keywords = ['tap tersangka', 'arsip tap', 'gagal upload', 'upload arsip', 'arsip_tap', 'tap_tsk', 'penetapan tersangka']

matches = []
for root, dirs, files in os.walk(workspace):
    if any(x in root for x in ['.git', 'node_modules', '.next']):
        continue
    for f in files:
        if f.endswith(('.ts', '.js', '.tsx', '.jsx', '.json', '.sql', '.txt')):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read().lower()
                    for kw in keywords:
                        if kw in content:
                            matches.append((kw, path))
            except:
                pass

print(f"Total matches: {len(matches)}")
for kw, path in matches[:30]:
    print(f" - [{kw}] {path}")
