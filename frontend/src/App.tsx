import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Students from './pages/students';
import Announcements from './pages/announcements';
import Report from './pages/report';
import Settings from './pages/setting';
import ProtectedRoute from './components/protectedroute';

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/students"
            element={<Students />}
          />

          <Route
            path="/announcements"
            element={<Announcements />}
          />

          <Route
            path="/reports"
            element={<Report />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;