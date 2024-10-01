import React, { useState, useEffect } from "react";
import "./Filters.css";
import {
  addItems,
  removeItems,
} from "../../redux_tool_kit/slices/StoryByCategory";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ScaleUp from "../../services/effects/ScaleUp";
import showToast from "../../services/toast/Toast";

export default function Filters() {
  const filters = [
    {
      type: "Food",
      img: "https://cdn.aarp.net/content/dam/aarp/health/caregiving/2018/03/1140-nutrients-food-loved-ones-caregiving.jpg",
    },
    {
      type: "Health and Fitness",
      img: "https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?cs=srgb&dl=pexels-victorfreitas-703012.jpg&fm=jpg",
    },
    {
      type: "Travel",
      img: "https://img.freepik.com/premium-photo/full-shot-travel-concept-with-landmarks_1174912-5236.jpg",
    },
    {
      type: "Movie",
      img: "https://lajoyalink.com/wp-content/uploads/2018/03/Movie.jpg",
    },
    {
      type: "Education",
      img: "https://cdn.elearningindustry.com/wp-content/uploads/2022/02/shutterstock_1112381495.jpg",
    },
  ];
  const [selectedItems, setSelectedItems] = useState(["All"]);
  const [storiesByCategory, setStoriesByCategory] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    const tep = document.getElementById("filtering");
    ScaleUp(item);

    setSelectedItems((prevSelected) => {
      if (item === "All") {
        if (prevSelected.includes("All")) {
          dispatch(removeItems(storiesByCategory));
          return [];
        } else {
          dispatch(addItems(storiesByCategory));
          return ["All"];
        }
      } else {
        const isSelected = prevSelected.includes(item);
        const updatedSelection = isSelected
          ? prevSelected.filter((i) => i !== item)
          : [...prevSelected, item];
    
        updateSelection(isSelected, item, updatedSelection);
        return updatedSelection.includes("All")
          ? updatedSelection.filter((i) => i !== "All")
          : updatedSelection;
      }
    });
  };



  const updateSelection = (isSelected, item, updatedSelection) => {
    if (isSelected) {
      const deselectedStories = storiesByCategory.filter(
        (story) => story._id === item
      );
      dispatch(removeItems(deselectedStories));
    } else {
      const selectedStories = storiesByCategory.filter((story) =>
        updatedSelection.includes(story._id)
      );

      // const selectedStories = storiesByCategory.filter(
      //   (story) => story._id === item
      // );

      dispatch(addItems(selectedStories));
    }
  };

  const fetchStories = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/story/fetch?userId=${user_id}`
      );
      const stories = response.data.data;
      dispatch(addItems(stories));
      setStoriesByCategory(stories);
    } catch (error) {
      showToast(error.response.data.message, false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const newData = useSelector((state) => state.storyByCategory);

  return (
    <div className="filters_container">
      <div className="filters_items" onClick={() => handleItemClick("All")}>
        <div
          className={`overlay ${
            selectedItems.includes("All") ? "selected" : ""
          }`}
        >
          All
        </div>
      </div>

      {filters.map((item) => (
        <div
          id={item.type}
          key={item.type}
          className="filters_items"
          onClick={() => handleItemClick(item.type)}
          style={{
            backgroundImage: `url(${item.img})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div
            className={`overlay ${
              selectedItems.includes(item.type) ? "selected" : ""
            }`}
          >
            {item.type}
          </div>
        </div>
      ))}
    </div>
  );
}
