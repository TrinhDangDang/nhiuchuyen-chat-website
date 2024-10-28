import { Routes, Route } from 'react-router-dom'
import Register from './components/Register';
import Bulletin from './components/Bulletin';
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import PostsList from './features/posts/PostsList'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditPost from './features/posts/EditPost'
import NewPost from './features/posts/NewPost'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import About from './components/About';
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle';

function App() {
  useTitle('Trinh Dang')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Public />}>
          <Route index element={<About/>}/>
          <Route path="login" element={<Login />} />
          <Route path="bulletin" element={<Bulletin />} />
          <Route path="create" element={<Register/>}/>
        </Route>
        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
        
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />
                <Route path="about" element={<About/>}/>
                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
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

              </Route>{/* End Dash */}
            </Route>
          </Route>
        </Route>{/* End Protected Routes */}

      </Route>
    </Routes >
  );
}

export default App;