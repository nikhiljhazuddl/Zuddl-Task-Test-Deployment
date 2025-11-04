import React from "react"
import { useSelector } from "react-redux"
import Navbar from "./Navbar"
import SideMenu from "./SideMenu"

const DashboardLayout = ({ children, activeMenu }) => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar activeMenu={activeMenu} />
      </div>

      {currentUser && (
        <div className="flex pt-16 relative z-10">
          {/* Fixed Sidebar */}
          <div className="max-[1080px]:hidden fixed left-0 top-16 bottom-0 z-40">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main Content Area with left margin to account for fixed sidebar */}
          <div className="flex-1 ml-64 max-[1080px]:ml-0">
            <div className="mx-5">{children}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout
