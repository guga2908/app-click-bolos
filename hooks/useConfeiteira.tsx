import React, { createContext, useContext, useState } from "react";

interface ConfeiteiraContextType {
  confeiteiraId: number | null;
  setConfeiteiraId: (id: number) => void;
}

const ConfeiteiraContext = createContext<ConfeiteiraContextType | undefined>(undefined);

export const ConfeiteiraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [confeiteiraId, setConfeiteiraId] = useState<number | null>(null);

  return (
    <ConfeiteiraContext.Provider value={{ confeiteiraId, setConfeiteiraId }}>
      {children}
    </ConfeiteiraContext.Provider>
  );
};

export const useConfeiteiraId = () => {
  const context = useContext(ConfeiteiraContext);
  if (!context) {
    throw new Error("useConfeiteiraId must be used within a ConfeiteiraProvider");
  }
  return context;
};
