import { db, UserDocument } from 'mocks/models';

const user = {} as UserDocument;

export const getUser = () => (db.exists(user) ? user : null);

export const setUser = (userDoc: UserDocument) => Object.assign(user, userDoc);

export const login = (userDoc: UserDocument) => setUser(userDoc);
