import React from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import SharePage from "../pages/SharePage";
import AdminPage from "../pages/AdminPage";
import BookmarkPage from "../pages/BookmarkPage";
import { useDispatch, useSelector } from "react-redux";
import ErrorPage from "../components/Error/ErrorPage";
export default function Routes2() {
  const loggedin = useSelector((state) => state.loggedin);
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/admin" element={<AdminPage />} />

          {loggedin ? (
            <Route path="/bookmark" element={<BookmarkPage />} />
          ) : (
            <Route path="/bookmark" element={<Navigate to="/" replace />} />
          )}

          <Route
            path="/api/story/share/:id/:slideNumber"
            element={<SharePage />}
          />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}
