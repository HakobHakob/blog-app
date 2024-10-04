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
        [{ align: [] }],
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
      "align",
    ],
  })

  useEffect(() => {
    if (quill) {
      // Only update the content if the incoming content is different
      if (content && quill.root.innerHTML !== content) {
        // Store current cursor position
        const currentSelection = quill.getSelection()

        // Update the content in Quill editor
        quill.root.innerHTML = content || ""

        // Restore the previous cursor position after content update
        if (currentSelection) {
          quill.setSelection(currentSelection)
        }
      }

      // Listen for text changes in the Quill editor
      quill.on("text-change", () => {
        const updatedContent = quill.root.innerHTML
        changePostContent(updatedContent) // Send updated content to parent component
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
  content: PropTypes.string,
}

// Adding display name to the memoized component
const CreatePostContent = memo(PostContent)
CreatePostContent.displayName = "PostContent"

export default CreatePostContent
