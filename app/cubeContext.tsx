import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CubeData {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  distance: number;
  imageUrl: string;
  roomsAvailable: number; // Add this field
  pricePerNight: number; // Add this field
  pricePerHour: number; // Add this field
}

interface CubeContextProps {
  cubeData: CubeData[];
  setCubeData: React.Dispatch<React.SetStateAction<CubeData[]>>;
  getCubeById: (id: number) => CubeData | undefined; // Add this line
}

const CubeContext = createContext<CubeContextProps | undefined>(undefined);

export const CubeProvider = ({ children }: { children: ReactNode }) => {
  const [cubeData, setCubeData] = useState<CubeData[]>([]);

  // Define the getCubeById function
  const getCubeById = (id: number): CubeData | undefined => {
    return cubeData.find(cube => cube.id === id);
  };

  return (
    <CubeContext.Provider value={{ cubeData, setCubeData, getCubeById  }}>
      {children}
    </CubeContext.Provider>
  );
};

export const useCubeData = (): CubeContextProps => {
  const context = useContext(CubeContext);
  if (!context) {
    throw new Error('useCubeData must be used within a CubeProvider');
  }
  return context;
};
