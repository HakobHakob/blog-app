import PropTypes from "prop-types"
import { Alert, Button, Modal, Textarea } from "flowbite-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import {
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
  deleteCommentStart,
  deleteCommentSuccess,
  deleteCommentFailure,
} from "../redux/comment/commentSlice"
import { PostComment } from "./PostComment"
import { HiOutlineExclamationCircle } from "react-icons/hi"

export const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user)
  const { commentError } = useSelector((state) => state.comment)
  const [commentErr, setCommentErr] = useState("")
  const [postComments, setPostComments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)

  const dispatch = useDispatch()
  const textAreaRef = useRef(null)
  const charCountDisplayRef = useRef(null)
  const navigate = useNavigate()

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
        setPostComments([data, ...postComments])
      }
    } catch (error) {
      dispatch(
        addCommentFailure({ commentError: `${error}: Failed to add comment` })
      )
      console.error(error)
    }
  }

  useEffect(() => {
    const getPostComments = async () => {
      try {
        const res = await fetch(`/api_v1/comment/getPostComments/${postId}`)
        if (res.ok) {
          const data = await res.json()
          setPostComments(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getPostComments()
  }, [postId])

  const likeComment = useCallback(
    async (commentId) => {
      try {
        if (!currentUser) {
          navigate("/sign-in")
          return
        }

        const res = await fetch(`/api_v1/comment/likeComment/${commentId}`, {
          method: "PUT",
        })
        if (res.ok) {
          const data = await res.json()

          setPostComments(
            postComments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: data.likes,
                    numberOfLikes: data.likes.length,
                  }
                : comment
            )
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
    [currentUser, navigate, postComments]
  )

  const editPostComment = useCallback(
    async (comment, editedContent) => {
      setPostComments(
        postComments.map((postCom) =>
          postCom._id === comment._id
            ? { ...postCom, content: editedContent }
            : postCom
        )
      )
    },
    [postComments]
  )

  const deleteComment = useCallback(
    async (commentId) => {
      setShowModal(false)
      try {
        dispatch(deleteCommentStart())

        if (!currentUser) {
          navigate("/sign-in")
          return
        }

        const res = await fetch(`/api_v1/comment/deleteComment/${commentId}`, {
          method: "DELETE",
        })

        if (res.ok) {
          setPostComments(
            postComments.filter((postComment) => postComment._id !== commentId)
          )
          dispatch(deleteCommentSuccess()) 
        } else {
          const errorData = await res.json()
          dispatch(deleteCommentFailure(errorData)) 
        }
      } catch (error) {
        console.error(error)
        dispatch(deleteCommentFailure(error)) 
      }
    },
    [currentUser, dispatch, navigate, postComments]
  )

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
      {postComments === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{postComments.length}</p>
            </div>
          </div>
          {postComments.map((postComment) => (
            <PostComment
              key={postComment._id}
              postComment={postComment}
              onLike={likeComment}
              onEdit={editPostComment}
              onDeleteComment={(commentId) => {
                setShowModal(true)
                setCommentToDelete(commentId)
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center ">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this pcommentost?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => deleteComment(commentToDelete)}
              >
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No,cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
}
