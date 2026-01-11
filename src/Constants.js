const client_id = import.meta.env.VITE_CLIENT_ID;
const scope = "user-library-read";
const redirect_uri = "http://127.0.0.1:3000/";

export const auth_url =
  "https://accounts.spotify.com/authorize" +
  "?response_type=token" +
  "&client_id=" +
  encodeURIComponent(client_id) +
  "&scope=" +
  encodeURIComponent(scope) +
  "&redirect_uri=" +
  encodeURIComponent(redirect_uri);
