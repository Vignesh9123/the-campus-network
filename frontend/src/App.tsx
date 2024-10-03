import LandingPage from './components/sections/LandingPage'
import Login from './pages/Login'
import SetLogin from './pages/SetLogin'
import {Route, Routes} from 'react-router-dom'
import RegisterForm from './pages/Register'
import Profile from './pages/Profile'
import PrivateRoute from './pages/PrivateRoute'
import PublicRoute from './pages/PublicRoute'
import EditProfile from './pages/EditProfile'
import ExplorePosts from './pages/ExplorePosts'
import SearchPage from './pages/SearchPage'
import OtherUserProfile from './pages/OtherUserProfile'
import AddPersonalDetails from './pages/AddPersonalDetails'
import PostComments from './pages/PostComments'
import Groups from './pages/Groups'
import GroupIdPage from './pages/GroupIdPage'
import ProjectIdPage from './pages/ProjectIdPage'
import { messaging } from './firebase/firebaseConfig'
import {onMessage } from 'firebase/messaging'
import {toast} from 'react-toastify'
import ProjectEdit from './pages/ProjectEdit'
import Settings from './pages/Settings'
import GeneralLayout from './components/GeneralLayout'
function App() {
  onMessage(messaging, (payload) => {
    toast.info(
      <div>
        <p>{payload.notification?.title}</p>
        <p>{payload.notification?.body}</p>

      </div>,
      {toastId:payload.notification?.title} 
    )
    // ...
  });
  
  

  
  return (
    <div>
      <Routes>
        <Route element={<PublicRoute/>}>

        <Route path='/' element={<LandingPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/setLogin' element={<SetLogin/>}/>
        <Route path='/register' element={<RegisterForm/>}/>
        </Route>
        <Route element={<PrivateRoute>
          
        </PrivateRoute>}>
          <Route path='/profile' element={<Profile/>}/>
        <Route path='/editProfile' element={<EditProfile/>}/>
        <Route path='/explore' element={<ExplorePosts/>}/>
        <Route path='/search' element={<SearchPage/>}/>
        <Route path='/user/:username' element={<OtherUserProfile/>}/>
        <Route path='/add-personal-details' element={<AddPersonalDetails/>}/>
        <Route path='/post/:postId' element={<PostComments/>}/>
        <Route path='/groups' element={<Groups/>}/>
        <Route path='/groups/:groupId' element={<GroupIdPage/>}/>
        <Route path='/projects/:projectId' element={<ProjectIdPage/>}/>
        <Route path='/projects/:projectId/edit' element={<ProjectEdit/>}/>
        <Route element={<GeneralLayout/>}>
        <Route path='/settings' element={<Settings/>}/>
        </Route>
        </Route>
        <Route path='*' element={<div>Not Found</div>}/>
        
      </Routes>
      
    </div>
  )
}
 

export default App
