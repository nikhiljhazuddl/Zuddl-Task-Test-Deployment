import React, { useEffect, useState } from "react"
import axiosInstance from "../utils/axioInstance"
import { FaUsers, FaCrown } from "react-icons/fa"
import Modal from "./Modal"
import AvatarGroup from "./AvatarGroup"

const TeamMemberSelector = ({
  primaryOwners,
  setPrimaryOwners,
  contributors,
  setContributors,
}) => {
  const [allUsers, setAllUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempPrimaryOwners, setTempPrimaryOwners] = useState([])
  const [tempContributors, setTempContributors] = useState([])

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/get-users")

      if (response.data?.length > 0) {
        setAllUsers(response.data)
      }
    } catch (error) {
      console.log("Error fetching users:", error)
    }
  }

  const togglePrimaryOwner = (userId) => {
    setTempPrimaryOwners((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        // Remove from contributors if being added as owner
        setTempContributors((prevContrib) =>
          prevContrib.filter((id) => id !== userId)
        )
        return [...prev, userId]
      }
    })
  }

  const toggleContributor = (userId) => {
    setTempContributors((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        // Remove from owners if being added as contributor
        setTempPrimaryOwners((prevOwners) =>
          prevOwners.filter((id) => id !== userId)
        )
        return [...prev, userId]
      }
    })
  }

  const handleAssign = () => {
    setPrimaryOwners(tempPrimaryOwners)
    setContributors(tempContributors)
    setIsModalOpen(false)
  }

  const primaryOwnerAvatars = allUsers
    .filter((user) => primaryOwners.includes(user._id))
    .map((user) => user.profileImageUrl)

  const contributorAvatars = allUsers
    .filter((user) => contributors.includes(user._id))
    .map((user) => user.profileImageUrl)

  const totalMembers = primaryOwners.length + contributors.length

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    if (primaryOwners.length === 0 && contributors.length === 0) {
      setTempPrimaryOwners([])
      setTempContributors([])
    }
  }, [primaryOwners, contributors])

  return (
    <div className="space-y-4 mt-2">
      {totalMembers === 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 shadow-md"
          type="button"
        >
          <FaUsers className="text-lg" /> Add Team Members
        </button>
      )}

      {totalMembers > 0 && (
        <div className="space-y-3">
          {primaryOwnerAvatars.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaCrown className="text-amber-500 text-sm" />
                <span className="text-xs font-medium text-gray-600">
                  Primary Owner{primaryOwnerAvatars.length > 1 ? "s" : ""} (
                  {primaryOwnerAvatars.length})
                </span>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <AvatarGroup avatars={primaryOwnerAvatars} maxVisible={3} />
              </div>
            </div>
          )}

          {contributorAvatars.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaUsers className="text-blue-500 text-sm" />
                <span className="text-xs font-medium text-gray-600">
                  Contributor{contributorAvatars.length > 1 ? "s" : ""} (
                  {contributorAvatars.length})
                </span>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <AvatarGroup avatars={contributorAvatars} maxVisible={3} />
              </div>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            type="button"
          >
            Edit Team Members
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Assign Team Members"}
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Primary Owners</span> have full
              responsibility for the task.{" "}
              <span className="font-semibold">Contributors</span> assist with
              the task. A person can only be assigned one role.
            </p>
          </div>

          {allUsers?.map((user) => {
            const isPrimaryOwner = tempPrimaryOwners.includes(user._id)
            const isContributor = tempContributors.includes(user._id)

            return (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 border-b border-gray-300"
              >
                <img
                  src={user?.profileImageUrl}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{user?.name}</p>
                  <p className="text-[13px] text-gray-500 truncate">{user?.email}</p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                    <input
                      type="radio"
                      name={`role-${user._id}`}
                      checked={isPrimaryOwner}
                      onChange={() => togglePrimaryOwner(user._id)}
                      className="w-4 h-4 text-amber-500 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-xs text-gray-700 flex items-center gap-1">
                      <FaCrown className="text-amber-500" />
                      Owner
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                    <input
                      type="radio"
                      name={`role-${user._id}`}
                      checked={isContributor}
                      onChange={() => toggleContributor(user._id)}
                      className="w-4 h-4 text-blue-500 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-xs text-gray-700 flex items-center gap-1">
                      <FaUsers className="text-blue-500" />
                      Contributor
                    </span>
                  </label>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition-colors duration-200"
            onClick={() => setIsModalOpen(false)}
          >
            CANCEL
          </button>

          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
            onClick={handleAssign}
          >
            DONE
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default TeamMemberSelector
