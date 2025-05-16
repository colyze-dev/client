import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";

export default function useAdminGuard() {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (userInfo === undefined) return; // still loading
    if (!userInfo || !userInfo.isAdmin) {
      setShowPopup(true);
      setTimeout(() => navigate("/login"), 2000); // optional delay for notice
    }
  }, [userInfo, navigate]);

  return showPopup;
}
