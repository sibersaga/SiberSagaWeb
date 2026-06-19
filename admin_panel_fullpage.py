import re

path = r'D:\Digital Creator\Antigravity\SiberSagaWeb\src\components\AdminPanel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Step 1: Replace outer container from centered modal to fullscreen
old_outer = '''      <div className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-100">'''

new_outer = '''      <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col">'''

if old_outer in content:
    content = content.replace(old_outer, new_outer)
    print('Replaced outer container')
else:
    print('WARNING: Could not find outer container pattern')

# Step 2: Replace login form container from centered card to fullpage centered
old_login = '''          <div className="flex-1 overflow-y-auto flex items-center justify-center bg-slate-50 p-6 md:p-12">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full border border-slate-200 shadow-xl">'''

new_login = '''          <div className="flex-1 overflow-y-auto flex items-center justify-center bg-slate-50 p-6 md:p-12">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full border border-slate-200 shadow-xl">'''

# This is actually the same, but the parent is now fullpage so it will work
# The key fix is removing the inner modal wrapper

# Step 3: Replace admin dashboard inner container from sidebar+scroll to fullpage sidebar
old_dash = '''          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-full md:w-56 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">'''

new_dash = '''          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-full md:w-56 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 h-full">'''

if old_dash in content:
    content = content.replace(old_dash, new_dash)
    print('Replaced dashboard container')
else:
    print('WARNING: Could not find dashboard container')

# Step 4: Fix the main content area to be full height
old_content = '''            {/* Main Action Working Canvas Workspace */}
            <div className="flex-1 bg-slate-50 p-4 md:p-6 overflow-y-auto flex flex-col gap-5">'''

new_content = '''            {/* Main Action Working Canvas Workspace */}
            <div className="flex-1 bg-slate-50 p-4 md:p-6 overflow-y-auto flex flex-col gap-5 min-h-0">'''

if old_content in content:
    content = content.replace(old_content, new_content)
    print('Replaced content area')
else:
    print('WARNING: Could not find content area')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
