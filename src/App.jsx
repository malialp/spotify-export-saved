import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { get_saved_tracks, export_data_csv, export_data_json } from "./Utils";
import { auth_url } from "./Constants";

const cookies = new Cookies();

const App = () => {
  const [token, setToken] = useState(null);
  const [songs, setSongs] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash !== "") {
      const token = new URLSearchParams(window.location.hash.substring(1)).get(
        "access_token"
      );

      setToken(token);
      cookies.set("access_token", token, {
        maxAge: 3600,
      });
    } else {
      const token = cookies.get("access_token");
      if (token) setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const data = get_saved_tracks(token);
      data.then((val) => {
        console.log(val);
        setSongs(val);
      });
    }
  }, [token]);

  return (
    <div className="bg-blue-400 h-full">
      <div className="container mx-auto flex justify-center items-center h-full -translate-y-36">
        <div className="bg-blue-500 p-5 rounded-xl">
          <h1 className="text-white text-3xl font-medium">
            Export Saved Tracks
          </h1>
          <hr />
          <div className="flex justify-center mt-4">
            {token !== null ? (
              <div>
                {songs !== null ? (
                  <div className="flex flex-col gap-2">
                    <button
                      className="text-white text-lg bg-green-600 rounded-lg py-2 px-3 font-medium"
                      onClick={() => {
                        export_data_json(songs);
                      }}
                    >
                      Export Data as JSON
                    </button>

                    <button
                      className="text-white text-lg bg-green-600 rounded-lg py-2 px-3 font-medium"
                      onClick={() => {
                        export_data_csv(songs);
                      }}
                    >
                      Export Data as CSV
                    </button>
                  </div>
                ) : (
                  <h1 className="text-white text-lg">Please Wait...</h1>
                )}
              </div>
            ) : (
              <a
                href={auth_url}
                className="text-white text-lg bg-green-600 rounded-lg py-2 px-3 font-medium"
              >
                Log In With Spotify
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
