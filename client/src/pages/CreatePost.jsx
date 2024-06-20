import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react"
import { EditPost } from "../components/EditPost"
import { useState } from "react"
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { app } from "../firebase"
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

export const CreatePost = () => {
  const [file, setFile] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [formData, setFormData] = useState({})

  // Upload image to the firebase
  const uploadPostImage = async () => {
    try {
      if (!file) {
        setImageFileUploadError("Please select an image")
        return
      }
      setImageFileUploadError(null)
      const storage = getStorage(app)
      const fileName = new Date().getTime() + "-" + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        "state_changed",

        // File upload progress
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageFileUploadProgress(progress.toFixed(0))
        },
        () => {
          setImageFileUploadError("Image upload failed")
          setImageFileUploadError(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadProgress(null)
            setImageFileUploadError(null)
            setFormData({ ...formData, image: downloadURL })
          })
        }
      )
    } catch (error) {
      setImageFileUploadError("Image upload failed")
      setImageFileUploadProgress(null)
      console.log(error)
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold"> Create Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col  gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-dotted border-teal-500 p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={uploadPostImage}
            disabled={imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              " Upload image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {formData.image && (
          <img
          src={formData.image || ""}
          alt="upload"
          className="w-full h-72 object-cover"
          />
        )}
        <EditPost />

        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  )
}
