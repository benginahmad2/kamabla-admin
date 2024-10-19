import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/layout";
import Home from "../pages/home";

export const MainRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};
