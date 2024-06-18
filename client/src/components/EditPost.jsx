import { useQuill } from "react-quilljs"
import "quill/dist/quill.snow.css"

export const EditPost = () => {
  const { quillRef } = useQuill({
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

  return (
    <div className="h-72 pb-12 ">
      <div ref={quillRef} />
    </div>
  )
}
