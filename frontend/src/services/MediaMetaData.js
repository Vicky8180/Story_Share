
const checkMediaType = async (url) => {
  let duration = null;
  let mediaType = "";
  let error = "";
  try {
    const result = await determineMediaType(url);
    if (result.type === "video") {
      mediaType = "video";
      duration = result.duration;
      if (result.duration > 15.0) {
        error = "Video length is more than 15 seconds";
      }

      return { duration, mediaType, error };
    } else if (result.type === "image") {
      mediaType = "image";
      duration = null;
      error = "";
      return { duration, mediaType, error };
    }
  } catch (err) {
    error = err.message;
    mediaType = "";
    duration = null;
  }
  return { duration, mediaType, error };
};

const determineMediaType = (url) => {
  return new Promise((resolve, reject) => {
    const videoExtensions = ["mp4", "webm", "ogg", "mov", "mkv"];
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
  //  console.log(url)
    if(url===undefined){
      reject(new Error("Can't be empty"));
    }
    const extension = url.split(".").pop().toLowerCase();

    if (imageExtensions.includes(extension)) {
      resolve({ type: "image" });
    } else if (videoExtensions.includes(extension)) {
      const video = document.createElement("video");
      video.src = url;

      video.onloadedmetadata = () => {
        resolve({ type: "video", duration: video.duration });
      };

      video.onerror = () => {
        reject(new Error("Error loading video metadata."));
      };
    } else {
      reject(new Error("Unknown file format."));
    }
  });
};

export default checkMediaType;
