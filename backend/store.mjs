import dotenv from "dotenv";
dotenv.config();

export const store = {
  users: [],
  clientID: process.env.APP_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.APP_SPOTIFY_CLIENT_SECRET,
  redirectURL: process.env.APP_SPOTIFY_REDIRECT_URI,
  mongodbConnstring: process.env.MONGODB_CONNSTRING,
};

console.log('store:', store);
