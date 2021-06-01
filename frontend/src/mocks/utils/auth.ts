import { UserDocument } from 'mocks/models';
import { exists } from 'mocks/utils/data';

const user = {} as UserDocument;

export const getUser = () => (exists(user) ? user : null);

export const setUser = (userDoc: UserDocument) => Object.assign(user, userDoc);

export const login = (userDoc: UserDocument) => setUser(userDoc);
