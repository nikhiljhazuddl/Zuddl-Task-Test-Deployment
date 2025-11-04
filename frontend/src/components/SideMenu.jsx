import React, { useEffect, useState } from "react"
import axiosInstance from "../utils/axioInstance"
import { useDispatch, useSelector } from "react-redux"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useNavigate } from "react-router-dom"
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data"

const SideMenu = ({ activeMenu }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [SideMenuData, setSideMenuData] = useState([])
  const { currentUser } = useSelector((state) => state.user)

  const handleClick = (route) => {
    console.log(route)

    if (route === "logout") {
      handleLogut()
      return
    }

    navigate(route)
  }

  const handleLogut = async () => {
    try {
      const response = await axiosInstance.post("/auth/sign-out")

      if (response.data) {
        dispatch(signOutSuccess())

        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser) {
      setSideMenuData(
        currentUser?.role === "admin" ? SIDE_MENU_DATA : USER_SIDE_MENU_DATA
      )
    }

    return () => {}
  }, [currentUser])

  return (
    <div className="w-64 h-full p-6 flex flex-col lg:border-r lg:border-gray-200/50 bg-white/80 backdrop-blur-sm overflow-y-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden mb-3 border-2 border-white shadow-lg ring-2 ring-blue-100">
          <img
            src={currentUser?.profileImageUrl || null}
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
        </div>

        {currentUser?.role === "admin" && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 shadow-sm">
            Admin
          </div>
        )}

        <h5 className="text-base font-semibold text-gray-900">
          {currentUser?.name || ""}
        </h5>

        <p className="text-sm text-gray-500">{currentUser?.email || ""}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {SideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-3 text-sm font-medium transition-all duration-200 rounded-lg py-3 px-4 group ${
              activeMenu === item.label
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className={`text-xl transition-transform duration-200 ${
              activeMenu === item.label ? "" : "group-hover:scale-110"
            }`} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default SideMenu
