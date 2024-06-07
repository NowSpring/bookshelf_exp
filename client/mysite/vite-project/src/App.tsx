import { useEffect } from "react";
import { Route, Routes, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

import Authentication from "./components/authentication/AuthenticationPage";
import Layout from "./components/main/layout/Layout";
import EditPage from "./components/main/edit/EditPage";
import AdminPage from "./components/main/admin/AdminPage";



const LayoutWithHeaderAndNav = () => (
  <Layout>
    <Outlet />
  </Layout>
);

// 認証チェック用のコンポーネント
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      // 認証されていない場合、ログインページにリダイレクト
      navigate('/authentication', { replace: true, state: { from: location } });
    }
  }, [navigate, location]);

  return children;
};

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/authentication" />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route element={<LayoutWithHeaderAndNav />}>
          <Route
            path="/edit/:id"
            element={
              <RequireAuth>
                <EditPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/:id"
            element={
              <RequireAuth>
                <AdminPage />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
