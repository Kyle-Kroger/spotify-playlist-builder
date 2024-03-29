/* eslint-disable no-prototype-builtins */
import cookie from "cookie";
/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
export const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// get a new object that only has the passed in keys
// Useful for spreading when passing props
export const pick = (obj, keys) => {
  return keys.reduce((pickedObj, key) => {
    if (obj.hasOwnProperty(key)) {
      pickedObj[key] = obj[key];
    }
    return pickedObj;
  }, {});
};

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const auth = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
  "base64"
)}`;

// refresh access token
export const refreshAccessToken = async (token, refresh_token, res) => {
  if (token) {
    return token;
  }

  const bodyData = {
    grant_type: "refresh_token",
    refresh_token,
  };

  const urlEncoded = new URLSearchParams(bodyData);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: auth,
      },
      body: urlEncoded,
    });

    if (!response.ok) {
      const message = `An error has occured trying to refresh the token: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    const { access_token } = await response.json();

    if (access_token) {
      if (access_token) {
        const accessTokenCookie = cookie.serialize(
          "SPOTIFY_ACCESS_TOKEN",
          access_token,
          {
            httpOnly: true,
            maxAge: 60 * 60,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          }
        );

        res.setHeader("Set-Cookie", accessTokenCookie);
      }
      return access_token;
    }

    // throw new Error("unable to fetch accessToken");
  } catch (err) {
    console.warn(err);
  }
};
