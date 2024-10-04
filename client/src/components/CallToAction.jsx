import { Button } from "flowbite-react"

export const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justiry-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about JavaScript?</h2>
        <p className="text-gray-500 my-2">Checkout these resources with 100 JavaScript Projects</p>
        <Button
          gradientDuoTone="purpleToBlue"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://www.linkedin.com/in/hakob-beglaryan-99396410a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn JavaScript
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://campus.w3schools.com/cdn/shop/files/js_log_1200x1200.png"
          alt="Image"
        />
      </div>
    </div>
  )
}
