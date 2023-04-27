const client_id = "your-client-id";
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
