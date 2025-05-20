import { useEffect, useState } from "react";
import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import CallHistory from "@/pages/CallHistory";
import Profile from "@/pages/Profile";
import HelpSupport from "@/pages/HelpSupport";
import SplashScreen from "@/components/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Switch>
          <Route path="/" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/call-history" component={CallHistory} />
          <Route path="/profile" component={Profile} />
          <Route path="/help-support" component={HelpSupport} />
          <Route component={NotFound} />
        </Switch>
      )}
    </>
  );
}

export default App;
