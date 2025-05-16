import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";

export default function useAuthGuard() {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    if (userInfo === null) {
      // confirmed not logged in
      navigate("/login");
    }
  }, [userInfo, navigate]);
}
