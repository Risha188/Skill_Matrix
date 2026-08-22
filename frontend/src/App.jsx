import { RouterProvider } from "react-router-dom";

// import AdminRouter from "./router/AdminRouter";
import EmployeeRouter from "./router/EmployeeRouter";

const App = () => {
    return (
        <RouterProvider
            router={EmployeeRouter}
        />
    );
};

export default App;