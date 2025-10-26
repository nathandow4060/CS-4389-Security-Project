// models/user.model.js
const users = []; // replace with actual DB queries later

export const findUserByEmail = (email) => users.find(u => u.email === email);
export const addUser = (user) => users.push(user);