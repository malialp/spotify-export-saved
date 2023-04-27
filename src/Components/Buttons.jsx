import React from "react";
import { export_data_json, export_data_csv } from "../Utils";

const Buttons = ({ songs }) => {
  return (
    <>
      <button
        onClick={() => {
          export_data_json(songs);
        }}
        className="bg-[#c5458a] hover:bg-[#b74482] text-[#FFF2F9] text-xl font-medium py-3 px-4 rounded-lg"
      >
        Export data as JSON
      </button>
      <button
        onClick={() => {
          export_data_csv(songs);
        }}
        className="bg-[#c5458a] hover:bg-[#b74482] text-[#FFF2F9] text-xl font-medium py-3 px-4 rounded-lg"
      >
        Export data as CSV
      </button>
    </>
  );
};

export default Buttons;
