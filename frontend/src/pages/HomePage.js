import React, { useEffect, useState } from "react";
import Filters from "../components/filters/Filters";
import StoryList from "../components/story_lists/StoryList";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
import NewNavbar from "../components/navbar/newNavbar";
import { useNavigate } from "react-router-dom";
import showToast from "../services/toast/Toast";
export default function HomePage() {
  const [storiesByCategory, setStoriesByCategory] = useState([]);
  const [yourStories, setYourStories] = useState();
  const loggedin = useSelector((state) => state.loggedin).loggedin;
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const fetchStories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/story/fetch?userId=${user_id}`
      );

      // your_stories=response.data.Your_Stories
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
   console.log("Share-Story-X: is live now!")
  return (
    <>
      <NewNavbar />
      <Filters />

      {storyByCategory &&
        storyByCategory.storyByCategory.map((item) => (
          <StoryList
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
  );
}
