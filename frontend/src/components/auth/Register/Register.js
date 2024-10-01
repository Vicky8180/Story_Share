import React, { useEffect, useState } from "react";
import "./Register.css";
import RegCrossIcon from "../../../assets/ASDeleteIcon.png";
import EyeIcon from "../../../assets/EyeIcon2.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addItem } from "../../../redux_tool_kit/slices/LoggedIn";
import { useNavigate } from "react-router-dom";
import Toast from "../../../services/toast/Toast";
import Loader2 from "../../loader/Loader2";

export default function Register({ close, heading, redirectTo }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [seePass, setSeePass] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginAndRegister = async () => {
    setLoading(true);
    if (heading === "Login") {
      try {
        if (!usernameError && !passwordError && username && password) {
          const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL_PORT}/api/auth/login`,
            { username, password }
          );
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_id", response.data.data._id);
          localStorage.setItem("username", response.data.data.username);
          dispatch(addItem(true));
          Toast("Login Successful", true);
          close();
          if (!redirectTo) {
            navigate("/admin");
          }
        } else {
          Toast("Username or password invalid", false);
        }
      } catch (error) {
        if (error.response) {
          Toast(error.response.data.message, false);
        } else {
          Toast("Network error, please try again later.", false);
        }
      } finally {
        setLoading(false);
      }
    }

    if (heading === "Register") {
      try {
        if (!usernameError && !passwordError && username && password) {
          const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL_PORT}/api/auth/register`,
            { username, password }
          );
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_id", response.data.data._id);
          localStorage.setItem("username", response.data.data.username);
          dispatch(addItem(true));
          Toast(response.data.message, true);
          close();
          if (!redirectTo) {
            navigate("/admin");
          }
        } else {
          Toast("Username or password invalid", false);
        }
      } catch (error) {
        if (error.response) {
          Toast(error.response.data.message, false);
        } else {
          Toast("Network error, please try again later.", false);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const validate = (str) => {
    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{3,16}$/;
    var data = usernameRegex.test(str);

    if (data === false) {
      setUsernameError(() => {
        if (str.length === 0) {
          return false;
        } else {
          return true;
        }
      });
      setError(() => {
        if (str.length === 0) {
          return "";
        }

        if (str.length < 3) {
          return "Username must be 3-16 characters long.";
        } else {
          return "Username must contain both numbers and letters.";
        }
      });
    } else {
      setUsernameError(false);
      setError("");
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{5,20}$/;
    const data = passwordRegex.test(password);

    if (!data) {
      setPasswordError(() => {
        return password.length !== 0;
      });
      setError(() => {
        if (password.length === 0) return "";
        if (password.length < 5)
          return "Password must be 5-20 characters long.";
        if (!/[a-zA-Z]/.test(password))
          return "Password must include at least one letter.";
        if (!/\d/.test(password))
          return "Password must include at least one number.";
        return "Invalid password format.";
      });
    } else {
      setPasswordError(false);
      setError("");
    }
  };

  useEffect(() => {
    validate(username);
  }, [username]);

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const showPassword = () => {
    setSeePass(!seePass);
  };

  return (
    <>
      {loading ? (
        <Loader2 />
      ) : (
        <div className="register_container">
          <div className="register_cross">
            <img alt="reg_del" src={RegCrossIcon} onClick={close} />
          </div>
          <div className="register_heading">{heading}</div>
          <div className="register_inputs">
            <form className="register_input_form">
              <div className="register_input_user">
                <label>Username</label>
                <input
                  type="text"
                  style={{
                    border: "0.2vh solid",
                    borderColor: usernameError ? "red" : "",
                    outline: "none",
                  }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="register_input_password">
                <label>Password</label>
                <input
                  type={seePass ? "text" : "password"}
                  style={{
                    border: "0.2vh solid",
                    borderColor: passwordError ? "red" : "",
                    outline: "none",
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  alt="eye"
                  className="register_show_pass"
                  src={EyeIcon}
                  onClick={showPassword}
                />
              </div>
            </form>

            <span className="register_error_show">{error}</span>
          </div>

          <div className="register_btns">
            <button className="btns" onClick={handleLoginAndRegister}>
              {heading}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
