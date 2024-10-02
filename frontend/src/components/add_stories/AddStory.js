import React, { useState, useEffect } from "react";
import "./AddStory.css";
import ASDeleteIcon from "../../assets/ASDeleteIcon.png";
import checkMediaType from "../../services/MediaMetaData";
import axios from "axios";
import showToast from "../../services/toast/Toast";
import { useNavigate } from "react-router-dom";
export default function AddStory({ close, previousData, editingEnable }) {
  const [duration, setDuration] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [storyArray, setStoryArray] = useState([]);
  const [slideNumber, setSlideNumber] = useState([0, 1, 2]);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [isSelected, setIsSelected] = useState(false);
  const [errorArray,setErrorArray]=useState([]);;
  const navigate = useNavigate();

  useEffect(() => {
    if (previousData) {
      setSelectedCategory(() => {
        return previousData.category || "";
      });
      setStoryArray(previousData.each_slides || []);
      setSelectedSlide(0);
      setSlideNumber(() => {
        var tempArray = [];
        if (previousData.each_slides.length <= 3) {
          for (let i = 0; i < 3; i++) {
            tempArray.push(i);
          }
        } else {
          for (let i = 0; i < previousData.each_slides.length; i++) {
            tempArray.push(i);
          }
        }

        return tempArray;
      });
      if (previousData.each_slides && previousData.each_slides.length > 0) {
        const firstSlide = previousData.each_slides[0];
        setHeading(firstSlide.heading || "");
        setDescription(firstSlide.description || "");
        setLink(firstSlide.link || "");
        setMediaType(firstSlide.mediaType || "");
        setDuration(firstSlide.duration || null);
        setSelectedCategory(previousData.category || "");
      }
    }
  }, [previousData]);

  const categories = [
    { value: "", label: "Select a category" },
    { value: "Food", label: "Food" },
    { value: "Health and Fitness", label: "Health and Fitness" },
    { value: "Travel", label: "Travel" },
    { value: "Movie", label: "Movie" },
    { value: "Education", label: "Education" },
  ];

  const handleCreateStory = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      const user_id = localStorage.getItem("user_id");

      const token = localStorage.getItem("token");
      if (
        storyArray.length >= 3 &&
        eachSlideValidation(heading, description, selectedCategory, link)
          .success &&
        errorArray.length===0
      ) {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL_PORT}/api/story/create`,
          { storyArray, user_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
       
        showToast(response.data.message, true);
        close();
        window.location.reload();
        navigate("/admin");
      } else {
        if(errorArray.length>0){
           return showToast(`Slide ${errorArray[0].id} ${errorArray[0].message}`,false )
        }
        if(!eachSlideValidation.success){
         return  showToast(
            error ||
              eachSlideValidation(heading, description, selectedCategory, link)
                .message ||
              "Fileds are empty",
            false
          )
        }
        ;
      }
    } catch (error) {
      showToast(error.response.data.message, false);
    }
  };

  const handleChangeHeading = (event) => {
    const newHeading = event.target.value;
    setHeading(newHeading);

    setStoryArray((prevStoryArray) => {
      const updatedStoryArray = [...prevStoryArray];
      updatedStoryArray[selectedSlide] = {
        ...updatedStoryArray[selectedSlide],
        heading: newHeading,
      };
      return updatedStoryArray;
    });
  };

  const handleChangeDescription = (event) => {
    const newDescription = event.target.value;
    setDescription(newDescription);

    setStoryArray((prevStoryArray) => {
      const updatedStoryArray = [...prevStoryArray];
      updatedStoryArray[selectedSlide] = {
        ...updatedStoryArray[selectedSlide],
        description: newDescription,
      };
      return updatedStoryArray;
    });
  };

  const initialCheckmedia = async (newLink) => {
    const data = await checkMediaType(newLink);
    setError(data.error);
  };

  useEffect(() => {
    initialCheckmedia(link);
  }, [selectedSlide, link]);

  const handleChangeLink = async (event) => {
    const newLink = event.target.value;
    setLink(newLink);

    setStoryArray((prevStoryArray) => {
      const updatedStoryArray = [...prevStoryArray];
      updatedStoryArray[selectedSlide] = {
        ...updatedStoryArray[selectedSlide],
        link: newLink,
      };
      return updatedStoryArray;
    });
    var data;
    if (newLink) {
   data  = await checkMediaType(newLink);
      setError(()=>{
        return data.error
      });
      setDuration(data.duration);
      setMediaType(data.mediaType);

      setStoryArray((prevStoryArray) => {
        const updatedStoryArray = [...prevStoryArray];
        updatedStoryArray[selectedSlide] = {
          ...updatedStoryArray[selectedSlide],
          mediaType: data.mediaType,
          duration: data.duration,
        };
        return updatedStoryArray;
      });
    }

  
    
    setErrorArray((prevErrorArray) => {
      console.log(data)
      if ( data && data.error !== "") {
  
        const existingErrorIndex = prevErrorArray.findIndex((err) => err.id === selectedSlide);
    
        if (existingErrorIndex !== -1) {
       
          const updatedErrorArray = [...prevErrorArray];
          updatedErrorArray[existingErrorIndex] = { id: selectedSlide, message: data.error};
          return updatedErrorArray;
        } else {
      
          return [...prevErrorArray, { id: selectedSlide, message: data.error}];
        }
      } else {
    
        return prevErrorArray.filter((err) => err.id !== selectedSlide);
      }
    });
    
  };

  const handleChangeCategory = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(() => {
      return newCategory;
    });
    // error exist here

    setIsSelected(newCategory !== "");

    setStoryArray((prevStoryArray) => {
      const updatedStoryArray = [...prevStoryArray];
      updatedStoryArray.forEach((item) => {
        item.category = newCategory;
      });
      return updatedStoryArray;
    });




  };
 
  const updateSlidesInArray = () => {
    setIsSelected(selectedCategory !== "");
    if (
      error === "" &&
      eachSlideValidation(heading, description, selectedCategory, link).success
    ) {
      if (selectedSlide < slideNumber.length - 1) {
        setSelectedSlide((prevSlide) => {
          settingCurrentInputsFun(prevSlide + 1);
          return prevSlide + 1;
        });
      }
      if (
        previousData &&
        previousData.each_slides.length >= slideNumber.length
      ) {
        setHeading(previousData.each_slides[selectedSlide].heading || "");
        setDescription(
          previousData.each_slides[selectedSlide].description || ""
        );
        setLink(previousData.each_slides[selectedSlide].link || "");
        setMediaType(previousData.each_slides[selectedSlide].mediaType || "");
        setDuration(previousData.each_slides[selectedSlide].duration || null);
        setSelectedCategory("");
      } else {
        setHeading("");
        setDescription("");
        setLink("");
        setMediaType("");
        setDuration(null);
        setSelectedCategory("");
      }
    } else {
      const message =
        error ||
        eachSlideValidation(heading, description, selectedCategory, link)
          .message ||
        "Please fill all field or change the category";
      showToast(message, false);
    }
  };

  const eachSlideValidation = (
    heading,
    description,
    selectedCategory,
    link
  ) => {
    if (!heading) {
      return { success: false, message: "Heading field is empty" };
    }
    if (!description) {
      return { success: false, message: "Description field is empty" };
    }
    if (!selectedCategory) {
      return { success: false, message: "Category field is empty" };
    }
    if (!link) {
      return { success: false, message: "Link field is empty" };
    }

    return { success: true, message: "" };
  };

  const prevButton = () => {
    setIsSelected(selectedCategory !== "");
    if (selectedSlide >= 1) {
      setSelectedSlide((prevSlide) => {
        settingCurrentInputsFun(prevSlide - 1);
        return prevSlide - 1;
      });
    }
  };

  const AddSlides = () => {
    // onSlide(slideNumber.length)
    setIsSelected(selectedCategory !== "");
    setSlideNumber((prev) => {
      if(storyArray.length>=3){
        return [...prev, prev.length];
      }else {
        showToast("Please fill first 3 slides", false)
        return prev
      }
     
    });

    setSelectedSlide((prev) => {
      if(storyArray.length>=3){
        return slideNumber.length;
      }else {
        return prev
      }
     
    });
    
    if(storyArray.length>=3){
      setHeading("");
      setDescription("");
      setLink("");
      setMediaType("");
      setDuration(null);
      setSelectedCategory("");
    }

  
      
  };

console.log(storyArray)

  const RemoveSlides = (slide) => {
    setSlideNumber((prevSlides) => {
      const temp = prevSlides.filter((item) => item !== slide);
      temp.forEach((item2, idx) => {
        temp[idx] = idx;
      });
      return temp;
    });
    setStoryArray((prevStoryArray) =>
      prevStoryArray.filter((_, idx) => idx !== slide)
    );
  };



  const onSlide = (slide) => {
  
  
    

    if(storyArray.length<slide){
      return showToast(`First fill previous ${slide} slides `, false);
    }
   
    if (selectedSlide < slide) {
      setSelectedSlide(slide);
      settingCurrentInputsFun(slide);
      setIsSelected(selectedCategory !== "");
  
      if (previousData && previousData.each_slides.length > slide) {
   
        const slideData = previousData.each_slides[slide] || {};
        setHeading(slideData.heading || storyArray[slide]?.heading || "");
        setDescription(slideData.description || storyArray[slide]?.description || "");
        setLink(slideData.link || storyArray[slide]?.link || "");
        setMediaType(slideData.mediaType || storyArray[slide]?.mediaType || "");
        setDuration(slideData.duration || storyArray[slide]?.duration || null);
      } else if (selectedSlide > slide) {
       
        settingCurrentInputsFun(slide);
      } else {
       
        setHeading(storyArray[slide]?.heading || "");
        setDescription( storyArray[slide]?.description || "");
        setLink( storyArray[slide]?.link || "");
        setMediaType(storyArray[slide]?.mediaType || "");
        setDuration(storyArray[slide]?.duration || null);
        setSelectedCategory("");
      }
    } else {
      
      setSelectedSlide(slide);
      settingCurrentInputsFun(slide);
      setIsSelected(selectedCategory !== "");
    }
  };
  
























  const settingCurrentInputsFun = (slide) => {
    const data = storyArray[slide];
    if (data !== undefined) {
      setHeading(data.heading);
      setDescription(data.description);
      setLink(data.link);
      // setSelectedCategory(data.selectedCategory);
      setSelectedCategory("");
    }
  };

  const validateInputs = () => {
    if (storyArray.length < 3) {
      showToast("You must add at least 3 slides.", false);
      return false;
    }
  
    // if (error) {
    //    return showToast(error, false);
    // }

    for (let i = 0; i < storyArray.length; i++) {
      const slide = storyArray[i];
  

      console.log(slide)
      if (
        !slide.heading ||
        !slide.description ||
        !slide.link ||
        !slide.category
      ) {
        showToast(`All fields must be filled for slide ${i + 1}.`, false);
        return false;
      }
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      const story_id = previousData._id;
      const token = localStorage.getItem("token");
      if (
        storyArray.length >= 3 &&
        eachSlideValidation(heading, description, selectedCategory, link)
          .success &&
        errorArray.length===0
      ) {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL_PORT}/api/story/update`,
          { story_id, storyArray },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showToast(res.data.message, true);
        close();
        window.location.reload();
        navigate("/admin");
      } else {
        console.log(errorArray)
        if(errorArray.length>0){
          return showToast(`Slide ${errorArray[0].id+1} ${errorArray[0].message}`,false )
       }
       if(!eachSlideValidation.success){
        return  showToast(
           error ||
             eachSlideValidation(heading, description, selectedCategory, link)
               .message ||
             "Fileds are empty",
           false
         )
       }
      }
    } catch (error) {
      showToast(error.response.data.message, false);
    }
  };

  return (
    <>
      <div className="add_story_container">
        <div className="add_story_close_btn" onClick={close}>
          <img
            alt="del"
            style={{ width: "3vh", height: "3vh" }}
            src={ASDeleteIcon}
          />
        </div>
        <div className="mobile_view_story_heading">Add Story to feed</div>
        <div className="add_story_input_container">
          <div className="add_story_slides">
            {slideNumber.map((slide) => (
              <div key={slide}>
                <div
                  className="add_story_each_slides"
                  onClick={() => onSlide(slide)}
                  style={{
                    border:
                      selectedSlide === slide
                        ? "0.3vh solid rgba(115, 171, 255, 1)"
                        : "",
                  }}
                >
                  Slide {slide + 1}
                </div>
                {slide >= 3 ? (
                  <img
                    alt="del"
                    onClick={() => RemoveSlides(slide)}
                    className="slide_remove_cross"
                    src={ASDeleteIcon}
                  />
                ) : null}
              </div>
            ))}
            {slideNumber.length < 6 && (
              <div className="add_story_each_slides" onClick={AddSlides}>
                Add +
              </div>
            )}
          </div>
          <div className="add_story_input_boxs">
            <form className="add_story_input_box_form">
              <div className="add_story_input_box_1">
                <label>Heading:</label>
                <input
                  type="text"
                  style={{
                    border: "0.2vh solid",
                    borderColor: heading ? "" : "red",
                    outline: "none",
                  }}
                  placeholder="Your Heading"
                  value={heading}
                  onChange={handleChangeHeading}
                />
              </div>
              <div className="add_story_input_box_2">
                <label>Description:</label>
                <textarea
                  placeholder="Story Description"
                  style={{
                    border: "0.2vh solid",
                    borderColor: description ? "" : "red",
                    outline: "none",
                  }}
                  value={description}
                  onChange={handleChangeDescription}
                ></textarea>
              </div>
              <div className="add_story_input_box_3">
                <label>Image/Video URL:</label>
                <input
                  style={{
                    border: "0.2vh solid",
                    borderColor: duration > 15 || error ? "red" : "",
                    outline: "none",
                  }}
                  type="text"
                  placeholder="Add Img/Video URL"
                  value={link}
                  onChange={handleChangeLink}
                />
                <span className="show_error">{error}</span>
              </div>
              <div className="add_story_input_box_4">
                <label>Category:</label>
                <select
                  id="category-select"
                  className="selecte_category_input"
                  value={selectedCategory}
                  onChange={handleChangeCategory}
                  style={{
                    border: "0.2vh solid",
                    borderColor: isSelected ? "" : "red",
                    outline: "none",
                  }}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
        <div className="add_story_bottom_btns">
          <div className="add_story_bottom_btn_left">
            <button
              onClick={prevButton}
              style={{ backgroundColor: "rgba(126, 255, 115, 1)" }}
            >
              Prev
            </button>
            <button
              onClick={updateSlidesInArray}
              style={{ backgroundColor: "rgba(115, 171, 255, 1)" }}
            >
              Next
            </button>
          </div>
          <div className="add_story_bottom_btn_right">
            {editingEnable ? (
              <button onClick={handleUpdate}>Update</button>
            ) : (
              <button onClick={handleCreateStory}>Post</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
