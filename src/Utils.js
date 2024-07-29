import axios from "axios";

function parseMillisecondsIntoReadableTime(milliseconds) {
  //Get hours from milliseconds
  var hours = milliseconds / (1000 * 60 * 60);
  var absoluteHours = Math.floor(hours);
  var h = absoluteHours > 9 ? absoluteHours : "0" + absoluteHours;

  //Get remainder from hours and convert to minutes
  var minutes = (hours - absoluteHours) * 60;
  var absoluteMinutes = Math.floor(minutes);
  var m = absoluteMinutes > 9 ? absoluteMinutes : "0" + absoluteMinutes;

  //Get remainder from minutes and convert to seconds
  var seconds = (minutes - absoluteMinutes) * 60;
  var absoluteSeconds = Math.floor(seconds);
  var s = absoluteSeconds > 9 ? absoluteSeconds : "0" + absoluteSeconds;
  return m + ":" + s;
}

export async function get_saved_tracks(token) {
  var items = [];

  const headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  let total;

  await axios
    .get("https://api.spotify.com/v1/me/tracks", { headers: headers })
    .then(async (res) => (total = await res.data.total))
    .catch(async (err) => {
      console.log("fetch error", err);
    });

  const promises = [];

  for (let offset = 0; offset <= total; offset += 50) {
    const res = new Promise((resolve, reject) => {
      axios
        .get(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`, {
          headers: headers,
        })
        .then((res) => resolve(res.data.items))
        .catch(async (err) => {
          console.log(err);
          reject(err);
        });
    });
    promises.push(res);
  }

  await Promise.all(promises).then((value) => {
    value.forEach((e) => {
      items = [...items, ...e];
    });
  });

  items.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));

  return items;
}

export function downloadFile({ data, fileName, fileType }) {
  const blob = new Blob([data], { type: fileType });

  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
}

export function export_data_json(songs) {
  downloadFile({
    data: JSON.stringify(songs),
    fileName: "saved_tracks.json",
    fileType: "text/json",
  });
}

export async function export_data_csv(songs) {
  const headers = [
    "#",
    "Title",
    "Artist",
    "Album",
    "Added At",
    "Duration",
  ].join(",");

  const songsCsv = await songs.map((e, i) => {
    return [
      i,
      e.track.name,
      e.track.artists[0].name,
      e.added_at,
      parseMillisecondsIntoReadableTime(e.track.duration_ms),
    ].join(",");
  });

  downloadFile({
    data: [headers, ...songsCsv].join("\n"),
    fileName: "saved_tracks.csv",
    fileType: "text/csv",
  });
}
