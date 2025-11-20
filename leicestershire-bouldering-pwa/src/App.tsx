import { StrictMode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Navbar from "./components/Navbar";
import Areas from "./pages/Areas";
import Area from "./pages/Area";
import Sectors from "./pages/Sectors";
import Blocks from "./pages/Blocks";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import DataExport from "./pages/DataExport";

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            {/* Home route */}
            <Route index element={<Areas />} />

            {/* about */}
            <Route path="about">
              <Route index element={<About />} />
            </Route>

            {/* data-export */}
            <Route path="data-export">
              <Route index element={<DataExport />} />
            </Route>

            {/* Areas routes */}
            <Route path="areas">
              <Route index element={<Navigate to="/" replace />} />
              <Route path=":areaName" element={<Area />} />
              <Route path=":areaName/:sectorName" element={<Sectors />} />
              <Route
                path=":areaName/:sectorName/:blockName"
                element={<Blocks />}
              />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;
