import { parseMillisecondsIntoReadableTime } from "../Utils";

const Row = (props) => {
  const song = props.data[props.index];
  console.log(song);
  return (
    <div
      style={props.style}
      key={song.track.id}
      className="w-full flex flex-row p-2 bg-white bg-opacity-5 border-b border-tableBorder items-center"
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
        {parseMillisecondsIntoReadableTime(song.track.duration_ms)}
      </div>
    </div>
  );
};

export default Row;
