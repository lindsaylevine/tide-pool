import { createContext, useState, useEffect } from 'react';
import { flatten } from 'lodash';

const CruiseContext = createContext<{
  cruises: Cruise[];
  isLoading: boolean;
}>({
  cruises: [],
  isLoading: true,
});

const MAIN_CRUISES_ENDPOINT = 'https://www.gmrt.org/services/GmrtCruises.php';
const REJECTED_CRUISES_ENDPOINT = `${MAIN_CRUISES_ENDPOINT}?is_rejected=true`;
const UNDER_REVIEW_CRUISES_ENDPOINT = `${MAIN_CRUISES_ENDPOINT}?under_review=true`;

const CruiseProvider = ({ children }: { children: any; }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cruises, setCruises] = useState<Cruise[]>([]);

  useEffect(() => {
    fetchCruises();
  }, []);

  const fetchCruises = async () => {
    setIsLoading(true);
    try {
      const cruiseResponses = await Promise.all([
        window.fetch(MAIN_CRUISES_ENDPOINT),
        window.fetch(REJECTED_CRUISES_ENDPOINT),
        window.fetch(UNDER_REVIEW_CRUISES_ENDPOINT),
      ]);
      const cruiseData = await Promise.all(cruiseResponses.map((res) => res.json()));
      setCruises(flatten(cruiseData));
    } catch (e){
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CruiseContext.Provider value={{ cruises, isLoading }}>
      {children}
    </CruiseContext.Provider>
  );
};

export { CruiseContext, CruiseProvider };
