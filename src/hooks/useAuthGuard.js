import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../userContext";

export default function useAuthGuard() {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo === undefined) return; // still loading

    if (userInfo === null) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  return userInfo; // return value so components can react
}
