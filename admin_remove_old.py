path = r'D:\Digital Creator\Antigravity\SiberSagaWeb\src\components\AdminPanel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and remove the stranded old sidebar code
# It starts after </section> of hero and ends before {/* Main Action Working Canvas */}
in_old_sidebar = False
start_idx = None
end_idx = None

for i, line in enumerate(lines):
    # Start: look for the stray Kelola Admin button after hero section
    if 'Kelola Admin' in line and i > 800 and i < 850:
        start_idx = i - 2  # Include the stray onClick line above
        in_old_sidebar = True
        print(f'Found old sidebar start at line {i+1}')
    
    # End: look for the Main Action Working Canvas comment
    if in_old_sidebar and 'Main Action Working Canvas Workspace' in line:
        end_idx = i
        print(f'Found old sidebar end at line {i+1}')
        break

if start_idx and end_idx:
    # Remove lines from start_idx to end_idx-1
    new_lines = lines[:start_idx] + lines[end_idx:]
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f'Removed {end_idx - start_idx} lines of old sidebar code')
else:
    print('Could not find old sidebar code to remove')
    print(f'start_idx: {start_idx}, end_idx: {end_idx}')
