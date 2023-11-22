import {createContext, useContext, useState} from 'react';

const MetricsContext = createContext({});

export const useMetrics = () => {
  return useContext(MetricsContext);
} 

export function MetricsProvider({ children }) {
  const [metrics, setMetrics] = useState({})

  return <MetricsContext.Provider value={{ metrics, setMetrics }}>{children}</MetricsContext.Provider>;
}