import re

path = r'D:\Digital Creator\Antigravity\SiberSagaWeb\src\components\AdminPanel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the old sidebar nav that still exists
old_sidebar_marker = '              <nav className="p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">'
idx_sidebar = content.find(old_sidebar_marker)
if idx_sidebar == -1:
    old_sidebar_marker = '              <nav className="p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">'
    idx_sidebar = content.find(old_sidebar_marker)

print('Sidebar index:', idx_sidebar)

# Find the closing of the old dashboard before {activeTab === "admins"
old_admins_tab = '              {/* 1. MANAGE ADMINS TAB */}'
idx_admins = content.find(old_admins_tab)
print('Admins tab index:', idx_admins)

if idx_sidebar > 0 and idx_admins > 0:
    # Remove everything from sidebar start to before the admins tab
    content = content[:idx_sidebar] + content[idx_admins:]
    print('Removed old sidebar navigation')
else:
    print('Could not find markers to remove old sidebar')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
