import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Bulletin from './components/Bulletin';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import PostsList from './features/posts/PostsList';
import UsersList from './features/users/UsersList';
import EditUser from './features/users/EditUser';
import NewUserForm from './features/users/NewUserForm';
import EditPost from './features/posts/EditPost';
import NewPost from './features/posts/NewPost';
import Prefetch from './features/auth/Prefetch';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import About from './components/About';
import Chat from './features/chat/Chat';
import Game from './features/games/Game';
import { ROLES } from './config/roles';
import useTitle from './hooks/useTitle';
import { SocketProvider } from './features/chat/SocketContext';

function App() {
  useTitle('Trinh Dang');

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Public />}>
          <Route index element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="bulletin" element={<Bulletin />} />
          <Route path="create" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route
              element={
                <SocketProvider>
                  <Prefetch />
                </SocketProvider>
              }
            >
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />
                <Route path="about" element={<About />} />
                <Route path="chat" element={<Chat />} />
                <Route path="games" element={<Game/>}/>

                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="posts">
                  <Route index element={<PostsList />} />
                  <Route path=":id" element={<EditPost />} />
                  <Route path="new" element={<NewPost />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
