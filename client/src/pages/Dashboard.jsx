import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { DashSidebar } from "../components/DashSidebar"
import { DashProfile } from "../components/DashProfile"
import { DashPosts } from "../components/DashPosts"
import { DashUsers } from "../components/DashUsers"

const Dashboard = () => {
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Profile... */}
      {dashboardTab === "profile" && <DashProfile />}
      {/*Posts */}
      {dashboardTab === "posts" && <DashPosts />}
      {/* users */}
      {dashboardTab === "users" && <DashUsers />}
    </div>
  )
}

export default Dashboard
