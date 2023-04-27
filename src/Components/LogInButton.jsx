import React from "react";
import { auth_url } from "../Constants";

const LoginButton = () => {
  return (
    <div className="flex">
      <a
        href={auth_url}
        className="bg-[#c5458a] hover:bg-[#b74482] text-[#FFF2F9] mx-auto text-xl font-medium py-3 px-4 rounded-lg cursor-pointer"
      >
        Login With Spotify
      </a>
    </div>
  );
};

export default LoginButton;
