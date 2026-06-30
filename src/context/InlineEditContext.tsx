import React, { createContext, useContext, useState, useCallback } from "react";

interface InlineEditContextType {
  activeEditId: string | null;
  setActiveEditId: (id: string | null) => void;
  editingTextId: string | null;
  setEditingTextId: (id: string | null) => void;
}

const InlineEditContext = createContext<InlineEditContextType>({
  activeEditId: null,
  setActiveEditId: () => {},
  editingTextId: null,
  setEditingTextId: () => {},
});

export const InlineEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const handleSetActiveEditId = useCallback((id: string | null) => {
    setActiveEditId(id);
  }, []);

  const handleSetEditingTextId = useCallback((id: string | null) => {
    setEditingTextId(id);
  }, []);

  return (
    <InlineEditContext.Provider
      value={{
        activeEditId,
        setActiveEditId: handleSetActiveEditId,
        editingTextId,
        setEditingTextId: handleSetEditingTextId,
      }}
    >
      {children}
    </InlineEditContext.Provider>
  );
};

export const useInlineEdit = () => useContext(InlineEditContext);
export default InlineEditContext;
