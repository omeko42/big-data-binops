with open('kinerja-unified-filter-export-20260925/kinerja-perma-external-a42edc88f706.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if line.strip() == '},' and idx + 1 < len(lines):
        next_line = lines[idx + 1].strip()
        if next_line.startswith('['):
            # Check previous lines to see what opened this
            prev_lines = ''.join(lines[max(0, idx - 15):idx + 1])
            if 'jsxs' in prev_lines or 'jsx' in prev_lines:
                print(f'Line {idx+2}: Array after props object! Preceding call:')
                for p in lines[max(0, idx - 10):idx + 2]:
                    print('  ', p.rstrip())
                print('='*50)
