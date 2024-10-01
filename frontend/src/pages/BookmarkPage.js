import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import ViewStory from "../components/view_story/ViewStory";
import ViewStoryPortal from "../components/view_story/ViewStoryPortal";
import { addItem } from "../redux_tool_kit/slices/EachSlideSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MobileNavbar from "../components/navbar/MobileNavbar";
import showToast from "../services/toast/Toast";
import UnAuthorizedPage from "../components/auth/UnAuthrished/UnAuthrishdPage";
export default function BookmarkPage() {
  const videoRefs = useRef([]);
  const [data, setData] = useState();
  const [localSlides, setLocalSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewStoryState, setViewStoryState] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedin = useSelector((state) => state.loggedin).loggedin;
  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      const response = await axios.post(
       `${process.env.REACT_APP_BASE_URL_PORT}/api/story/fetch/bookmark`,
        { userId },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data);
      if (response.data.data && response.data.data.bookmarks) {
        setLocalSlides(
          response.data.data.bookmarks.map(
            (bookmark) => bookmark.storyId.each_slides[bookmark.slideNumber]
          )
        );
      }
    } catch (error) {
      // console.error('Error fetching bookmarks:', error);
      showToast(error.response.data.message, false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    if (!localSlides.length || !videoRefs.current[currentSlideIndex]) return;

    const currentItem = localSlides[currentSlideIndex];

    try {
      if (currentItem.mediaType === "video") {
        const currentVideo = videoRefs.current[currentSlideIndex];
        currentVideo.currentTime = 0;
        currentVideo.play();
      }
    } catch (error) {
      showToast("Error playing video:", false);
     
    }
  }, [currentSlideIndex, localSlides]);

  const viewStoryFun = (item) => {
    setViewStoryState(true);
    setSelectedItem(item);
    dispatch(addItem(item.storyId.each_slides));
  };

  const closeViewStory = () => {
    setViewStoryState(false);
    setSelectedItem(null);
  };



  return (
    <>
      {loggedin ? (
        <>
          <MobileNavbar />
          <div className="storylist_container">
            <div className="storylist_heading">
              <spna
                style={{ position: "relative", right: "45vh" }}
                onClick={() => {
                  navigate("/admin");
                }}
              >
                {" "}
                =={" "}
              </spna>
              Your Bookmakrs
            </div>
            <div className="storylist_box">
              {data &&
                data.bookmarks.map((item, index) => (
                  <div
                    key={index}
                    className="each_story"
                    style={{
                      overflow: "hidden",
                      backgroundImage: `
                    linear-gradient(
                      to bottom, 
                      rgb(0, 0, 0) 0.1%, 
                      rgba(107, 101, 101, 0) 65%, 
                      rgb(0, 0, 0) 90%, 
                      rgb(0, 0, 0) 100%
                    ), 
                    url(${item.storyId.each_slides[item.slideNumber].link})
                  `,
                    }}
                    onClick={() => viewStoryFun(item)}
                  >
                    {item.storyId.each_slides[item.slideNumber]?.mediaType ===
                      "video" && (
                      <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        className="viewstory_display_play_video"
                        src={item.storyId.each_slides[item.slideNumber].link}
                        controls={false}
                        autoPlay
                        muted
                        loop={false}
                      />
                    )}
                    <div className="each_story_des">
                      {item.storyId.each_slides[item.slideNumber]?.description}
                    </div>
                    <div className="each_story_heading">
                      {item.storyId.each_slides[item.slideNumber]?.heading}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {viewStoryState && selectedItem && (
            <ViewStoryPortal
              component={
                <ViewStory
                  close={closeViewStory}
                  storyId={selectedItem.storyId}
                  slideNumber={selectedItem.slideNumber}
                />
              }
            />
          )}
        </>
      ) : (
        <>
          <UnAuthorizedPage />
        </>
      )}
    </>
  );
}
