import { Routes, Route } from "react-router-dom";
import { UserContextProvider } from './userContext';
import './App.css'; 
import './index.css';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutUsPage from './pages/AboutUs';
import ContactPage from './pages/Contact';
import ProfilePage from './pages/Profile';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';
import AdminPage from './pages/AdminPage';
import Collaborate from './pages/Collaborate';
import IdeasPage from "./pages/IdeasPage";
import UpdatesPage from "./pages/UpdatesPage";
import AdminUpdatesPage from "./pages/AdminUpdatesPage";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="edit/:id" element={<EditPost />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="collaboration" element={<Collaborate />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/profile/:username?" element={<ProfilePage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/admin/updates" element={<AdminUpdatesPage />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
