//Temp suppress the error for this example. Not recommended for production code.
// @ts-ignore: Cannot find module
import posterPlaceholder from "./assets/poster_placeholder.png";
interface Video {
  id: number;
  title: string;
  grade: number;
}

// GET http://localhost:3000/videos
const getVideos = async (title?): Promise<Video[]> => {
  const url = new URL("http://localhost:3000/videos");
  if (title) {
    url.search = new URLSearchParams({ title_like: title }).toString();
  }
  const response = await fetch(url);

  return await response.json();
};

// PUT http://localhost:3000/videos/${id}
// I Chose to do a PATCH instead to prevent corruption of DB data .
// If PUT is absolutely necessary, I would have to make sure all fields are present in the request body.
// Also only allow title and grade to change to prevent corruption of the data by allwoing the user to change id somehow
const updateVideo = async (id: number, changes: { title?: string; grade?: number }): Promise<Video> => {
  const response = await fetch(`http://localhost:3000/videos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  return await response.json();
};

//Might constitute performance issues if the list is too long
const createVideoList = (videos: Video[]) => {
  const videoList = document.getElementById("video_list");
  if (videoList) {
    videoList.innerHTML = "";
    videos.forEach((video) => {
      const posterUrl = posterPlaceholder;
      //change posterUrl when the api is extended

      const videoElement = document.createElement("div");
      videoElement.classList.add("video");
      videoElement.innerHTML = `
        <img src="${posterUrl}" />
        <h2>${video.title}</h2>
      `;
      const inputElement = document.createElement("input");
      inputElement.type = "number";
      inputElement.min = "1";
      inputElement.max = "5";
      inputElement.value = video.grade.toString();
      inputElement.onchange = onGradeChange;
      inputElement.dataset.id = video.id.toString();

      videoElement.appendChild(inputElement);
      videoList.appendChild(videoElement);
    });
  }
};

const onGradeChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target || typeof target.dataset.id === "undefined") return;
  updateVideo(parseInt(target.dataset.id), { grade: parseInt(target.value) });
  // Make sure FE data is reflecting BE data here
};

const init = async () => {
  await getVideos().then(createVideoList);

  //Maybe do this as a form with a button and handle the submit event instead
  const searchInput = document.getElementById("search_input");
  if (searchInput) {
    searchInput.onkeydown = async (event) => {
      const target = event.target as HTMLInputElement;
      if (event.key === "Enter") {
        const videos = await getVideos(target.value);
        createVideoList(videos);
      }
    };
  }
};

init();
