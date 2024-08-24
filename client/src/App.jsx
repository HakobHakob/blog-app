import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Projects from "./pages/Projects"
import { Header } from "./components/Header"
import { FooterComponent } from "./components/Footer"
import { PrivateRoute } from "./components/PrivateRoute"
import { OnlyAdminPrivateRoute } from "./components/PrivateRoute copy"
import { CreatePost } from "./pages/CreatePost"
import { UpdatePost } from "./pages/UpdatePost"

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/projects" element={<Projects />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />}></Route>
          <Route path="/update-post/:postId" element={<UpdatePost />}></Route>
        </Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  )
}

export default App
