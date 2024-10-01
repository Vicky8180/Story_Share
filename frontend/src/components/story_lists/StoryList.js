import React, { useState, useEffect } from "react";
import "./StoryList.css";
import Portal from "../../services/portal/Portal";
import ViewStory from "../view_story/ViewStory";
import ViewStoryPortal from "../../components/view_story/ViewStoryPortal";
import EditIcon from "../../assets/editIcon8.png";
import { addItem } from "../../redux_tool_kit/slices/EachSlideSlice";
import { useDispatch } from "react-redux";
import AddStory from "../add_stories/AddStory";

export default function StoryList({ loggedIn, heading, stories }) {
  const dispatch = useDispatch();
  const [initialDisplayArray, setInitialDisplayArray] = useState([]);
  useEffect(() => {
    const updatedInitialDisplayArray =
      stories && stories.length > 4 ? stories.slice(0, 4) : stories;
    setInitialDisplayArray(updatedInitialDisplayArray);
    setDisplayArray(updatedInitialDisplayArray);
  }, [stories]);

  const [displayArray, setDisplayArray] = useState(initialDisplayArray);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewEachStory, setViewEachStory] = useState(false);
  const [each_slide_Curr, setEach_Slide_Curr] = useState([]);

  const seeMore = () => {
    setDisplayArray(stories);
    setIsExpanded(true);
  };

  const seeLess = () => {
    setDisplayArray(initialDisplayArray);
    setIsExpanded(false);
  };

  const viewStoryFun = (item) => {
    if (item) {
      dispatch(addItem(item.each_slides));
    }
    setEach_Slide_Curr(item);
    setViewEachStory(!viewEachStory);
  };

  const [edit, setEdit] = useState(false);
  const [currentItemToEdit, setCurrentItemToEdit] = useState(null);

  const toggleEditFunction = (item) => {
    setCurrentItemToEdit(item);
    setEdit(!edit);
  };

  return (
    <div className="storylist_container">
      <div className="storylist_heading">Top Stories about {heading}</div>
      <div className="storylist_box">
        {stories &&
          displayArray.map((item, index) => (
            <div
              className="each_story"
              key={index}
              style={{
                backgroundImage: `
                  linear-gradient(to bottom, rgb(0, 0, 0) 0.1%, rgba(107, 101, 101, 0) 65%, rgb(0, 0, 0) 90%, rgb(0, 0, 0) 100%),
                url(${item.thumbnail})
              `,
              }}
            >
              <div
                onClick={() => viewStoryFun(item)}
                className="each_story_outer"
                style={{ width: "100%", height: "100%" }}
              >
                <div className="each_story_des">{item.description}</div>
                <div className="each_story_heading">{item.heading}</div>
              </div>
              {loggedIn && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEditFunction(item);
                  }}
                  className="storylist_edit_button"
                >
                  <img
                    alt="edit"
                    style={{ width: "2vh", height: "2vh" }}
                    src={EditIcon}
                  />
                  Edit
                </span>
              )}

              {edit && currentItemToEdit && (
                <Portal
                  component={
                    <AddStory
                      close={toggleEditFunction}
                      previousData={currentItemToEdit}
                      editingEnable={true}
                    />
                  }
                />
              )}
            </div>
          ))}
      </div>

      {displayArray.length >= 4 && (
        <div className="storylist_btn">
          {isExpanded ? (
            <button onClick={seeLess} style={{ cursor: "pointer" }}>
              See Less
            </button>
          ) : (
            <button onClick={seeMore} style={{ cursor: "pointer" }}>
              See More
            </button>
          )}
        </div>
      )}

      {viewEachStory ? (
        <ViewStoryPortal
          close={viewStoryFun}
          component={
            <ViewStory close={viewStoryFun} storyId={each_slide_Curr._id} />
          }
        />
      ) : (
        ""
      )}
    </div>
  );
}
