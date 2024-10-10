import PropTypes from "prop-types"
import moment from "moment"
import { useEffect, useState } from "react"

export const PostComment = ({ postComment }) => {
  const [user, setUser] = useState({})
  console.log("user", user)
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
        <p className="text-gray-500 pb-5">{postComment.content}</p>
      </div>
    </div>
  )
}

PostComment.propTypes = {
  postComment: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string,
    // We can add other properties of postComment here as needed
  }).isRequired,
}
