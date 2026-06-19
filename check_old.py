with open(r'D:\Digital Creator\Antigravity\SiberSagaWeb\src\components\AdminPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old = """  return (
    <>
      {showFullPageHtmlEditor && (
        <FullPageHtmlEditor onClose={() => setShowFullPageHtmlEditor(false)} />
      )}
      <div className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-100">"""

print('Found:', old in content)
