import React, { useState, useEffect, useRef } from "react";
import "./ViewStory.css";
import Slider from "./slider/Slider";
import VSCrossIcon from "../../assets/ViewStoryCrossIcon.png";
import VSShareIcon from "../../assets/VSShareIcon.png";
import VSLikesIcon from "../../assets/VSLikesIcon.png";
import VSBookmarksIcon from "../../assets/VSBookmarksIcon.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "../loader/Loader";
import {
  addItem,
  resetItems,
} from "../../redux_tool_kit/slices/TraversedSlice";
import leftArrow from "../../assets/leftArrow.png";
import rightArrow from "../../assets/rigjtArrow.png";
import downloadIcon from "../../assets/download_2 (1).png";
import whiteBookmark from "../../assets/whiteBookmark.png";
import blueBookmarks from "../../assets/blueBookmark.png";
import RedIcon from "../../assets/redLike.png";
import Portal from "../../services/portal/Portal";
import Register from "../auth/Register/Register";
import { useNavigate } from "react-router-dom";
import ScaleUpEffect from "../../services/effects/ScaleUp";
import CopiedEffect from "../../services/effects/CopiEffect";
import showToast from "../../services/toast/Toast";
import Mute from "../../assets/mute.png"
import UnMute from "../../assets/unmute.png"
export default function ViewStory({
  close,
  storyId,
  slideNumber,
  bookmarking,
  bookmarking_id,
}) {
  const each_slides2 = useSelector((state) => state.each_slides);
  const localSlides = each_slides2.each_slides;
  const ifslideNumberNotUndefined = slideNumber || 0;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(
    ifslideNumberNotUndefined
  );
  const videoRef = useRef(null);
  const [traversed, setTraversed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmark, setBookmark] = useState(false);
  const [bookmarkData, setBookmarkData] = useState();
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  // const loggedin = localStorage.getItem("token") ? true : false;
  const navigate = useNavigate();
  const loggedin = useSelector((state) => state.loggedin).loggedin;

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Text copied to clipboard", true);
      })
      .catch((err) => {
        showToast("Failed to copy text:", false);
      });
  }
  const generateSharableUrl = async () => {
    try {
      const slideNumber = currentSlideIndex;
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/story/share/generateurl`,
        { storyId, slideNumber }
      );
      copyToClipboard(response.data.data);
      const copieffect_id = document.getElementById("copieffect_id");
      CopiedEffect(copieffect_id, 200, 900);
    } catch (error) {
      showToast(error.response.data.message, false);
    }
  };

  const FetchBookmarkAPI = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");
      if (userId) {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL_PORT}/api/story/fetch/bookmark`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookmarkData(() => {
          const tempArray = response.data.data.bookmarks.map((bookmark) => ({
            slideNumber: bookmark.slideNumber,
            userId,
            storyId: bookmark.storyId._id,
          }));
          return tempArray;
        });

        isBookmarkedOrNot();
      }
    } catch (error) {
      showToast(error.response.data.message, false);
    }
  };

  useEffect(() => {
    FetchBookmarkAPI();
  }, [bookmark, currentSlideIndex]);

  const isBookmarkedOrNot = () => {
    const userId = localStorage.getItem("user_id");
    if (bookmarkData) {
      const isBookmarked = bookmarkData.some((bookmarks) =>
        bookmarks.storyId === bookmarking
          ? bookmarking_id
          : storyId &&
            bookmarks.slideNumber === currentSlideIndex &&
            bookmarks.userId === userId
      );
      //   console.log(bookmarkData)
      //  console.log(isBookmarked)
      //  console.log(storyId)
      //  console.log(currentSlideIndex)
      //  console.log(userId)
      setBookmark(isBookmarked);
    }
  };

  useEffect(() => {
    isBookmarkedOrNot();
  }, [bookmarkData, currentSlideIndex]);

  const [openLoginRegister, setOpenLoginRegister] = useState(false);

  const BookmarkAndUnbookmarking = () => {
    if (loggedin) {
      if (bookmark) {
        UnBookmarkAPI();
      } else {
        BookmarkAPI();
      }
      const bookmark_id = document.getElementById("bookmark_id");
      ScaleUpEffect("bookmark_id");
    } else {
      setOpenLoginRegister((prev) => !prev);
    }
  };

  const BookmarkAPI = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const slideNumber = currentSlideIndex;
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/story/bookmark`,
        { storyId, slideNumber, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookmark(true);
    } catch (error) {
      showToast(error.response.data.message, false);
    }
  };

  const UnBookmarkAPI = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const slideNumber = currentSlideIndex;
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/story/unbookmark`,
        { storyId, slideNumber, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookmark(false);
    } catch (error) {
      showToast(error.response.data.message, false);
    }
  };

  const leftButtonFun = () => {
    setCurrentSlideIndex((pre) => {
      if (pre >= 1) {
        return pre - 1;
      } else {
        return localSlides.length - 1;
      }
    });
  };

  const rightButtonFun = () => {
     dispatch(addItem(currentSlideIndex))
    setCurrentSlideIndex((pre) => {
      if (pre < localSlides.length - 1) {
        return pre + 1;
      } else {
        return 0;
      }
    });
  };

  useEffect(() => {
    if (!localSlides.length) return;
    const currentItem = localSlides[currentSlideIndex];

    if (!loading) {
      const timeoutId = setTimeout(() => {
        setCurrentSlideIndex(
          (prevIndex) => (prevIndex + 1) % localSlides.length
        );
        setLoading(true);
      }, currentItem.duration * 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentSlideIndex, localSlides, loading]);

  useEffect(() => {
    if (!localSlides.length) return;
    const currentItem = localSlides[currentSlideIndex];

    try {
      if (currentItem.mediaType === "video" && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    } catch (error) {
      showToast("Issue in video playing", false);
    }
  }, [currentSlideIndex, localSlides]);

  const pushInTraversed = (index) => {
    setTraversed((prev) => [...prev, index]);
  };

  const handleImageLoad = () => setLoading(false);
  const handleVideoLoad = () => setLoading(false);

  const dispatch = useDispatch();
  const resetState = () => {
    setCurrentSlideIndex(ifslideNumberNotUndefined);
    setTraversed([]);
    dispatch(resetItems());

    setLoading(true);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClose = () => {
    resetState();
    close();
    if (loggedin) {
      navigate("/admin");
    }
  };

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    const swipeThreshold = 50;

    if (swipeDistance > swipeThreshold) {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % localSlides.length);
    } else if (swipeDistance < -swipeThreshold) {
      setCurrentSlideIndex((prevIndex) =>
        prevIndex === 0 ? localSlides.length - 1 : prevIndex - 1
      );
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const toggleLikeAndUnlike = () => {
    const userId = localStorage.getItem("user_id");
    if (
      localSlides &&
      localSlides[currentSlideIndex].likedByUserArray.some(
        (like) =>
          like.byUser === userId && like.sliderNumber === currentSlideIndex
      )
    ) {
      setLike(() => {
        return true;
      });
      setLikeCount(() => {
        return localSlides[currentSlideIndex].likeCount;
      });
    } else {
      setLike(() => {
        return false;
      });
      setLikeCount(() => {
        return localSlides[currentSlideIndex].likeCount;
      });
    }
  };

  useEffect(() => {
    toggleLikeAndUnlike();
  }, [localSlides, currentSlideIndex, storyId]);
  // [like, currentSlideIndex, localSlides, storyId]
  const LikingAndUnliking = async () => {
    if (loggedin) {
      toggleLikeAndUnlike();
      LikeAPI();
    } else {
      setOpenLoginRegister((prev) => {
        return !prev;
      });
    }
  };

  const LikeAPI = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const slideNumber = currentSlideIndex;
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/story/like`,
        {
          storyId,
          slideNumber,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast(res.data.message, true);
      setLike(() => {
        return res.data.like;
      });
      if (res.data.like) {
        setLikeCount(() => {
          return likeCount + 1;
        });
      } else {
        setLikeCount(() => {
          return likeCount - 1;
        });
      }
    } catch (error) {
      showToast(error.response.data.message, false);
    }
  };
  const tempLoggedIn = () => {
    console.log("just for checking ");
  };

  const fullUrl = window.location.href;
  const urlStr = fullUrl.split("/");
  var url = `api/story/share/${urlStr[urlStr.length - 2]}/${
    urlStr[urlStr.length - 1]
  }`;

  const downloadMedia = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        showToast("Can't download CORS restricted", false);
        throw new Error("Failed to fetch the file. Status: " + response.status);
      }
      const extension = fileUrl.split(".").pop().toLowerCase();
      const fileName = `${localSlides[currentSlideIndex].heading}${extension}`;
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      showToast("File downloaded", true);
    } catch (error) {
      showToast("Can't download CORS restricted", false);
    }
  };

  const [mute, setMute]=useState(false)


  return (
    <>
      {loggedin == false && openLoginRegister == true ? (
        <Portal
          component={
            <Register
              style={{ backgroundColor: "red" }}
              close={LikingAndUnliking}
              heading={"Register"}
              tempLoggedIn={tempLoggedIn}
              redirectTo={url}
            />
          }
        />
      ) : (
        ""
      )}

      <div
        className="viewstory_container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="viewstory_left" onClick={leftButtonFun}>
          <img alt="left" src={leftArrow} />
        </div>
        <div
          className="viewstory_center_container"
          style={
            localSlides[currentSlideIndex]?.mediaType === "image"
              ? {
                  backgroundImage: `url(${localSlides[currentSlideIndex].link})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }
              : {}
          }
        >
          {localSlides[currentSlideIndex]?.mediaType === "image" && (
            <img
              src={localSlides[currentSlideIndex].link}
              alt="Story Slide"
              style={{ display: "none" }}
              onLoad={handleImageLoad}
            />
          )}

          {localSlides[currentSlideIndex]?.mediaType === "video" && (
            <video
              ref={videoRef}
              className="viewstory_display_play_video"
              src={localSlides[currentSlideIndex].link}
              controls={false}
              autoPlay
              muted={mute}
              loop={false}
              onLoadedData={handleVideoLoad}
            />
          )}

          <div className="viewstory_top">
            <Slider
              each_slides={localSlides}
              currentSlideIndex={currentSlideIndex}
              onSlideComplete={() =>
                setCurrentSlideIndex((prev) => (prev + 1) % localSlides.length)
              }
              traversed={traversed}
              pushInTraversed={pushInTraversed}
            />

            <div className="viewstory_cross_and_share">
              <img
                className="viewstory_cross"
                alt="del"
                style={{ cursor: "pointer" }}
                onClick={handleClose}
                src={VSCrossIcon}
              />
             
             {localSlides[currentSlideIndex]?.mediaType === "video" ?    <img
                className="viewstory_share"
                alt="share"
                style={{ cursor: "pointer" }}
                onClick={()=>{
                  setMute(!mute)
                }}
                src={mute? Mute:UnMute}
              />:<></>}
          

              <img
                className="viewstory_share"
                alt="share"
                style={{ cursor: "pointer" }}
                onClick={generateSharableUrl}
                src={VSShareIcon}
              />
            </div>
          </div>

          {loading && <Loader />}
          <div id="copieffect_id" className="viewstory_bottom">
            <div className="viewstory_like_and_bookmarks">
              <img
                onClick={BookmarkAndUnbookmarking}
                className="viewstory_bookmarks"
                alt="bookmarks"
                src={bookmark ? blueBookmarks : whiteBookmark}
              />

              {loggedin ? (
                <img
                  className="viewstory_bookmarks"
                  alt="download"
                  src={downloadIcon}
                  onClick={() =>
                    downloadMedia(localSlides[currentSlideIndex].link)
                  }
                />
              ) : (
                <></>
              )}
              <div>
                <img
                  className="viewstory_likes"
                  alt="likes"
                  id="bookmark_id"
                  onClick={LikingAndUnliking}
                  //  onClick={LikeAPI}
                  src={
                    // localSlides[currentSlideIndex].likedOrNot
                    like ? RedIcon : VSLikesIcon
                  }
                />
                <span className="like_count">{likeCount}</span>
              </div>
            </div>

            <div className="viewstory_heading_and_des">
              <div className="viewstory_heading">
                {localSlides[currentSlideIndex].heading}
              </div>
              <div className="viewstory_des">
                {localSlides[currentSlideIndex].description}
              </div>
            </div>
          </div>
        </div>
        <div className="viewstory_right" onClick={rightButtonFun}>
          {" "}
          <img alt="right" src={rightArrow} />
        </div>
      </div>
    </>
  );
}
