import React, { useEffect, useState } from "react";
import Filters from "../components/filters/Filters";
import StoryList from "../components/story_lists/StoryList";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import ViewStory from "../components/view_story/ViewStory";
import ViewStoryPortal from "../components/view_story/ViewStoryPortal";
import { addItem } from "../redux_tool_kit/slices/EachSlideSlice";
import { useNavigate } from "react-router-dom";
import NewNavbar from "../components/navbar/newNavbar";
import MobileNavbar from "../components/navbar/MobileNavbar";
import showToast from "../services/toast/Toast";
export default function SharePage() {
  const [storiesByCategory, setStoriesByCategory] = useState([]);
  const [yourStories, setYourStories] = useState([]);
  const [data, setData] = useState({});
  const [openViewStory, setOpenViewStory] = useState(true);
  const loggedin = useSelector((state) => state.loggedin).loggedin;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const extract = (str) => {
    const newStr = str.toString();
    const splitArray = newStr.split("/");
    return splitArray.length > 3
      ? splitArray[splitArray.length - 2]
      : "00000000000000000000";
  };

  const toggleViewStory = () => {
    setOpenViewStory(!openViewStory);
    navigate("/");
  };

  const extractSlideNumber = (str) => {
    const newStr = str.toString();
    const splitArray = newStr.split("/");
    return splitArray.length > 3
      ? splitArray[splitArray.length - 1]
      : "00000000000000000000";
  };

  const fetchStories = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      const urlId = extract(window.location);
      const slideNumber = extractSlideNumber(window.location);

      console.log(urlId);

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/story/share/${urlId}/${slideNumber}`
      );
      

      setData((prev) => (response?.data?.data ? response.data.data : prev));

      dispatch(addItem(response?.data?.data?.storyData?.each_slides || []));
    } catch (error) {
      // console.log("Error fetching stories:", error);
      showToast("Error fetching stories",false)
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

 

  return (
    <>
      {loggedin ? <MobileNavbar /> : <NewNavbar />}
      <Filters />

      {loggedin && yourStories.length > 0 ? (
        <StoryList
          loggedIn={true}
          heading={"Your Stories"}
          stories={yourStories}
        />
      ) : (
        <></>
      )}

      {storiesByCategory.map((item) => (
        <StoryList loggedIn={false} heading={item._id} stories={item.stories} />
      ))}

      {openViewStory && data?.storyData?._id ? (
        <ViewStoryPortal
          component={
            <ViewStory
              close={toggleViewStory}
              storyId={data.storyData._id}
              slideNumber={data.slideNumber}
            />
          }
        />
      ) : (
        ""
      )}
    </>
  );
}
