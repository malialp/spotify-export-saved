const client_id = "0323dd31d6b94b37ab5648c50eeb41f3";
const scope = "user-library-read";
const redirect_uri = "http://localhost:5173/";

export const auth_url =
  "https://accounts.spotify.com/authorize" +
  "?response_type=token" +
  "&client_id=" +
  encodeURIComponent(client_id) +
  "&scope=" +
  encodeURIComponent(scope) +
  "&redirect_uri=" +
  encodeURIComponent(redirect_uri);
