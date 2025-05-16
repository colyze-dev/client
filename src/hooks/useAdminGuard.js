import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";

export default function useAdminGuard() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      navigate('/login');
      return;
    }

    if (userInfo?.isAdmin === false) {
      setShowPopup(true);
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (userInfo === null) {
      fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        credentials: 'include',
      }).then(res => res.json())
        .then(data => {
          if (!data.isAdmin) {
            setUserInfo(data);
            setShowPopup(true);
            setTimeout(() => navigate('/'), 3000);
          } else {
            setUserInfo(data);
          }
        })
        .catch(() => {
          setShowPopup(true);
          setTimeout(() => navigate('/'), 3000);
        });
    }
  }, [navigate, userInfo, setUserInfo]);

  return showPopup;
}
