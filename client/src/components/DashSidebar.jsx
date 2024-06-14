import { Sidebar } from "flowbite-react"
import { useEffect, useState } from "react"
import { HiUser, HiArrowSmRight } from "react-icons/hi"
import { useDispatch } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { signOutSuccess } from "../redux/user/userSlice"

export const DashSidebar = () => {
  const location = useLocation()
  const [dashboardTab, setDashboardTab] = useState("")
  const dispatch = useDispatch()
  
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api_v1/user/signuot", {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message || "Sign out failed")
      } else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromURL = urlParams.get("tab")
    if (tabFromURL) {
      setDashboardTab(tabFromURL)
    }
  }, [location.search])

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              href="#"
              active={dashboardTab === "profile"}
              icon={HiUser}
              label="user"
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            href="#"
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
