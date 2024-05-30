import { Sidebar } from "flowbite-react"
import { useEffect, useState } from "react"
import { HiUser, HiArrowSmRight } from "react-icons/hi"
import { Link, useLocation } from "react-router-dom"

export const DashSidebar = () => {
  const location = useLocation()
  const [dashboardTab, setDashboardTab] = useState("")
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
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            href="#"
            icon={HiArrowSmRight}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
