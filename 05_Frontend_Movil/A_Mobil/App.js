import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsersScreen from "./screens/UsersScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/UsersScreens" element={<UsersScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
