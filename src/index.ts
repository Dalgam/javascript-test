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
// Also only allow title and grade to change to prevent corruption of the data by allowing the user to change id somehow
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
const createGradeStars = (
  videoId: number,
  currentGrade: number,
  maxGrade: number,
  onChange: (event: Event) => Promise<void>
) => {
  // inspired by https://codepen.io/jrsdiniz/pen/OJVdXjx
  const stars = document.createElement("div");
  stars.classList.add("stars");
  stars.id = `stars_${videoId}`;
  Array.apply(null, Array(maxGrade)).forEach((element, index) => {
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "grade";
    input.value = (index + 1).toString();
    input.checked = currentGrade === index + 1;
    input.id = `star${index + 1}_${videoId}`;
    stars.appendChild(input);
    const label = document.createElement("label");
    label.classList.add("star");
    if (index + 1 === currentGrade) label.classList.add("active");
    input.onchange = onChange;

    label.htmlFor = `star${index + 1}_${videoId}`;
    label.ariaHidden = "true";
    label.title = `${index + 1} star`;
    stars.appendChild(label);
  });

  return stars;
};

//Might constitute performance issues if the list is too long
const createVideoList = (videos: Video[]) => {
  const videoList = document.getElementById("video_list");
  if (videoList) {
    videoList.innerHTML = "";
    videos.forEach((_video, index) => {
      const video = videos[index];
      const posterUrl = posterPlaceholder;
      //change posterUrl when the api is extended

      const videoElement = document.createElement("div");
      videoElement.id = `video_${video.id}`;
      videoElement.classList.add("video");
      videoElement.innerHTML = `
        <img src="${posterUrl}" alt="Poster for ${video.title}"/>
        <h2>${video.title}</h2>
      `;

      const stars = createGradeStars(video.id, video.grade, 5, async (event) => {
        const target = event.target as HTMLInputElement;

        if (!target || target.classList.contains("disabled")) return;
        //Prevent further requests to avoid race conditions.
        // Alternatives would be, cancel previous request, discard all but last request,
        // queue the latest query, debounce the input, or a combination depending intended UX
        target.parentElement?.classList.add("disabled");
        await handleGradeChange(video.id, parseInt(target.value));
        target.parentElement?.classList.remove("disabled");
      });
      videoElement.appendChild(stars);
      videoList.appendChild(videoElement);
    });
  }
};

const handleGradeChange = async (videoId: number, newGrade: number) => {
  updateVideo(videoId, { grade: newGrade });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  //alternatively, find and update the star element directly
  const videos = await getVideos();
  createVideoList(videos);
};

const handleSearch = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.disabled) return;
  //Prevent further requests to avoid race conditions.
  // Alternatives would be, cancel previous request, discard all but last request,
  // queue the latest query, debounce the input, or a combination depending intended UX
  target.disabled = true;
  const videos = await getVideos(target.value);
  createVideoList(videos);
  target.disabled = false;
};

const init = async () => {
  await getVideos().then(createVideoList);

  //Maybe do this as a form with a button and handle the submit event instead
  const searchInput = document.getElementById("search_input");
  if (searchInput) {
    searchInput.onkeydown = handleSearch;
  }
};

init();
