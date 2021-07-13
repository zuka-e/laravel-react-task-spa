import storeApi from 'store';

export const store = { ...storeApi };

export const initializeStore = () => {
  Object.assign(store, { ...storeApi });
};
