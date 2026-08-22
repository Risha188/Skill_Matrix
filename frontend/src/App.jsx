import { RouterProvider } from "react-router-dom";
import AdminRouter from "./router/AdminRouter.jsx";

import "./index.css";

const App = () => {
    return <RouterProvider router={AdminRouter} />;
};

export default App;
