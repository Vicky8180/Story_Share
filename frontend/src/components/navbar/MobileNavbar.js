import React, { useState } from "react";
import "./Navbar.css";
import humburgerIcon from "../../assets/humburger.png";
import cross2Icon from "../../assets/cross2Icon.png";
import Portal from "../../services/portal/Portal";
import AddStory from "../add_stories/AddStory";
import Register from "../auth/Register/Register";
import BookmarkIcond from "../../assets/VSBookmarksIcon.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoggin } from "../../redux_tool_kit/slices/LoggedIn";
export default function Navbar2() {
  const [enableMenu, setenableMenu] = useState(false);
  const [logout, setLogout] = useState(false);
  const [register, setRegister] = useState(false);
  const [addStory, setAddStory] = useState(false);
  const loggedIn = localStorage.getItem("token") ? true : false;
  const [singIn, setSignIn] = useState(false);

  const navigate = useNavigate();
  const tempLoggedIn = () => {
    // setLoggedIn(!loggedIn);
    // SingInFun()
  };

  const SingInFun = () => {
    setSignIn(!singIn);
  };
  const dispacth = useDispatch();

  const RegisterFun = () => {
    setRegister(!register);
  };

  const tempLogout = () => {
    setLogout(!logout);
  };

  const AddStoryFun = () => {
    setAddStory(!addStory);
  };

  const enableAndDisable = () => {
    setenableMenu(!enableMenu);
    tempLogout();
  };

  const logoutFun = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    dispacth(setLoggin(false));
    navigate("/");
  };

  const NavigateToYourStory = () => {
    navigate("/admin");
  };

  const usernameFromLocalStorage = localStorage.getItem("username");
  return (
    <>
      <div className="navbar_container">
        <div className="navbar_after_login">
          <button
            className="navbar_register"
            onClick={() => {
              navigate("/bookmark");
            }}
          >
           <img src={BookmarkIcond} alt="bookmark" />
            Bookmarks
          </button>
          <button className="navbar_login" onClick={AddStoryFun}>
            Add Story{" "}
          </button>

          <div className="navbar_profile">
            <img
              src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
              alt="avatar"
            />
          </div>
          <div className="navbar_humburger">
            <img
              src={humburgerIcon}
              alt="humburgur"
              onClick={enableAndDisable}
            />
          </div>

          <div className={logout ? "navbar_logout" : "navbar_logout_none"}>
            <div>{usernameFromLocalStorage}</div>
            <button
              className="navbar_login"
              style={{ cursor: "pointer" }}
              onClick={logoutFun}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="navbar_mobile_loggedin">
          <img src={humburgerIcon} alt="humburgur" onClick={enableAndDisable} />
        </div>
      </div>
      <div
        className={
          enableMenu
            ? "navbar_mobile_view_container"
            : "navbar_mobile_view_container_none"
        }
      >
        <div className="navbar_avatar_and_cross">
          <div className="navbar_avatar">
            <img
              src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
              alt="avatar"
            />
            <div> {usernameFromLocalStorage}</div>
          </div>
          <div className="navbar_cross">
            <img
              src={cross2Icon}
              alt="cross"
              style={{ cursor: "pointer" }}
              onClick={enableAndDisable}
            />
          </div>
        </div>

        <div className="navbar_mobile_listitems_box">
          <div className="navbar_mobile_listitems">
            <button
              className="navbar_register"
              style={{ cursor: "pointer" }}
              onClick={NavigateToYourStory}
            >
              Your Story
            </button>
            <button
              className="navbar_login"
              style={{ cursor: "pointer" }}
              onClick={AddStoryFun}
            >
              Add Story{" "}
            </button>
            <button
              className="navbar_register"
              onClick={() => {
                navigate("/bookmark");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                justifyContent: "space-between",
              }}
            >
              <img src={BookmarkIcond} alt="bookmark" />
              Bookmarks{" "}
            </button>
            <button
              className="navbar_login"
              style={{ cursor: "pointer" }}
              onClick={logoutFun}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {addStory ? (
        <Portal
          close={AddStoryFun}
          component={<AddStory close={AddStoryFun} />}
        />
      ) : (
        ""
      )}
      {singIn ? (
        <Portal
          close={SingInFun}
          component={
            <Register
              close={SingInFun}
              heading={"Login"}
              tempLoggedIn={tempLoggedIn}
            />
          }
        />
      ) : (
        ""
      )}
      {register ? (
        <Portal
          close={RegisterFun}
          component={
            <Register
              close={RegisterFun}
              heading={"Register"}
              tempLoggedIn={tempLoggedIn}
            />
          }
        />
      ) : (
        ""
      )}
    </>
  );
}
