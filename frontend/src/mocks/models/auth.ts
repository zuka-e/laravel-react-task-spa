import { UserDocument } from 'mocks/models';

const user = {} as UserDocument;

const exists = () => Object.keys(user).length > 0;

export const getUser = () => (exists() ? user : null);

export const setUser = (userDoc: UserDocument) => Object.assign(user, userDoc);

export const login = (userDoc: UserDocument) => setUser(userDoc);
