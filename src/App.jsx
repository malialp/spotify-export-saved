import { useEffect, useState } from "react";
import Button from "./Components/Button";
import { auth_url } from "./Constants";
import { Cookies } from "react-cookie";
import { Scrollbars } from "react-custom-scrollbars-2";
import {
  get_saved_tracks,
  parseMillisecondsIntoReadableTime,
  export_data_json,
  export_data_csv,
} from "./Utils";

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
      <div className="container mx-auto h-full flex flex-col">
        <div className="h-full flex flex-col items-center lg:flex-row p-10 lg:p-16">
          <section className="h-full w-full lg:w-1/2 flex items-center justify-center">
            <div className="flex flex-col justify-start gap-5">
              <h1 className="text-light text-3xl lg:text-4xl font-extrabold">
                Spotify Export Saved
              </h1>
              <p className="text-light text-[16px] lg:text-[18px] font-light min-w-[300px] max-w-[500px]">
                This tool allows users to export their saved songs on Spotify to
                a CSV or JSON file. It uses the Spotify Web API to retrieve the
                user&apos;s saved songs and export them in a CSV or JSON format
                that can be easily imported into other music platforms or
                analyzed in spreadsheet software.
              </p>
            </div>
          </section>
          {!token ? (
            <section className="h-full w-full lg:w-1/2 flex flex-col items-center justify-center">
              <Button
                href={auth_url}
                style="rounded-[10px] text-[18px] font-medium px-4 py-2"
              >
                Login With Spotify
              </Button>
            </section>
          ) : (
            <section className="h-full w-full lg:w-1/2 flex flex-col items-center justify-center">
              {!songs ? (
                <h1 className="text-light text-3xl lg:text-4xl font-extrabold">
                  Retrieving songs...
                </h1>
              ) : (
                <div className="w-full flex flex-col justify-start gap-4">
                  <Scrollbars
                    style={{ width: "100%", height: "350px" }}
                    className="relative overflow-x-auto w-full rounded-xl shadow-lg text-light select-none"
                  >
                    {/* HEAD */}
                    <div className="sticky top-0 left-0 w-full flex flex-row bg-tableDark p-2 font-medium">
                      <div className="w-[20%] xl:w-[10%] text-center">a</div>
                      <div className="w-[40%] px-2">Title</div>
                      <div className="w-[40%] px-2">Album</div>
                      <div className="w-[10%] text-center hidden xl:block">
                        d
                      </div>
                    </div>
                    {/* BODY */}
                    <div className="flex flex-col text-sm">
                      {songs.map((song) => (
                        <div
                          key={song.track.id}
                          className="w-full flex flex-row p-2 bg-tableLight border-b border-tableBorder items-center"
                        >
                          <div className="w-[20%] xl:w-[10%] grid justify-center">
                            <img
                              src={song.track.album.images[0]?.url}
                              className="rounded-sm w-[40px] h-auto"
                            />
                          </div>
                          <div className="w-[40%] px-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            {song.track.name}
                          </div>
                          <div className="w-[40%] px-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            {song.track.album.name}
                          </div>
                          <div className="w-[10%] text-center hidden xl:block">
                            {parseMillisecondsIntoReadableTime(
                              song.track.duration_ms
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Scrollbars>

                  <div className="flex flex-row justify-between items-center px-4">
                    <h1 className="text-light opacity-80 text-md font-medium">
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
        </div>
        <div className="w-full flex justify-center items-center py-4 text-midLight">
          <span>
            Created by{" "}
            <a
              className="text-pink-600 shadow-pink-500 shadow-2xl drop-shadow-2xl hover:underline"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/malialp/spotify-export-saved"
            >
              malialp
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
