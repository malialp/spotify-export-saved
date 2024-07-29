import { useState } from "react";
import Button from "./Components/Button";

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <div className="bg-dark h-full">
      <div className="container mx-auto h-full flex flex-col items-center md:flex-row">
        <section className="h-full w-full md:w-1/2 px-16 flex items-center justify-center">
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
          <section className="h-full w-full md:w-1/2 px-16 flex flex-col items-center justify-center">
            <Button>Login With Spotify</Button>
          </section>
        ) : (
          <section className="h-full w-full md:w-1/2 px-16 flex flex-col items-center justify-center">
            <h1 className="text-light text-4xl font-extrabold">
              Logged in successfully
            </h1>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;
