import { RouteObject } from "react-router-dom";

const pageModules = import.meta.glob("./pages/**/*.{tsx,jsx}", {
  eager: true,
  import: "default",
});

const routes: RouteObject[] = Object.entries(pageModules).map(
  ([filePath, component]) => {
    const path = filePath
      .replace("./pages/", "") 
      .replace(/\.(tsx|jsx)$/, "") 
      .toLowerCase(); 

    const routePath = path === "home" ? "/" : `/${path}`;

    return {
      path: routePath,
      element: component as React.ReactElement,
    };
  }
);

export default routes;
