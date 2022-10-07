import mongoose, { model } from "mongoose";
const { Schema } = mongoose;
import { findUserBySpotifyId } from "../lib/helpers.mjs";

const userSchema = new Schema({
  accessToken: String,
  role: String,
  spotify: {
    refreshToken: String,
    userId: String,
    local: {
      type: Boolean,
      async get(local) {
        if (!local) return false;
        return await findUserBySpotifyId({
          userId: this.spotify.userId,
          refreshToken: this.spotify.refreshToken,
        }, { create: true });
      },
    },
  },
}, {
  query: {
    bySpotifyId(id) {
      return this.where({ 'spotify.userId': id });
    },
    byAccessToken(accessToken) {
      return this.where({ accessToken });
    },
  },
});

export const UserStore = model('User', userSchema);
