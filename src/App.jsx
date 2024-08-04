import { useEffect, useState } from "react";
import Button from "./Components/Button";
import { auth_url } from "./Constants";
import { Cookies } from "react-cookie";
import {
  get_saved_tracks,
  parseMillisecondsIntoReadableTime,
  export_data_json,
  export_data_csv,
} from "./Utils";
import { Scrollbars } from "react-custom-scrollbars-2";
import { BsGithub } from "react-icons/bs";

const cookies = new Cookies();

const App = () => {
  const [token, setToken] = useState(null);
  const [songs, setSongs] = useState(null);

  useEffect(() => {
    const hash = window.location.hash.substring(1);

    if (hash !== "") {
      window.location.href = window.location.href.split("#")[0] + "#";

      const URLSP = new URLSearchParams(hash);

      const access_token = URLSP.get("access_token");
      const expires_in = URLSP.get("expires_in");

      setToken(access_token);

      cookies.set("access_token", access_token, {
        maxAge: expires_in,
      });
    } else {
      const access_token = cookies.get("access_token");
      if (access_token) setToken(access_token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const data = get_saved_tracks(token);
      data.then((val) => {
        setSongs(val);
      });
    }
  }, [token]);

  return (
    <div className="bg-dark h-full">
      <div className="container mx-auto relative h-full flex flex-col items-center lg:flex-row">
        <section className="h-full w-full lg:w-1/2 px-16 flex items-center justify-center">
          <div className="flex flex-col justify-start gap-5">
            <h1 className="text-light text-4xl font-extrabold">
              Spotify Export Saved
            </h1>
            <p className="text-light text-[18px] font-light min-w-[300px] max-w-[500px]">
              This tool allows users to export their saved songs on Spotify to a
              CSV or JSON file. It uses the Spotify Web API to retrieve the
              user&apos;s saved songs and export them in a CSV or JSON format
              that can be easily imported into other music platforms or analyzed
              in spreadsheet software.
            </p>
          </div>
        </section>
        {!token ? (
          <section className="h-full w-full lg:w-1/2 px-16 flex flex-col items-center justify-center">
            <Button
              href={auth_url}
              style="rounded-[10px] text-[18px] font-medium px-4 py-2"
            >
              Login With Spotify
            </Button>
          </section>
        ) : (
          <section className="h-full w-full lg:w-1/2 px-16 flex flex-col items-center justify-center">
            {!songs ? (
              <h1 className="text-light text-4xl font-extrabold">
                Retrieving songs...
              </h1>
            ) : (
              <div className="w-full flex flex-col justify-start gap-4">
                <Scrollbars
                  style={{ width: "100%", height: "350px" }}
                  className="relative overflow-x-auto shadow-xl sm:rounded-lg w-full border-[1px] border-tableBorder"
                >
                  <table className="w-full text-sm text-left text-light">
                    <thead className="text-xs text-light backdrop-blur-[5px] sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3 w-[10%]">
                          a
                        </th>
                        <th scope="col" className="px-6 py-3 w-[45%]">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 w-[40%]">
                          Album
                        </th>
                        <th scope="col" className="px-6 py-3 w-[5%]">
                          d
                        </th>
                      </tr>
                    </thead>
                    {/* ADD REACT WINDOW */}
                    <tbody>
                      {songs.map((song) => (
                        <tr
                          key={song.track.id}
                          className=" border-b border-tableBorder"
                        >
                          <th
                            scope="row"
                            className="px-3 py-1 text-light whitespace-nowrap"
                          >
                            <img
                              src={song.track.album.images[0]?.url}
                              className="rounded-sm"
                            />
                          </th>
                          <td className="px-6 py-4">{song.track.name}</td>
                          <td className="px-6 py-4">{song.track.album.name}</td>
                          <td className="px-6 py-4">
                            {parseMillisecondsIntoReadableTime(
                              song.track.duration_ms
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Scrollbars>

                <div className="flex flex-row justify-between items-center px-4">
                  <h1 className="text-light opacity-80 text-lg font-medium">
                    {songs.length} song counted
                  </h1>

                  <div className="flex flex-row gap-6">
                    <Button
                      style="rounded-[10px] text-[18px] font-bold px-4 py-2"
                      onClick={() => export_data_csv(songs)}
                    >
                      .csv
                    </Button>
                    <Button
                      style="rounded-[10px] text-[18px] font-bold px-4 py-2"
                      onClick={() => export_data_json(songs)}
                    >
                      .json
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
        <Button
          href="https://github.com/malialp/spotify-export-saved"
          style="text-dark absolute left-4 bottom-4 p-2 rounded-lg"
        >
          <BsGithub className="h-auto w-[22px]" />
        </Button>
      </div>
    </div>
  );
};

export default App;
