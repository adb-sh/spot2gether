import { store } from "../store.mjs";

export const auth = (req, res, next) => {
  const accessToken = req.headers['access-token'];
  res.locals.user = store.users.find(user => user.accessToken === accessToken);
  if (!res.locals.user) {
    res.status(401);
    res.send({ message: 'unauthorized' });
  }
  else next();
};
