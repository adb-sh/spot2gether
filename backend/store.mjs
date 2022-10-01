import dotenv from "dotenv";
dotenv.config();

export const store = {
  users: [],
  clientID: process.env.APP_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.APP_SPOTIFY_CLIENT_SECRET,
  redirectURL: process.env.APP_SPOTIFY_REDIRECT_URI,
};

console.log('store:', store);
