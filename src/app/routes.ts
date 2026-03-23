import { createBrowserRouter } from "react-router";
import { Layout } from "./components/zoning/Layout";
import { Homepage } from "./pages/Homepage";
// import { Dashboard } from "./pages/Dashboard";
// import { Explorer } from "./pages/Explorer";
import { Compare } from "./pages/Compare";
import { OCRUpload } from "./pages/OCRUpload";
// import { Analytics } from "./pages/Analytics";
import { Ask } from "./pages/Ask";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      // { index: true, Component: Dashboard },
      { index: true, Component: Homepage },
      // { path: "explorer", Component: Explorer },
      { path: "compare", Component: Compare },
      { path: "ocr", Component: OCRUpload },
      // { path: "analytics", Component: Analytics },
      { path: "ask", Component: Ask },
    ],
  },
]);
