import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import routes from "./routes";
import Page404 from "./pages/404"; // 404 sayfasını import ediyoruz

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
        <Route path="*" element={<Page404 />} /> {/* 404 için wildcard route */}
      </Routes>
    </BrowserRouter>
  );
}

export default Root;
