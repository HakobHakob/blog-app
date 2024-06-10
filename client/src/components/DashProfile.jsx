import { Alert, Button, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { app } from "../firebase"
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

export const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [imgFile, setImgFile] = useState(null)
  const [imgFileURL, setImgFileURL] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const filePickerRef = useRef(null)

  const changeImage = (e) => {
    const file = e.target.files[0]

    if (file) {
      setImgFile(file)
      setImgFileURL(URL.createObjectURL(file))
    }
  }

  useEffect(() => {
    if (imgFile) {
      uploadImg()
    }
  }, [imgFile])

  const uploadImg = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploadError(null)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imgFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imgFile)
    uploadTask.on(
      "state_changed",

      // File upload progress
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        //toFixed(digits) => The number of digits to appear after the decimal point
        setImageFileUploadProgress(progress.toFixed(0))
      },
      () => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        )
        setImageFileUploadProgress(null)
        setImgFile(null)
        setImgFileURL(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgFileURL(downloadURL)
        })
      }
    )
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={changeImage}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imgFileURL || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit " gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        <div className=" flex justify-between mt-5">
          <span className="cursor-pointer text-red-500">Delete Account</span>
          <span className="cursor-pointer font-semibold">Sign Out</span>
        </div>
      </form>
    </div>
  )
}
