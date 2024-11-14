// App.js
import React from "react";
import { Helmet } from "react-helmet"; // Helmet can manage your <head> tags
import Home from "./pages/Home";

function App() {
  return (
    <div className="font-sans">
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Page Title</title>
      </Helmet>
      <div className="w-100 sm:w-6/12 sm:mx-auto pt-8">
        <Home />
      </div>
    </div>
  );
}

export default App;
