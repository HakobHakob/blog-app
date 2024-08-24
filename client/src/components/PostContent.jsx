import { useQuill } from "react-quilljs"
import "quill/dist/quill.snow.css"
import PropTypes from "prop-types"
import { memo, useEffect } from "react"

const PostContent = ({ changePostContent, content }) => {
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        [{ color: [] }, { background: [] }],
      ],
    },
    formats: [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "link",
      "color",
      "background",
    ],
  })

  useEffect(() => {
    if (quill && content) {
      quill.root.innerHTML = content || ""
      // Listen for text changes and update the parent component
      quill.on("text-change", () => {
        changePostContent(quill.root.innerHTML)
      })
    }
  }, [quill, content, changePostContent])

  return (
    <div className="h-72 pb-12">
      <div ref={quillRef} />
    </div>
  )
}

PostContent.propTypes = {
  changePostContent: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
}

// Adding display name to the memoized component
const CreatePostContent = memo(PostContent)
CreatePostContent.displayName = "PostContent"

export default CreatePostContent
