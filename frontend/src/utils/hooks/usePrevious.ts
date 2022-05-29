import { useEffect, useRef } from 'react';

/**
 * 直前の情報(`ref`)を保持
 */
export const usePrevious = <T>(initialState: T) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = initialState;
  }, [initialState]);

  return ref.current;
};
