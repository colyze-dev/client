import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./header.js";
import "./effects.css"; // if you haven’t already
import "./App.css";

export default function Layout() {
  const location = useLocation();
  const [transitionStage, setTransitionStage] = useState("fade-in");

  useEffect(() => {
    setTransitionStage("fade-out");
    const timeout = setTimeout(() => {
      setTransitionStage("fade-in");
    }, 50);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className="gradient-waves"></div>
      <div className="pulsing-particles"><span></span><span></span></div>
      <div className="background-animation">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <main className={`page-transition ${transitionStage}`}>
        <Outlet />
      </main>
    </>
  );
}
