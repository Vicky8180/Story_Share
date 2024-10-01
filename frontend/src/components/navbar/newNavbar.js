import React, { useState } from "react";
import "./Navbar.css";
import humburgerIcon from "../../assets/humburger.png";
import cross2Icon from "../../assets/cross2Icon.png";
import Portal from "../../services/portal/Portal";
import AddStory from "../add_stories/AddStory";
import Register from "../auth/Register/Register";
import BookmarkIcond from "../../assets/VSBookmarksIcon.png";
import { useSelector } from "react-redux";
export default function Navbar1() {
  const [enableMenu, setenableMenu] = useState(false);
  const [logout, setLogout] = useState(false);
  const [register, setRegister] = useState(false);
  const [addStory, setAddStory] = useState(false);

  const loggedIn = localStorage.getItem("token") ? true : false;

  const [singIn, setSignIn] = useState(false);

  const tempLoggedIn = () => {
    // setLoggedIn(!loggedIn);
    // SingInFun()
  };

  const SingInFun = () => {
    setSignIn(!singIn);
  };

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
  };
  return (
    <>
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
      <div className="navbar_container">
        <div className="navbar_before_login">
          <div className="navbar_web">
            <button className="navbar_register" onClick={RegisterFun}>
              Register Now
            </button>
            {/* onClick={tempLoggedIn}  */}
            <button className="navbar_login" onClick={SingInFun}>
              Sign In{" "}
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
        <div className="navbar_mobile_listitems_box">
          <div className="navbar_mobile_listitems">
            <button className="navbar_register" onClick={RegisterFun}>
              Register now
            </button>
            <button className="navbar_login" onClick={SingInFun}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
