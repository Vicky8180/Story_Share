import React, { useEffect, useState } from "react";
import Filters from "../components/filters/Filters";
import StoryList from "../components/story_lists/StoryList";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
import MobileNavbar from "../components/navbar/MobileNavbar";
import NewNavbar from "../components/navbar/newNavbar";
import { useNavigate } from "react-router-dom";
import UnAuthorizedPage from "../components/auth/UnAuthrished/UnAuthrishdPage";
import showToast from "../services/toast/Toast";
export default function HomePage() {
  const [storiesByCategory, setStoriesByCategory] = useState([]);
  const [yourStories, setYourStories] = useState();
  const loggedin = useSelector((state) => state.loggedin).loggedin;
  // const loggedin=localStorage.getItem("token")?true:false

  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const fetchStories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/story/fetch?userId=${user_id}`
      );
      setYourStories((pre) => {
        return response.data.stories;
      });
      setStoriesByCategory((pre) => {
        return [...response.data.data];
      });
    } catch (error) {
      showToast(error.response.data.message, false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const storyByCategory = useSelector((state) => state.storyByCategory);

  return (
    <>
      {loggedin ? (
        <>
          <MobileNavbar />

          <Filters />

          {loggedin && yourStories && yourStories.length > 0 ? (
            <StoryList
          
              loggedIn={true}
              heading={"Your Stories"}
              stories={yourStories}
            />
          ) : (
            <></>
          )}
          {storyByCategory &&
            storyByCategory.storyByCategory.map((item, idx) => (
              <StoryList
              key={idx}
                loggedIn={false}
                heading={item._id}
                stories={item.stories}
              />
            ))}

          {storyByCategory.storyByCategory.length < 1 ? (
            <h2
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10vh",
              }}
            >
              Selected Categories have no Stories
            </h2>
          ) : (
            ""
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
