import PropTypes from "prop-types"
import { Alert, Button, Textarea } from "flowbite-react"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
} from "../redux/comment/commentSlice"

export const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user)
  const { currentComment, loading, commentError } = useSelector(
    (state) => state.comment
  )
  const [commentErr, setCommentErr] = useState("")

  const dispatch = useDispatch()
  const textAreaRef = useRef(null)
  const charCountDisplayRef = useRef(null)

  const changeCharacterCount = (count) => 200 - count

  const changeValueRealTime = (value) => {
    if (commentErr && value) {
      setCommentErr("")
    }
    if (textAreaRef.current) {
      textAreaRef.current.value = value
      const charCount = changeCharacterCount(textAreaRef.current.value.length)
      if (charCountDisplayRef.current) {
        charCountDisplayRef.current.textContent = `${charCount} characters remaining`
      }
    }
  }

  const submitForm = async (e) => {
    e.preventDefault()
    if (textAreaRef.current.value.length > 200) {
      dispatch(
        addCommentFailure({ commentError: "Comment exceeds 200 characters." })
      )

      return
    }
    dispatch(addCommentStart())

    try {
      const res = await fetch("/api_v1/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: textAreaRef.current.value,
          postId,
          userId: currentUser._id,
        }),
      })

      if (!res.ok) {
        dispatch(
          addCommentFailure({
            commentError: ` Failed to add content: Comment content is required.`,
          })
        )
        setCommentErr(` Failed to add content: Comment content is required.`)
      }
      const data = await res.json()

      if (res.ok) {
        setCommentErr("")
        dispatch(addCommentSuccess(data))
        textAreaRef.current.value = null
        if (charCountDisplayRef.current) {
          charCountDisplayRef.current.textContent = "200 characters remaining"
        }
      }
    } catch (error) {
      dispatch(
        addCommentFailure({ commentError: `${error}: Failed to add comment` })
      )
      console.error(error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt="Img"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1 text-sm text-teal-500 my-5">
          You must be signed in to comment.
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={submitForm}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            ref={textAreaRef}
            onChange={(e) => changeValueRealTime(e.target.value)}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500" ref={charCountDisplayRef}>
              200 characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && commentErr && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  )
}

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
}
