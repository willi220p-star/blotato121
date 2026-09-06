import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Rates from "./pages/Rates";
import Reviews from "./pages/Reviews";
import Book from "./pages/Book";
import Referral from "./pages/Referral";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/book" element={<Book />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
