import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import routes from "./routes";

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default Root;
