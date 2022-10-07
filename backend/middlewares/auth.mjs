import { UserStore } from "../db/schemas.mjs";

export const auth = async (req, res, next) => {

  const accessToken = req.headers['access-token'];
  res.locals.user = await UserStore.findOne().byAccessToken(accessToken);
  if (!res.locals.user) {
    res.status(401);
    res.send({ message: 'unauthorized' });
    return;
  }
  next();
};
