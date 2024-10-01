import React from "react";
import "./UnAuthrishedPage.css"; 
import { useNavigate } from "react-router-dom";

export default function UnAuthorizedPage() {
  
    const navigate=useNavigate();
  const move_to_login = () => {
    navigate("/") 
  };

  return (
    <div className="unauth-container">
      <img src="https://www.bluehost.com/blog/wp-content/uploads/2023/06/Troubleshooting-401-errors.png" alt="Unauthorized Access" className="unauth-image" />
      <h1 className="unauth-text">You are not authorized to access this page!</h1>
      <button className="unauth-button" onClick={move_to_login}>
        Get Authorization
      </button>
    </div>
  );
}
