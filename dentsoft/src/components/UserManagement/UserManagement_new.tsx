import { useState } from 'react'
import moment from 'moment'
import Modal from '../Core/Modal'
import { showToastMessage } from '../Core/Toast'
import { getUserList, getActivityLog, useUserOperations } from '../../hooks/useUser'
import { getRoleProfileList, useRoleOperations } from '../../hooks/useRole'

interface UserForm {
    first_name: string
    email: string
    new_password: string
    role_profile_name: string
    phone: string
    enabled: number
    [key: string]: any
}

interface RoleForm {
    role_profile: string
    custom_role_description: string
    role: string
    roles: { role: string }[]
    [key: string]: any
}

function UserManagement() {
    // State management
    const [currentTab, setCurrentTab] = useState("Active Users")
    const [searchUser, setSearchUser] = useState("")
    const [searchRole, setSearchRole] = useState("")
    const [userRole, setUserRole] = useState("")
    const [activityDate, setActivityDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
    
    // Modal states
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
    
    // Form states
    const [userForm, setUserForm] = useState<UserForm>({
        first_name: "",
        email: "",
        new_password: "",
        role_profile_name: "",
        phone: "",
        enabled: 1,
    })
    
    const [roleForm, setRoleForm] = useState<RoleForm>({
        role_profile: "",
        custom_role_description: "",
        role: "",
        roles: [],
    })
    
    const [editingUser, setEditingUser] = useState<any>(null)
    const [editingRole, setEditingRole] = useState<any>(null)
    const [showPassword, setShowPassword] = useState(false)
    
    // Data fetching hooks
    const { 
        data: users, 
        isLoading: usersLoading, 
        error: usersError, 
        mutate: refreshUsers 
    } = getUserList(searchUser, currentTab === "Active Users", undefined, userRole)
    
    const { 
        data: roles, 
        isLoading: rolesLoading, 
        error: rolesError, 
        mutate: refreshRoles 
    } = getRoleProfileList(searchRole)
    
    const { 
        data: activity, 
        isLoading: activityLoading, 
        error: activityError, 
        mutate: refreshActivity 
    } = getActivityLog(activityDate)
    
    // CRUD operations
    const { addUser, editUser, removeUser } = useUserOperations()
    const { addRole, editRole, removeRole } = useRoleOperations()
    
    const tabs = ["Active Users", "Inactive Users", "Roles", "Activity"]
    const pulseRows = new Array(10).fill(null)
    
    // Form handlers
    const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setUserForm(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleRoleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setRoleForm(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleUserSubmit = async () => {
        try {
            if (editingUser) {
                await editUser(editingUser.name, userForm)
                showToastMessage({ type: "success", title: "User updated successfully" })
            } else {
                await addUser(userForm)
                showToastMessage({ type: "success", title: "User created successfully" })
            }
            setIsUserModalOpen(false)
            resetUserForm()
            refreshUsers()
        } catch (error: any) {
            showToastMessage({ type: "error", title: error.message || "Failed to save user" })
        }
    }
    
    const handleRoleSubmit = async () => {
        try {
            if (editingRole) {
                await editRole(editingRole.name, roleForm)
                showToastMessage({ type: "success", title: "Role updated successfully" })
            } else {
                await addRole(roleForm)
                showToastMessage({ type: "success", title: "Role created successfully" })
            }
            setIsRoleModalOpen(false)
            resetRoleForm()
            refreshRoles()
        } catch (error: any) {
            showToastMessage({ type: "error", title: error.message || "Failed to save role" })
        }
    }
    
    const handleDeleteUser = async (userName: string) => {
        try {
            await removeUser(userName)
            showToastMessage({ type: "success", title: "User deleted successfully" })
            refreshUsers()
        } catch (error: any) {
            showToastMessage({ type: "error", title: error.message || "Failed to delete user" })
        }
    }
    
    const handleDeleteRole = async (roleName: string) => {
        try {
            await removeRole(roleName)
            showToastMessage({ type: "success", title: "Role deleted successfully" })
            refreshRoles()
        } catch (error: any) {
            showToastMessage({ type: "error", title: error.message || "Failed to delete role" })
        }
    }
    
    const resetUserForm = () => {
        setUserForm({
            first_name: "",
            email: "",
            new_password: "",
            role_profile_name: "",
            phone: "",
            enabled: 1,
        })
        setEditingUser(null)
    }
    
    const resetRoleForm = () => {
        setRoleForm({
            role_profile: "",
            custom_role_description: "",
            role: "",
            roles: [],
        })
        setEditingRole(null)
    }
    
    const openUserModal = (user?: any) => {
        if (user) {
            setUserForm({
                first_name: user.first_name || "",
                email: user.email || "",
                new_password: "",
                role_profile_name: user.role_profile_name || "",
                phone: user.phone || "",
                enabled: user.enabled || 1,
            })
            setEditingUser(user)
        } else {
            resetUserForm()
        }
        setIsUserModalOpen(true)
    }
    
    const openRoleModal = (role?: any) => {
        if (role) {
            setRoleForm({
                role_profile: role.role_profile || "",
                custom_role_description: role.custom_role_description || "",
                role: role.role || "",
                roles: role.roles || [],
            })
            setEditingRole(role)
        } else {
            resetRoleForm()
        }
        setIsRoleModalOpen(true)
    }
    
    const renderUserTab = () => (
        <div className='bg-white rounded-md drop-shadow'>
            <div className='flex justify-between items-center p-4'>
                <h2 className='text-lg font-semibold'>{currentTab}</h2>
                <button
                    onClick={() => openUserModal()}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                >
                    Add User
                </button>
            </div>
            
            <div className='p-4 border-t'>
                <div className='flex gap-4 mb-4'>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className='border px-3 py-2 rounded'
                    />
                    <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className='border px-3 py-2 rounded'
                    >
                        <option value="">All Roles</option>
                        {roles?.map((role: any) => (
                            <option key={role.name} value={role.name}>
                                {role.role_profile}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className='overflow-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b'>
                                <th className='text-left p-2'>Name</th>
                                <th className='text-left p-2'>Email</th>
                                <th className='text-left p-2'>Role</th>
                                <th className='text-left p-2'>Phone</th>
                                <th className='text-left p-2'>Status</th>
                                <th className='text-left p-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersLoading ? (
                                pulseRows.map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                    </tr>
                                ))
                            ) : usersError ? (
                                <tr>
                                    <td colSpan={6} className='text-center p-4'>
                                        <p>Error loading users</p>
                                        <button 
                                            onClick={() => refreshUsers()}
                                            className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
                                        >
                                            Retry
                                        </button>
                                    </td>
                                </tr>
                            ) : users?.length ? (
                                users.map((user: any) => (
                                    <tr key={user.name} className='border-b'>
                                        <td className='p-2'>{user.first_name}</td>
                                        <td className='p-2'>{user.email}</td>
                                        <td className='p-2'>{user.role_profile_name}</td>
                                        <td className='p-2'>{user.phone}</td>
                                        <td className='p-2'>
                                            <span className={`px-2 py-1 rounded text-sm ${
                                                user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.enabled ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className='p-2'>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={() => openUserModal(user)}
                                                    className='text-blue-500 hover:text-blue-700'
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.name)}
                                                    className='text-red-500 hover:text-red-700'
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className='text-center p-4'>
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
    
    const renderRoleTab = () => (
        <div className='bg-white rounded-md drop-shadow'>
            <div className='flex justify-between items-center p-4'>
                <h2 className='text-lg font-semibold'>Roles</h2>
                <button
                    onClick={() => openRoleModal()}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                >
                    Add Role
                </button>
            </div>
            
            <div className='p-4 border-t'>
                <div className='mb-4'>
                    <input
                        type="text"
                        placeholder="Search roles..."
                        value={searchRole}
                        onChange={(e) => setSearchRole(e.target.value)}
                        className='border px-3 py-2 rounded'
                    />
                </div>
                
                <div className='overflow-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b'>
                                <th className='text-left p-2'>Role Name</th>
                                <th className='text-left p-2'>Description</th>
                                <th className='text-left p-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rolesLoading ? (
                                pulseRows.map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                    </tr>
                                ))
                            ) : rolesError ? (
                                <tr>
                                    <td colSpan={3} className='text-center p-4'>
                                        <p>Error loading roles</p>
                                        <button 
                                            onClick={() => refreshRoles()}
                                            className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
                                        >
                                            Retry
                                        </button>
                                    </td>
                                </tr>
                            ) : roles?.length ? (
                                roles.map((role: any) => (
                                    <tr key={role.name} className='border-b'>
                                        <td className='p-2'>{role.role_profile}</td>
                                        <td className='p-2'>{role.custom_role_description}</td>
                                        <td className='p-2'>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={() => openRoleModal(role)}
                                                    className='text-blue-500 hover:text-blue-700'
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRole(role.name)}
                                                    className='text-red-500 hover:text-red-700'
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className='text-center p-4'>
                                        No roles found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
    
    const renderActivityTab = () => (
        <div className='bg-white rounded-md drop-shadow'>
            <div className='flex justify-between items-center p-4'>
                <h2 className='text-lg font-semibold'>Activity Log</h2>
                <input
                    type="date"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className='border px-3 py-2 rounded'
                />
            </div>
            
            <div className='p-4 border-t'>
                <div className='overflow-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b'>
                                <th className='text-left p-2'>Time</th>
                                <th className='text-left p-2'>User</th>
                                <th className='text-left p-2'>Action</th>
                                <th className='text-left p-2'>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activityLoading ? (
                                pulseRows.map((_, index) => (
                                    <tr key={index} className="animate-pulse">
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                        <td className="p-2"><div className='bg-neutral-200 rounded h-4'></div></td>
                                    </tr>
                                ))
                            ) : activityError ? (
                                <tr>
                                    <td colSpan={4} className='text-center p-4'>
                                        <p>Error loading activity</p>
                                        <button 
                                            onClick={() => refreshActivity()}
                                            className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
                                        >
                                            Retry
                                        </button>
                                    </td>
                                </tr>
                            ) : activity?.length ? (
                                activity.map((log: any, index: number) => (
                                    <tr key={index} className='border-b'>
                                        <td className='p-2'>{moment(log.creation).format('HH:mm:ss')}</td>
                                        <td className='p-2'>{log.owner}</td>
                                        <td className='p-2'>{log.subject}</td>
                                        <td className='p-2'>{log.content}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className='text-center p-4'>
                                        No activity found for this date
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

    return (
        <div className='bg-[#FAFAFD] flex flex-col pl-7 p-5 box-border gap-10 min-h-full fade_in'>
            {/* Tab Navigation */}
            <div className='flex gap-4'>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`px-4 py-2 rounded ${
                            currentTab === tab 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            {/* Tab Content */}
            {(currentTab === "Active Users" || currentTab === "Inactive Users") && renderUserTab()}
            {currentTab === "Roles" && renderRoleTab()}
            {currentTab === "Activity" && renderActivityTab()}
            
            {/* User Modal */}
            <Modal
                isShow={isUserModalOpen}
                setShow={setIsUserModalOpen}
                title={editingUser ? "Edit User" : "Add User"}
                onSubmit={handleUserSubmit}
                submitLabel={editingUser ? "Update" : "Create"}
            >
                <div className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Name *</label>
                        <input
                            type="text"
                            name="first_name"
                            value={userForm.first_name}
                            onChange={handleUserInputChange}
                            className='w-full border px-3 py-2 rounded'
                            required
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-1'>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleUserInputChange}
                            className='w-full border px-3 py-2 rounded'
                            required
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-1'>Password *</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="new_password"
                                value={userForm.new_password}
                                onChange={handleUserInputChange}
                                className='w-full border px-3 py-2 rounded pr-10'
                                required={!editingUser}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-2.5 text-gray-500'
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-1'>Role *</label>
                        <select
                            name="role_profile_name"
                            value={userForm.role_profile_name}
                            onChange={handleUserInputChange}
                            className='w-full border px-3 py-2 rounded'
                            required
                        >
                            <option value="">Select Role</option>
                            {roles?.map((role: any) => (
                                <option key={role.name} value={role.name}>
                                    {role.role_profile}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-1'>Phone *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={userForm.phone}
                            onChange={handleUserInputChange}
                            className='w-full border px-3 py-2 rounded'
                            required
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-1'>Status</label>
                        <select
                            name="enabled"
                            value={userForm.enabled}
                            onChange={handleUserInputChange}
                            className='w-full border px-3 py-2 rounded'
                        >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                        </select>
                    </div>
                </div>
            </Modal>
            
            {/* Role Modal */}
            <Modal
                isShow={isRoleModalOpen}
                setShow={setIsRoleModalOpen}
                title={editingRole ? "Edit Role" : "Add Role"}
                onSubmit={handleRoleSubmit}
                submitLabel={editingRole ? "Update" : "Create"}
            >
                <div className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Role Name *</label>
                        <input
                            type="text"
                            name="role_profile"
                            value={roleForm.role_profile}
                            onChange={handleRoleInputChange}
                            className='w-full border px-3 py-2 rounded'
                            required
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-1'>Description</label>
                        <input
                            type="text"
                            name="custom_role_description"
                            value={roleForm.custom_role_description}
                            onChange={handleRoleInputChange}
                            className='w-full border px-3 py-2 rounded'
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium mb-1'>Type</label>
                        <select
                            name="role"
                            value={roleForm.role}
                            onChange={handleRoleInputChange}
                            className='w-full border px-3 py-2 rounded'
                        >
                            <option value="">Select Type</option>
                            <option value="doctor">Doctor</option>
                            <option value="receptionist">Receptionist</option>
                            <option value="hygienist">Hygienist</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default UserManagement
