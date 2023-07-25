import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import SimpleTodosList from "./components/simpletodolist5";
// import CreateTask from "./components/createtask3";
import CreateTask from "./components/createtask";
import EditTask from "./components/edittask";

import Properties from "./components/properties";
import SellerDatabase from "./components/sellerdatabase";
import RealtorDatabase from "./components/realtordatabase";
import Report from "./components/report";
import CreateRealtor from "./components/CreateRealtor";
import CreateSeller from "./components/CreateSeller";
import CreateProperty from "./components/CreateProperty";

// import Junk from "./components/junk";

export default function App() {
  return (
    <>

    <BrowserRouter>
      <Routes>
          <Route path="/" exact element={<Properties />} />
          <Route path="/realtor" element={<RealtorDatabase />} />
          <Route path="/seller" element={<SellerDatabase />} />
          <Route path="/report" element={<Report />} />

          {/* <Route path="/" exact element={<SimpleTodosList />} /> */}
          <Route path="/newProperty" element={<CreateProperty />} />
          <Route path="/newRealtor" element={<CreateRealtor />} />
          <Route path="/newSeller" element={<CreateSeller />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/update/:id" element={<EditTask />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}
