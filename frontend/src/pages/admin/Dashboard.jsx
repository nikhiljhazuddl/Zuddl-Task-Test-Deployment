import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axioInstance"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import RecentTasks from "../../components/RecentTasks"
import CustomPieChart from "../../components/CustomPieChart"
import CustomBarChart from "../../components/CustomBarChart"
import TeamWorkloadChart from "../../components/TeamWorkloadChart"
import UpcomingDeadlines from "../../components/UpcomingDeadlines"

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"]

const Dashboard = () => {
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)

  const [dashboardData, setDashboardData] = useState([])
  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])
  const [teamWorkload, setTeamWorkload] = useState([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])

  // prepare data for pie chart
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {}
    const taskPriorityLevels = data?.taskPriorityLevel || {}

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ]

    setPieChartData(taskDistributionData)

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ]

    setBarChartData(priorityLevelData)
  }

  const getDashboardData = async () => {
    try {
      // Use user-dashboard-data to show only tasks assigned to current user
      const response = await axiosInstance.get("/tasks/user-dashboard-data")

      console.log("Dashboard API Response:", response.data)

      if (response.data) {
        setDashboardData(response.data)
        prepareChartData(response.data?.charts || null)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      console.error("Error response:", error.response?.data)
    }
  }

  const getTeamWorkload = async () => {
    try {
      console.log("[Dashboard] Fetching team workload from users endpoint...")
      const response = await axiosInstance.get("/users/get-users")
      console.log("[Dashboard] Users response:", response.data)
      
      if (response.data) {
        // Transform user data to workload format
        const workloadData = response.data.map(user => ({
          userId: user._id,
          name: user.name,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          pending: user.pendingTasks || 0,
          inProgress: user.inProgressTasks || 0,
          completed: user.completedTasks || 0,
          total: (user.pendingTasks || 0) + (user.inProgressTasks || 0) + (user.completedTasks || 0)
        }))
        
        // Sort by total tasks descending
        workloadData.sort((a, b) => b.total - a.total)
        
        setTeamWorkload(workloadData)
        console.log("[Dashboard] Team workload set:", workloadData.length, "members")
      }
    } catch (error) {
      console.error("[Dashboard] Error fetching team workload:", error)
      console.error("[Dashboard] Error details:", error.response?.data)
    }
  }

  const getUpcomingDeadlines = async () => {
    try {
      console.log("[Dashboard] Fetching upcoming deadlines...")
      const response = await axiosInstance.get("/tasks/upcoming-deadlines")
      console.log("[Dashboard] Upcoming deadlines response:", response.data)
      if (response.data) {
        setUpcomingDeadlines(response.data)
        console.log("[Dashboard] Set", response.data.length, "upcoming tasks")
      }
    } catch (error) {
      console.error("[Dashboard] Error fetching upcoming deadlines:", error)
      console.error("[Dashboard] Error details:", error.response?.data)
    }
  }

  useEffect(() => {
    getDashboardData()
    getTeamWorkload()
    getUpcomingDeadlines()

    return () => {}
  }, [])

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        {/* Welcome Header with modern gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                Welcome back, {currentUser?.name}! 👋
              </h2>
              <p className="text-blue-100 text-lg flex items-center gap-2">
                <span className="text-2xl">📅</span>
                {moment().format("dddd, MMMM Do YYYY")}
              </p>
            </div>

            <div className="mt-6 md:mt-0">
              <button
                className="group bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
                onClick={() => navigate("/admin/create-task")}
              >
                <span className="text-xl">+</span>
                Create New Task
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid with glassmorphism */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Tasks</h3>
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-4xl font-extrabold text-gray-900">
                  {dashboardData?.charts?.taskDistribution?.All || 0}
                </p>
                <div className="mt-2 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-100 hover:border-yellow-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500 opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Pending</h3>
                  <span className="text-3xl">⏳</span>
                </div>
                <p className="text-4xl font-extrabold text-gray-900">
                  {dashboardData?.charts?.taskDistribution?.Pending || 0}
                </p>
                <div className="mt-2 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100 hover:border-indigo-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">In Progress</h3>
                  <span className="text-3xl">🚀</span>
                </div>
                <p className="text-4xl font-extrabold text-gray-900">
                  {dashboardData?.charts?.taskDistribution?.InProgress || 0}
                </p>
                <div className="mt-2 h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"></div>
              </div>
            </div>

            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Completed</h3>
                  <span className="text-3xl">✅</span>
                </div>
                <p className="text-4xl font-extrabold text-gray-900">
                  {dashboardData?.charts?.taskDistribution?.Completed || 0}
                </p>
                <div className="mt-2 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Deadlines Alert */}
        <UpcomingDeadlines tasks={upcomingDeadlines} />

        {/* Charts Section with modern styling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🍰</span>
              <h3 className="text-xl font-bold text-gray-800">Task Distribution</h3>
            </div>
            <div className="h-64">
              <CustomPieChart
                data={pieChartData}
                label="Total Balance"
                colors={COLORS}
              />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📊</span>
              <h3 className="text-xl font-bold text-gray-800">Task Priority Levels</h3>
            </div>
            <div className="h-64">
              <CustomBarChart data={barChartData} />
            </div>
          </div>
        </div>

        {/* Team Workload Section with enhanced styling */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👥</span>
              <h3 className="text-2xl font-bold text-gray-800">Team Workload Overview</h3>
            </div>
            <div className="flex gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-md"></div>
                <span className="text-gray-700">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md"></div>
                <span className="text-gray-700">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-md"></div>
                <span className="text-gray-700">Completed</span>
              </div>
            </div>
          </div>
          <TeamWorkloadChart data={teamWorkload} />
        </div>

        {/* Recent Task Section */}
        <RecentTasks tasks={dashboardData?.recentTasks} />
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
