export const save = (key: string, data: object) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const load = (data: object, key: string) => {
  const storedData = localStorage.getItem(key) || '{}';
  Object.assign(data, JSON.parse(storedData));
};
