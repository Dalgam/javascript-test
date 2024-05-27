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
// I Chose to do a PATCH instead to prevent corruption of DB data.
// If PUT is absolutely necessary, I would have to make sure all fields are present in the request body.
// Also only allow title and grade to change to prevent corruption of the data by allowing the user to change ID somehow.
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

//Using a function to allow the component to be reused.
const createGradeStars = (
  starGroupId: number,
  currentGrade: number,
  maxGrade: number,
  onChange: (event: Event) => Promise<void>
): HTMLElement => {
  // inspired by https://codepen.io/jrsdiniz/pen/OJVdXjx
  const stars = document.createElement("div");
  stars.classList.add("stars");
  stars.id = `stars_${starGroupId}`;
  Array.apply(null, Array(maxGrade)).forEach((element, index) => {
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "grade";
    input.value = (index + 1).toString();
    input.checked = currentGrade === index + 1;
    input.id = `star${index + 1}_${starGroupId}`;
    input.onchange = onChange;
    stars.appendChild(input);

    const label = document.createElement("label");
    label.classList.add("star");
    if (index + 1 === currentGrade) label.classList.add("active");
    label.htmlFor = `star${index + 1}_${starGroupId}`;
    label.ariaHidden = "true";
    label.title = `${index + 1} star`;

    stars.appendChild(label);
  });

  return stars;
};

//Might constitute performance issues if the list is too long
const createVideoList = (videos: Video[]): void => {
  const videoList = document.getElementById("video_list");
  if (videoList) {
    videoList.innerHTML = "";
    videos.forEach((_video, index) => {
      const video = videos[index];

      //change posterUrl when the api is extended
      const posterUrl = posterPlaceholder;

      //Create the video Card.
      const videoElement = document.createElement("div");
      videoElement.id = `video_${video.id}`;
      videoElement.classList.add("video");
      videoElement.innerHTML = `
        <img src="${posterUrl}" alt="Poster for ${video.title}"/>
        <h2>${video.title}</h2>
      `;

      //Create the grade stars.
      const stars = createGradeStars(
        video.id,
        video.grade,
        5,
        // Handle the grade change event.
        async (event) => {
          const target = event.target as HTMLInputElement;
          if (!target || target.classList.contains("disabled")) return;
          //Prevent further requests to avoid race conditions.
          // Alternatives would be, cancel previous request, discard all but last request,
          // queue the latest query, debounce the input, or a combination depending intended UX
          target.parentElement?.classList.add("disabled");
          await handleGradeChange(video.id, parseInt(target.value));
          target.parentElement?.classList.remove("disabled");
        }
      );

      // Add everything to the page.
      videoElement.appendChild(stars);
      videoList.appendChild(videoElement);
    });
  }
};

const handleGradeChange = async (videoId: number, newGrade: number): Promise<void> => {
  updateVideo(videoId, { grade: newGrade });
  //alternatively, find and update the star element directly
  await getVideos().then(createVideoList);
};

const handleSearch = async (query: string): Promise<void> => {
  await getVideos(query).then(createVideoList);
};

//Initial setup on page load.
const init = async (): Promise<void> => {
  await getVideos().then(createVideoList);
  //Maybe do this as a form with a button and handle the submit event instead.
  const searchInput = document.getElementById("search_input");
  if (searchInput) {
    searchInput.onkeydown = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.disabled) return;
      //Prevent further requests to avoid race conditions.
      // Alternatives would be, cancel previous request, discard all but last request,
      // queue the latest query, debounce the input, or a combination depending intended UX.
      target.disabled = true;
      handleSearch(target.value);
      target.disabled = false;
    };
  }
};

init();
