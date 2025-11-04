import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

const TeamWorkloadChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No team workload data available
      </div>
    )
  }

  // Custom tooltip to show detailed information
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b">
            <img
              src={data.profileImageUrl || `https://ui-avatars.com/api/?name=${data.name}&background=random`}
              alt={data.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <p className="font-bold text-gray-800">{data.name}</p>
              <p className="text-xs text-gray-500">{data.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium text-gray-600">Pending:</span>
              </div>
              <span className="font-bold text-yellow-600">{data.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-600">In Progress:</span>
              </div>
              <span className="font-bold text-blue-600">{data.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-600">Completed:</span>
              </div>
              <span className="font-bold text-green-600">{data.completed}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t mt-2">
              <span className="text-sm font-bold text-gray-700">Total Tasks:</span>
              <span className="font-bold text-lg text-gray-800">{data.total}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom X-axis tick with index only
  const CustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#6B7280"
          fontSize={14}
          fontWeight={600}
        >
          {payload.value + 1}
        </text>
      </g>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data.map((item, index) => ({ ...item, index }))}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="index"
            tick={<CustomXAxisTick />}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={{ stroke: '#D1D5DB' }}
          />
          <YAxis
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={{ stroke: '#D1D5DB' }}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
            iconSize={10}
          />
          <Bar
            dataKey="pending"
            name="Pending"
            fill="#FFA500"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
          <Bar
            dataKey="inProgress"
            name="In Progress"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
          <Bar
            dataKey="completed"
            name="Completed"
            fill="#10B981"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Team Members Section Below Chart */}
      <div className="border-t-2 border-gray-100 pt-6">
        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
          Team Members
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {data.map((member, index) => (
            <div
              key={member.userId}
              className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
            >
              <div className="relative mb-2">
                <img
                  src={member.profileImageUrl || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                  alt={member.name}
                  className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow">
                  {index + 1}
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-800 text-center line-clamp-1">
                {member.name}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">
                  {member.pending}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                  {member.inProgress}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                  {member.completed}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Total: {member.total}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamWorkloadChart
