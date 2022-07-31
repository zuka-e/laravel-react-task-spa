import type { Location } from 'history';
import { useLocation } from 'react-router-dom';

type LocationState = {
  /** Previously accessed page information */
  from: Location<undefined>;
};

const useAppLocation = () => useLocation<LocationState | undefined>();

export default useAppLocation;
