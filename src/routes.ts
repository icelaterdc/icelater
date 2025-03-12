import React from "react";
import { RouteObject } from "react-router-dom";

// React component dosyalarını import ediyoruz (default export gerektiren dosyalar)
const componentModules = import.meta.glob("./pages/**/*.{tsx,jsx,ts,js}", {
  eager: true,
  import: "default",
});

// Tüm dosyaları ham (raw) metin olarak import ediyoruz
const rawFiles = import.meta.glob("./pages/**/*", {
  eager: true,
  as: "raw",
});

// Render edilemeyen dosyaları göstermek için basit bir bileşen
type FileViewerProps = {
  content: string;
  fileName: string;
};

const FileViewer: React.FC<FileViewerProps> = ({ content, fileName }) => {
  return React.createElement(
    "div",
    { style: { padding: "1rem" } },
    React.createElement("h1", null, fileName),
    React.createElement("pre", { style: { whiteSpace: "pre-wrap" } }, content)
  );
};

// Tüm dosyaları dolaşıp route tanımlamalarını oluşturuyoruz
const routes: RouteObject[] = Object.entries(rawFiles).map(([filePath, rawContent]) => {
  // Dosya uzantısını belirle
  const extMatch = filePath.match(/\.(\w+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "";
  
  // "./pages/" kısmını ve dosya uzantısını kaldırıp route ismini elde ediyoruz
  let routeName = filePath
    .replace("./pages/", "")
    .replace(/\.\w+$/, "")
    .toLowerCase();
  
  // Eğer route ismi "home" ise kök ("/") olacak şekilde ayarlanıyor
  const routePath = routeName === "home" ? "/" : `/${routeName}`;

  // Eğer dosya component uzantılı ise (tsx, jsx, ts, js) ve default export varsa, onu kullan
  if (/(tsx|jsx|ts|js)$/.test(ext) && filePath in componentModules) {
    const Component = componentModules[filePath] as React.ComponentType;
    return {
      path: routePath,
      element: <Component />,
    };
  } else {
    // Diğer dosya türleri için ham içeriği FileViewer ile render ediyoruz
    return {
      path: routePath,
      element: React.createElement(FileViewer, {
        content: rawContent as string,
        fileName: routeName,
      }),
    };
  }
});

export default routes;
