import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { get_saved_tracks } from "./Utils";
import { Loading, Buttons, LogInButton, Footer } from "./Components/Components";

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

      window.location.href = window.location.href.split("#")[0] + "#";

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
    <div className="bg-[#323232] h-full">
      <div className="container mx-auto h-full flex flex-col">
        <div className="h-full grid grid-cols-1 grid-rows-2 mx-auto">
          <h1 className="text-[#FFF2F9] text-[2.25rem] font-bold font-lobster w-full pt-4">
            Export Your Saved Songs
          </h1>
          <div>
            {token ? (
              <div className="flex flex-col gap-2 -translate-y-10">
                {songs ? <Buttons songs={songs} /> : <Loading />}
              </div>
            ) : (
              <LogInButton />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
