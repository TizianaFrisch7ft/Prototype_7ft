import React, { createContext, useContext, useState } from "react";

interface Background {
  name: string;
  img?: string;
  color?: string;
}

interface BackgroundContextType {
  selectedBackground: Background;
  setSelectedBackground: (bg: Background) => void;
}

const defaultBg = { name: "Original", color: "#fff" };

const BackgroundContext = createContext<BackgroundContextType>({
  selectedBackground: defaultBg,
  setSelectedBackground: () => {}
});

export const useBackground = () => useContext(BackgroundContext);

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBackground, setSelectedBackground] = useState<Background>(defaultBg);
  return (
    <BackgroundContext.Provider value={{ selectedBackground, setSelectedBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};
