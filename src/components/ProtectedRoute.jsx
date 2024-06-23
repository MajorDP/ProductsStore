import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(
    function () {
      if (user === null) {
        navigate("/login");
      }
    },
    [navigate, user]
  );

  if (!user) return <div>Loading...</div>;
  if (user.username) return children;
}

export default ProtectedRoute;
