import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"

export const OAuth = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = getAuth(app)
  const signUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: "select_account" }) // Vor karenanq @ntrenq mi qani accauntic mer uzac@ vorov login @lnenq
    // Ogtagorcm enq tryCatch-@ popUp window-@ bacelu hamar
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider)
      const res = await fetch("/api_v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate("/")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={signUpWithGoogle}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  )
}
