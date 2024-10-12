import PropTypes from "prop-types"
import moment from "moment"
import { memo, useEffect, useRef, useState } from "react"

import { FaThumbsUp } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import {
  updateCommentStart,
  updateCommentSuccess,
  updateCommentFailure,
} from "../redux/comment/commentSlice"
import { Button, Textarea } from "flowbite-react"

export const PostComment = memo(({ postComment, onLike, onEdit }) => {
  const [user, setUser] = useState({})
  const { currentUser } = useSelector((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const dispatch = useDispatch()
  const textAreaRef = useRef(null)

  const changeValueRealTime = (value) => {
    if (textAreaRef.current) {
      textAreaRef.current.value = value
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api_v1/user/${postComment.userId}`)
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [postComment])

  const editComment = async () => {
    setIsEditing(true)
  }

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.value = postComment.content
    }
  }, [dispatch, isEditing, postComment.content])

  const saveEditedContent = async () => {
    const newContent = textAreaRef.current.value
    try {
      dispatch(updateCommentStart())
      const res = await fetch(
        `/api_v1/comment/editComment/${postComment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newContent }),
        }
      )
      if (res.ok) {
        setIsEditing(false)
        dispatch(updateCommentSuccess({ ...postComment, content: newContent }))
        onEdit(postComment, newContent)
      }
    } catch (error) {
      console.error(error)
      dispatch(updateCommentFailure(error))
    }
  }

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      {/* Set the div size like a img size with shrink prop */}
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      {/* Set the div size all of rest size from main div with flex-1 prop */}
      <div className="flex-1 ">
        <div className="  flex items-center mb-1  ">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {/* We get the time showing how long ago the comment was created. */}
            {moment(postComment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              ref={textAreaRef}
              onChange={(e) => changeValueRealTime(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-sm">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={saveEditedContent}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-5">{postComment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(postComment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  postComment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-500">
                {postComment.numberOfLikes > 0 &&
                  postComment.numberOfLikes +
                    " " +
                    (postComment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === postComment.userId ||
                  currentUser.isAdmin) && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={() => editComment()}
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  )
})
PostComment.displayName = "PostComment"

PostComment.propTypes = {
  postComment: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string,
    _id: PropTypes.string.isRequired,
    likes: PropTypes.arrayOf(PropTypes.string).isRequired,
    numberOfLikes: PropTypes.number,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
}
