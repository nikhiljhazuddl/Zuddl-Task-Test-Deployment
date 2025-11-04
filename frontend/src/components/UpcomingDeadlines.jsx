import React from "react"
import { FaClock, FaExclamationTriangle, FaCalendarAlt } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import moment from "moment"

const UpcomingDeadlines = ({ tasks }) => {
  const navigate = useNavigate()

  if (!tasks || tasks.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8 rounded-2xl shadow-lg border border-teal-200/50 overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/20 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-200/20 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 bg-teal-100/50 backdrop-blur-sm rounded-2xl shadow-md">
            <span className="text-5xl">✅</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-teal-700">All Clear! 🎉</h3>
            <p className="text-teal-600 text-lg mt-1">No urgent deadlines this week - great work!</p>
          </div>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "Low":
        return "bg-blue-100 text-blue-700 border-blue-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getDaysUntilDue = (dueDate) => {
    const today = moment().startOf("day")
    const due = moment(dueDate).startOf("day")
    const days = due.diff(today, "days")
    return days
  }

  const getUrgencyIndicator = (daysLeft) => {
    if (daysLeft < 0) {
      return {
        color: "bg-red-500",
        text: "Overdue!",
        icon: <FaExclamationTriangle className="text-red-500" />,
      }
    } else if (daysLeft === 0) {
      return {
        color: "bg-orange-500",
        text: "Due Today!",
        icon: <FaExclamationTriangle className="text-orange-500" />,
      }
    } else if (daysLeft === 1) {
      return {
        color: "bg-yellow-500",
        text: "Due Tomorrow",
        icon: <FaClock className="text-yellow-500" />,
      }
    } else {
      return {
        color: "bg-blue-500",
        text: `${daysLeft} days left`,
        icon: <FaClock className="text-blue-500" />,
      }
    }
  }

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl shadow-lg border border-blue-200/50 overflow-hidden backdrop-blur-sm">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200/20 rounded-full -ml-24 -mb-24"></div>
      
      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100/50 backdrop-blur-sm rounded-2xl shadow-md">
            <FaExclamationTriangle className="text-blue-600 text-3xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              <span>⚠️</span> Urgent Deadlines This Week
            </h3>
            <p className="text-blue-600 text-lg mt-1">
              {tasks.length} task{tasks.length > 1 ? "s" : ""} need{tasks.length === 1 ? "s" : ""} your attention
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/manage-tasks")}
          className="px-6 py-3 bg-blue-500/90 text-white hover:bg-blue-600 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
        >
          <span>📝</span> View All Tasks
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {tasks.map((task) => {
          const daysLeft = getDaysUntilDue(task.dueDate)
          const urgency = getUrgencyIndicator(daysLeft)

          return (
            <div
              key={task._id}
              className="group relative bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-gray-200/50 hover:border-blue-300/50 overflow-visible"
              onClick={() => navigate(`/admin/task-details/${task._id}`)}
            >
              {/* Urgency Badge - Top Right - Now properly positioned */}
              <div className="absolute top-2 right-2 z-20">
                <div
                  className={`${urgency.color} text-white rounded-full px-3 py-1.5 text-xs font-bold shadow-md flex items-center gap-1.5 whitespace-nowrap ${daysLeft === 0 ? 'animate-pulse' : ''}`}
                >
                  {daysLeft < 0 ? (
                    <>
                      <FaExclamationTriangle className="text-sm" />
                      <span>{Math.abs(daysLeft)}d overdue</span>
                    </>
                  ) : daysLeft === 0 ? (
                    <>
                      <FaExclamationTriangle className="text-sm" />
                      <span>TODAY!</span>
                    </>
                  ) : (
                    <>
                      <FaClock className="text-sm" />
                      <span>{daysLeft}d left</span>
                    </>
                  )}
                </div>
              </div>

              {/* Priority Badge - Top Left */}
              <div className="absolute top-2 left-2">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>

              {/* Task Content */}
              <div className="mt-12">
                <h4 className="font-bold text-gray-800 text-lg mb-3 line-clamp-2">
                  {task.title}
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-gray-400" />
                    <span className="text-gray-600 font-medium">
                      {moment(task.dueDate).format("MMM D, YYYY")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {urgency.icon}
                    <span
                      className={`font-bold text-sm ${
                        daysLeft < 0
                          ? "text-red-600"
                          : daysLeft === 0
                          ? "text-orange-600"
                          : daysLeft === 1
                          ? "text-amber-600"
                          : "text-blue-600"
                      }`}
                    >
                      {urgency.text}
                    </span>
                  </div>

                  {task.status && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <span className="mr-1.5">
                          {task.status === "Completed" ? "✅" : task.status === "In Progress" ? "🚀" : "⏳"}
                        </span>
                        {task.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UpcomingDeadlines
