import React, { Fragment, useContext, useEffect, useState } from 'react'
import Select from 'react-select';
// import parse from 'html-react-parser'
import AsyncSelect from 'react-select/async'
import { Dialog, Transition } from '@headlessui/react'
import showPasswordIcon from "../../assets/ShowPassword.svg";
import hidePasswordIcon from "../../assets/HidePassword.svg";
import QuestionMark from "../../assets/Question-mark.svg"
// import Close from "../../assets/Close.svg"
import { ToastContext } from '../../contexts/ToastContext'
import { getActivity, getUsers, registerUser, updateUser } from '../../Api/UserApi'
import moment from 'moment'
import { createRole, deleteRole, getPermissions, getRoles, updateRole } from '../../Api/RolesApi';
import { fileUpload, getFile } from '../../Api/CommonApi';
import { AppContext } from '../../contexts/AppContext';
import { ApiContext } from '../../contexts/ApiContext';
import { createUser, getUserList } from '../../hooks/useUser';
import { getRoleProfileList } from '../../hooks/useRole';
import { useFrappeCreateDoc } from 'frappe-react-sdk';


function UserManagement() {
    const { notify } = useContext(ToastContext)
    const { getUserDetails, loadProfilePicture } = useContext(ApiContext)
    const { userDetails, setUserDetails } = useContext(AppContext)
    const [showPassword, setShowPassword] = useState(false);
    const [userButton, setUserButton] = useState(true);
    const [roleButton, setRoleButton] = useState(true);
    const [isUserOpen, setIsAddUserOpen] = useState(false)
    const [usersLoading, setUsersLoading] = useState("Loaded")
    const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
    const [isConfirmBoxOpen, setIsConfirmBoxOpen] = useState(false)
    const [confirmBoxValue, setConfirmBoxValue] = useState("")
    const [confirmBoxError, setConfirmBoxError] = useState("")
    const [rolesLoading, setRolesLoading] = useState("Loaded")
    const [activityLoading, setActivityLoading] = useState("Loaded")
    const [selectedUserId, setSelectedUserId] = useState("")
    const [selectedRole, setSelectedRole] = useState({})
    const [selectedPicture, setSelectedPicture] = useState("")
    const [loading, setLoading] = useState(false);
    const [activityMeta, setActivityMeta] = useState({});
    const [rolesMeta, setRolesMeta] = useState({});
    const [usersMeta, setUsersMeta] = useState({});
    const [currentTab, setcurrentTab] = useState("Active Users");
    const [selectedUserPicture, setSelectedUserPicture] = useState("")
    const [userRole, setUserRole] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [searchRole, setSearchRole] = useState("");
    // const [roles, setRoles] = useState([])
    // const [users, setUsers] = useState([])
    const [activity, setActivity] = useState([])
    const [activityDate, setActivityDate] = useState(moment(new Date).format("YYYY-MM-DD"))
    const [permissions, setPermissions] = useState([])
    const [permissionsCatogery, setPermissionsCatogery] = useState({
        // Patient: [],
        // File: [],
        // Scheme: [],
        // Treatment: [],
        // Appointment: [],
        // Payment: [],
        // Form: [],
        // Document: [],
        // User: [],
        // Role: [],
        Other: []
    })
    const [permissionsOpen, setPermissionsOpen] = useState({ Patient: false, File: false, Scheme: false, Treatment: false, Appointment: false, Payment: false, Form: false, Document: false, User: false, Role: false, Other: false });
    const tabs = ["Active Users", "Inactive Users", "Roles", "Activity"]
    const [userForm, setUserForm] = useState({
        first_name: "",
        email: "",
        new_password: "",
        role_profile_name: "",
        phone: "",
        enabled: 1,
        profile_photo: {
            path: "",
            metadata: {
                file_name: "",
                file_size: "",
                file_type: "",
            },
        },
    })
    const [roleForm, setRoleForm] = useState({
        role_profile: "",
        custom_role_description: "",
        role: "",
        roles: [],
    })
    const userInputs = [
        { head: "Name", types: [{ type: "text" }], name: "first_name", required: true },
        { head: "Email ID", types: [{ type: "email" }], name: "email", required: true },
        { head: "Password", types: [{ type: "password" }], name: "new_password", pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_+:"?;,.]).{8,}', title: "* Choose 8 characters, combining letters, numbers, and symbols.", required: true },
        { head: "Role", types: [{ type: "select" }], options: [""], name: "role_profile_name", required: true },
        { head: "Phone", types: [{ type: "tel" }], name: "phone", pattern: "[0-9]{9-15}", required: true, title: "Ensure your mobile number is correct" },
        { head: "Status", types: [{ type: "select" }], options: ["active", "inactive"], name: "enabled" },
    ]
    const roleInputs = [
        { head: "Name", types: [{ type: "text" }], name: "role_profile", required: true },
        { head: "Description", types: [{ type: "text" }], name: "custom_role_description", required: false },
        { head: "Frequent Role", types: [{ type: "select" }], options: ["doctor", "receptionist", "hygenist"], name: "role" },
    ]
    const pulseRows = new Array(10).fill()
    const permissionSelect = (event) => {
        const { checked, value } = event.target
        checked ?
            setRoleForm((prev) =>
            ({
                ...prev, roles: [...prev.roles, { role: value }]
            })
            )
            : setRoleForm((prev) => {
                const index = prev.roles.findIndex(role => role.role === value);
                if (index != -1) {
                    const list = [...prev.roles]
                    list.splice(index, 1);
                    return ({
                        ...prev,
                        roles: list
                    })
                }
                else return (prev);
            }
            );
    }

    const { data: users } = getUserList()
    const { data: roles } = getRoleProfileList()
    const { createDoc, isCompleted, error, loading:createLoading } = useFrappeCreateDoc();



    const listUsers = async (search = "", page = 0, size = "", active = "", role = "") => {
        setUsersLoading("Loading")
        setUsers([])
        try {
            const result = await getUsers(search, page, size, active, role);
            console.log(result.data)
            // page ? (setUsers(prev => ([...users, ...result.data.data])), setUserPage(userPage + 1)) : (setUsers(result.data.data), setUserPage(1))
            setUsers(result.data.data)
            setUsersMeta(result.data.meta)
            setUsersLoading("Loaded")
        } catch (error) {
            console.log(error)
            setUsersLoading("Error")
        }
    }
    const listActivity = async (date = "", page = 0, size = "") => {
        setActivityLoading("Loading")
        setActivity([])
        try {
            const result = await getActivity(date, page, size);
            // console.log(result.data)
            // page ? (setActivity(prev => ([...activity, ...result.data.data])), setActivityPage(activityPage + 1)) : (setActivity(result.data.data), setActivityPage(1))
            setActivity(result.data.data)
            setActivityMeta(result.data.meta)
            setActivityLoading("Loaded")
        } catch (error) {
            console.log(error)
            setActivityLoading("Error")
        }
    }
    const addUser = async (fileData = "") => {
        notify("", "error")
        try {
            // const payload = fileData ? { ...userForm, profile_photo: fileData } : userForm
            const result = await createDoc('User',userForm)
            // const result = await registerUser(payload)
            notify("User Added SuccessFully", "success")
            setLoading(false)
            closeModal();
            console.log(result)
            listUsers(searchUser, usersMeta?.page, usersMeta?.size, `${currentTab === "Active Users"}`, userRole)
        } catch (error) {
            console.log(error)
            setLoading(false)
            notify(error.message, "error")
        }
    }
    const editUser = async (id, fileData = "") => {
        try {
            const payload = fileData ? { ...userForm, profile_photo: fileData } : userForm
            const result = await updateUser(payload, id)
            if (id === userDetails?.id) {
                console.log(result)
                getUserDetails(userDetails.id).then(response => {
                    localStorage.setItem("userDetails", JSON.stringify(response));
                    setUserDetails(response);
                })
                // localStorage.setItem("userDetails", JSON.stringify(result));
                // setUserDetails(result);
            }
            listUsers(searchUser, usersMeta?.page, usersMeta?.size, `${currentTab === "Active Users"}`, userRole);
            setLoading(false)
            notify("User Updated Successfully", "success")
            closeModal()
        } catch (error) {
            console.log(error)
            setLoading(false)
            notify(error.message, "error")
        }

    }
    const editRole = async (id) => {
        try {
            const payload = roleForm;
            const result = await updateRole(payload, id)
            setLoading(false)
            listRoles(searchRole, rolesMeta?.page, rolesMeta?.size);
            closeModal()
            notify("Role Updated Successfully", "success")
            setRoleForm({
                role_profile: "",
                custom_role_description: "",
                role: "",
                roles: [],
            })
        } catch (error) {
            console.log(error)
            setLoading(false)
            notify(error.message, "error")
        }

    }
    const listRoles = async (search = "", page = 0, size = "") => {
        setRolesLoading("Loading")
        setRoles([])
        try {
            const result = await getRoles(search, page, size)
            console.log(result.data.data)
            setRoles(result.data.data)
            setRolesMeta(result.data.meta)
            setRolesLoading("Loaded")
            return result.data.data;
        } catch (error) {
            console.log(error)
            setRolesLoading("Error")
        }
    }
    const addRole = async () => {
        try {
            const payload = roleForm;
            const result = await createRole(payload);
            notify("Role Added SuccessFully", "success")
            setLoading(false)
            closeModal();
            listRoles(searchRole, rolesMeta?.page, rolesMeta?.size);
        } catch (error) {
            console.log(error)
            setLoading(false)
            notify(error.message, "error")
        }
    }
    const removeRole = async (id) => {
        try {
            const result = await deleteRole(id)
            notify(selectedRole.name + " Role deleted Successfully", "success")
            listRoles(searchRole, rolesMeta?.page, rolesMeta?.size)
            closeModal()
        } catch (error) {
            console.log(error.message)
            notify(error.message, "error")
        }
    }
    const loadFile = async (path = "") => {
        if (path) {
            setSelectedUserPicture("Loading")
            try {
                const result = await getFile(path)
                const url = result.request.responseURL
                // console.log(result)
                // console.log(url)
                setSelectedUserPicture(url)
            } catch (error) {
                console.log(error)
                if (error.code === 400)
                    setSelectedUserPicture("Missing")
                setSelectedUserPicture("Error")
            }
        }
    }
    const handleUploadFile = async (fileData, message) => {
        try {
            // console.log("uploading profile picture")
            if (fileData) {
                const form = new FormData()
                form.append("file", fileData)
                form.append("upload_type", "image")
                form.append("folder", "userProfile")
                form.append("user_id", selectedUserId)
                const payload = form;
                const result = await fileUpload(payload)
                console.log(result)
                notify(message, "success")
                return result;
            }
        } catch (error) {
            console.log(error.message)
            notify(error.message, "error")
        }
    }
    const removePicture = () => {
        setSelectedUserPicture("");
        setSelectedPicture("");
        setUserForm(prev => ({
            ...prev, profile_photo: {
                path: "",
                metadata: {
                    file_name: "",
                    file_size: "",
                    file_type: "",
                },
            }
        }))
    }
    const listPermissions = async () => {
        // setPermissionsCatogery({ Scheme: [], Treatment: [], User: [], Patient: [], Role: [], File: [], Appointment: [], Payment: [], Form: [], Document: [], Other: [] })
        try {
            const result = await getPermissions();
            setPermissions(result.data.data)
            result.data?.data.map(permission => {
                setPermissionsCatogery(prev => {
                    switch (permission?.name.split(':')[0]) {
                        case "scheme": return { ...prev, Scheme: [...prev.Scheme, permission] }
                        case "treatment": return { ...prev, Treatment: [...prev.Treatment, permission] }
                        case "user": return { ...prev, User: [...prev.User, permission] }
                        case "patient": return { ...prev, Patient: [...prev.Patient, permission] }
                        case "appointment": return { ...prev, Appointment: [...prev.Appointment, permission] }
                        case "payment": return { ...prev, Payment: [...prev.Payment, permission] }
                        case "form": return { ...prev, Form: [...prev.Form, permission] }
                        case "document": return { ...prev, Document: [...prev.Document, permission] }
                        case "role": return { ...prev, Role: [...prev.Role, permission] }
                        case "file": return { ...prev, File: [...prev.File, permission] }
                        default: return { ...prev, Other: [...prev.Other, permission] }
                    }
                })
            })
            // console.log(result.data.data)
            // console.log(permissionsCatogery)
        } catch (error) {
            console.log(error)
        }
    }
    const fileChange = (event) => {
        const { name, value, files } = event.target;
        if (files[0]) {
            const type = files[0].type;
            if (type === "image/png" || type === "image/jpg" || type === "image/webp" || type === "image/jpeg") {
                setSelectedPicture(files[0])
            } else {
                setSelectedPicture("")
            }
        } else {
            setSelectedPicture("")
            setUserForm((prev) => ({
                ...prev, [name]: {
                    path: "",
                    metadata: {
                        file_name: "",
                        file_size: "",
                        file_type: "",
                    },
                },
            }))
        }

    }
    const handleUserSubmit = (event) => {
        event.preventDefault();
        if (!loading) {
            setLoading(true)
            if (userButton) {
                handleUploadFile(selectedPicture, "Profile picture added success").then((fileData) => {
                    addUser(fileData);
                }).catch((error) => console.log(error))
            }
            else {
                handleUploadFile(selectedPicture, "Profile picture updated success").then((fileData) => {
                    editUser(selectedUserId, fileData)
                }).catch((error) => console.log(error))
            }
        }
    };
    const handleUserChange = (event) => {
        const { value, name } = event.target;
        setUserForm((prev) => ({ ...prev, [name]: name === "first_name" ? value.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : value, }))
    }
    const handleRoleSubmit = (event) => {
        event.preventDefault();
        if (!loading) {
            // console.log(roleForm)
            setLoading(true)
            if (roleButton)
                addRole();
            else
                editRole(selectedRole.id)
        }
    };
    const handleRoleChange = (event) => {
        const { name, value } = event.target
        if (name === "role") {
            if (value === "receptionist")
                setRoleForm((prev) => ({ ...prev, name: "Receptionist", roles: ['105d5224-0ba1-454f-b712-a8457f9d62cc', '207635e3-47c7-41c7-9014-cac8f56f078a', '54c235f2-d9e7-40de-92e5-1023cd235701', '25a4697a-4bba-4d55-b1d8-3342159d9220', 'c620cfde-89e1-45b8-95a7-793d8c472ebe', 'f1874b50-e5d7-4dd7-91d3-b81cb681d6da', 'a4040a34-0198-4a20-be6c-101bfe928ac9', '7dcda272-de03-4a0d-8386-4eded7ae1d4e', 'ad8e78a8-9f52-4df8-9206-15b5ab41c071', '2cf1cab0-d2b8-4966-a4f3-38a82ca55593', '6191856c-acca-4e75-86c3-94d0ceedcaf6', '64baec4d-adde-492d-8826-607c318f3227', '47c13c64-08e8-49b8-84c3-9d0439d765e4', '554cc309-c315-48b2-86ef-d252ade7439c', '4eaea468-296e-4313-96a3-75b89fcf9652', '0cc58b91-b707-41a0-a26f-afd62865b1f3', '2059916d-80f1-47ed-bb36-264bfe99f68f', '6370b466-455d-4b54-9786-a20c5cce8a34', '5b1b6089-525c-4dbe-b532-4b16a91c1e6d', '753f0a3d-eb74-4c6b-aad6-2da4787e6119', 'ba839ef0-834b-47e4-a15c-e4f3de1367b2', 'a9fe8dc1-f49d-4ea8-b9e9-f17ad0d23c70', '25be4af5-e7eb-4835-a7cd-d85731835c28', '4391d332-93c8-479a-b11a-41492d309c86', '836c391d-3eb4-4492-89fd-ee03b6076985', '789b5015-97ec-4240-99e4-230a61cfbe55', 'b65878f7-30fd-4d11-b80b-afe1a6007d8e', '11c83afe-bf69-49e8-8236-1fbba49a5194', '5a05af17-a377-4d1b-87d1-ca785abe94d9', '5049e95c-e431-48e1-a2fb-9aac658704a0', '489fa8ab-cf88-47d1-8a89-6f394f7394eb', '6b3af098-660b-45d3-81d1-9ffec91e2c9b', '6cf0b832-c04c-4bda-80ca-69451210db45', 'a83b0264-4f4b-432f-9bcc-a98dbf54064d', 'e6d90242-7ec2-4ab9-b414-806275af5270', '13accebb-854d-4948-a339-bd04ecb5a236', '25eb3315-c1ae-4653-8c4b-caa195da6e01', 'e7b065b1-b119-45e2-922b-add0428e0bbe', '50b8c95c-2bb3-414d-a964-08b05f00a9a7', '5f0314a7-0ad0-4870-bc32-c2ffc06a3795', '6c55f6c7-6717-4df5-be5e-0ca71df2b9b7', 'fe148261-b08d-4ca6-9911-36cd2d1e1902', 'e7459690-ec77-4a17-8e6e-0dc5622d4d8e', 'f0b9f6c9-22b6-4443-803b-a8170633a0a9', '1268a7a0-ce3b-469c-a586-85cda59fd277', 'c8ad2b0e-351a-46d3-98f5-f0f8713ee0aa'], }))
            else if (value === "doctor")
                setRoleForm((prev) => ({ ...prev, name: "Doctor", roles: ['105d5224-0ba1-454f-b712-a8457f9d62cc', 'f1874b50-e5d7-4dd7-91d3-b81cb681d6da', '25a4697a-4bba-4d55-b1d8-3342159d9220', '7dcda272-de03-4a0d-8386-4eded7ae1d4e', 'a4040a34-0198-4a20-be6c-101bfe928ac9', '6191856c-acca-4e75-86c3-94d0ceedcaf6', '47c13c64-08e8-49b8-84c3-9d0439d765e4', '1f4b203c-a675-44b0-898b-ea3ae3b81aa7', '64baec4d-adde-492d-8826-607c318f3227', 'c3e8f707-0dae-40a5-b9a8-a5fc0eab7c5d', '5b1b6089-525c-4dbe-b532-4b16a91c1e6d', '6370b466-455d-4b54-9786-a20c5cce8a34', '554cc309-c315-48b2-86ef-d252ade7439c', '2059916d-80f1-47ed-bb36-264bfe99f68f', '25be4af5-e7eb-4835-a7cd-d85731835c28', 'a9fe8dc1-f49d-4ea8-b9e9-f17ad0d23c70', 'e6d90242-7ec2-4ab9-b414-806275af5270', '11c83afe-bf69-49e8-8236-1fbba49a5194', '4391d332-93c8-479a-b11a-41492d309c86', '5a05af17-a377-4d1b-87d1-ca785abe94d9', '836c391d-3eb4-4492-89fd-ee03b6076985', 'b65878f7-30fd-4d11-b80b-afe1a6007d8e', '789b5015-97ec-4240-99e4-230a61cfbe55', '489fa8ab-cf88-47d1-8a89-6f394f7394eb', '6b3af098-660b-45d3-81d1-9ffec91e2c9b', 'e7459690-ec77-4a17-8e6e-0dc5622d4d8e', '0f161997-28c0-4587-8fcf-3e8b3af90e51', '15f87205-1842-48e5-8857-abe5273b2326', '77533a84-9f53-4874-8ed3-b0955ab0f387', 'bc8726b0-7df2-46b5-8be7-a1698dc49cfa', 'f0b9f6c9-22b6-4443-803b-a8170633a0a9', 'c8ad2b0e-351a-46d3-98f5-f0f8713ee0aa', '907e6aec-1348-4c57-9bfb-85499e7a4915', '5fbe9bf9-c93b-4f90-81cf-073470bbc387', '1268a7a0-ce3b-469c-a586-85cda59fd277', 'c620cfde-89e1-45b8-95a7-793d8c472ebe', '13accebb-854d-4948-a339-bd04ecb5a236', '25eb3315-c1ae-4653-8c4b-caa195da6e01', '5049e95c-e431-48e1-a2fb-9aac658704a0', 'e7b065b1-b119-45e2-922b-add0428e0bbe', '50b8c95c-2bb3-414d-a964-08b05f00a9a7', '5f0314a7-0ad0-4870-bc32-c2ffc06a3795', '6c55f6c7-6717-4df5-be5e-0ca71df2b9b7', 'fe148261-b08d-4ca6-9911-36cd2d1e1902', '6cf0b832-c04c-4bda-80ca-69451210db45'], }))
            else
                setRoleForm((prev) => ({ ...prev, name: value, roles: [], }))
        } else {
            setRoleForm((prev) => ({ ...prev, [name]: value, }))
        }
    }
    function openAddUserModal() {
        setIsAddUserOpen(true)
    }
    function openAddRoleModal() {
        setIsAddRoleOpen(true)
    }
    function closeModal() {
        if (!loading) {
            setPermissionsOpen({ Patient: false, File: false, Scheme: false, Treatment: false, Appointment: false, Payment: false, Form: false, Document: false, User: false, Role: false, Other: false })
            setIsAddUserOpen(false)
            setIsAddRoleOpen(false)
            setSelectedPicture("")
            setSelectedUserPicture("")
            setIsConfirmBoxOpen(false)
            setConfirmBoxValue("")
            setConfirmBoxError("")
            setShowPassword(false)
            setUserForm({
                first_name: "",
                email: "",
                new_password: "",
                role_profile_name: "",
                phone: "",
                enabled: 1,
                profile_photo: {
                    path: "",
                    metadata: {
                        file_name: "",
                        file_size: "",
                        file_type: "",
                    },
                },
            })
            setRoleForm({
                role_profile: "",
                custom_role_description: "",
                role: "",
                roles: [],
            })
        }
    }
    useEffect(() => {
        // console.log(users)
        // permissions.length || listPermissions();
        // listUsers(searchUser, usersMeta?.page, usersMeta?.size, `${currentTab === "Active Users"}`, userRole);
        // listRoles(searchRole, rolesMeta?.page, rolesMeta?.size);
        // listActivity(activityDate, activityMeta?.page, activityMeta?.size);
    }, [])
    return (
        <div className='bg-[#00] text-[#444648] flex flex-col p-7 box-border h-full overflow-auto fade_in'>
            {/* <<<<<<<<<<----------Heading---------->>>>>>>>>> */}
            <div>
                <div className='flex gap-2 items-center relative pb-6 head_with_qstn_mark'>
                    <h2 className='text-xl font-semibold'>User Management</h2>
                    <img src={QuestionMark} alt="" />
                    <p className='absolute w-52 bg-black text-white rounded-md px-2 py-1 text-xs left-60'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut </p>
                </div>
            </div>

            {/* <<<<<<<<<<----------Table Container---------->>>>>>>>>> */}

            <div>
                <div className='flex items-center justify-between'>
                    {/* The Tabs switching buttons are in below div  */}
                    <div className='text-[#5DB370] flex gap-1'>
                        {tabs.map((tab, index) =>
                            <button key={index} className={`${currentTab === tab ? "bg-[#5DB370] text-white" : "hover:bg-[#5db37033]"} rounded-md border-[#5DB370] border-[.5px] border-solid h-10 px-4 font-semibold custom-transition`} name={tab} onClick={(event) => { setcurrentTab(tab); (tab === "Active Users" || tab === "Inactive Users") ? listUsers(searchUser, "", usersMeta?.size, `${tab === "Active Users"}`, userRole) : (tab === "Roles" && listRoles(searchRole, rolesMeta?.page, rolesMeta?.size)) }}>{tab}</button>
                        )}
                    </div>
                    <div className='flex gap-3 items-center'>
                        {/* this block for search input */}
                        {currentTab === "Roles" ?
                            <div className='flex border border-solid bg-white border-[#EBEDF0] max-w-[200px] rounded-[20px] h-10 items-center px-4 gap-2 '>
                                <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                                <input type="search" placeholder='Search Roles' className='outline-none w-full bg-transparent' value={searchRole} onChange={(event) => { listRoles(event.target.value, rolesMeta?.page, rolesMeta?.size); setSearchRole(event.target.value) }} />
                            </div> :
                            currentTab != "Activity" &&
                            < div className='flex border border-solid bg-white border-[#EBEDF0] max-w-[200px] rounded-[20px] h-10 items-center px-4 gap-2 '>
                                <i className='bx bx-search text-[#C5C5C5] text-xl'></i>
                                <input type="search" placeholder='Search Users' className='outline-none w-full bg-transparent' value={searchUser} onChange={(event) => { listUsers(event.target.value, usersMeta?.page, usersMeta?.size, `${currentTab === "Active Users"}`, userRole); setSearchUser(event.target.value) }} />
                            </div>
                        }
                        {/* this block for Add button | add user OR add role */}
                        {currentTab == "Activity" ?
                            <label htmlFor='activityDate' className="border border-solid border-[#DADCE0] bg-white rounded-md px-3 py-1 hover:bg-gray-200" onClick={() => ""}>
                                {activityDate === moment(new Date).format("YYYY-MM-DD") ? "Today" : activityDate}
                                <span className='text-xs'>&#9660;</span>
                                <input id='activityDate' type="date" max={moment(new Date).format("YYYY-MM-DD")} value={activityDate} onChange={(event) => { setActivityDate(event.target.value); listActivity(event.target.value, activityMeta?.page, activityMeta?.size); }} onFocus={(event) => event.target.showPicker()} onClick={(event) => event.target.showPicker()} className='opacity-0 absolute right-0' />
                            </label>
                            :
                            currentTab == "Roles" ?
                                <button onClick={() => { setRoleButton(true); openAddRoleModal() }} className='bg-[#4285F4] rounded-[20px] h-9 px-4 font-semibold text-white hover:bg-[#2070F5]'>Add Role</button>
                                :
                                <button onClick={() => { setUserButton(true); openAddUserModal(); }} className='bg-[#4285F4] rounded-[20px] h-9 px-4 font-semibold text-white hover:bg-[#2070F5]'>Add User</button>
                        }
                    </div>
                </div>

                {currentTab === "Roles" ?

                    /* <<<<<<<<<<----------Role Table---------->>>>>>>>>> */

                    <div className='overflow-auto mt-6  rounded-md drop-shadow'>
                        <table className='w-full table-fixed bg-white'>
                            <thead className="text-[#8B8B8B]">
                                <tr className='h-16 text-[#303030]'>
                                    <th className='pl-9'>Name</th>
                                    <th className='w-1/12 text-center'>Users</th>
                                    <th className='w-1/5'>Description</th>
                                    <th>Created </th>
                                    <th>Last Updated</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className='text-[#444648]'>
                                {roles.map((data, index) => {
                                    return (
                                        <tr key={index} className='box-border h-14'>
                                            <td className='pl-9'>{data.name}</td>
                                            <td className='text-center'>{data._count?.User}</td>
                                            <td>{data.custom_role_description}</td>
                                            <td>{moment(data.creation).format("DD-MMM-YYYY , hh:mm:ss A")}</td>
                                            <td>{moment(data.modified).format("DD-MMM-YYYY , hh:mm:ss A")}</td>
                                            <td>
                                                <div className='flex gap-2'>
                                                    <button className='border border-solid rounded border-[#A0A3A6] text-[#444648] px-3' onClick={() => {
                                                        setRoleButton(false)
                                                        setRoleForm({
                                                            role_profile: data.name,
                                                            custom_role_description: data.custom_role_description,
                                                            role: "",
                                                            roles: [],
                                                        })
                                                        openAddRoleModal();
                                                        setSelectedRole({ id: data.name })
                                                    }}>Edit</button>
                                                    <button className='border border-solid rounded border-[#FF3C5F] text-[#FF3C5F] px-3' onClick={() => { setIsConfirmBoxOpen(true), setSelectedRole({ id: data.name, name: data.name }) }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>

                                    )
                                })}
                            </tbody>
                        </table>
                        {roles.length ?
                            <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-9 p-2'>
                                <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => listRoles(searchRole, rolesMeta?.page, rolesMeta?.size)}></i>
                                <p>Total Roles :&nbsp; {roles.length} / {rolesMeta?.total}</p>
                                <p>Page {rolesMeta?.page + 1} of {Math.floor(((rolesMeta?.total - 1) / rolesMeta?.size) + 1)}</p>
                                <div className={`${rolesMeta?.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { rolesMeta?.page != 0 && listRoles(searchRole, rolesMeta?.page - 1, rolesMeta?.size) }}>
                                    &lt;
                                </div>
                                <div className={`${rolesMeta?.page < Math.floor((rolesMeta?.total - 1) / rolesMeta?.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { rolesMeta?.page < Math.floor((rolesMeta?.total - 1) / rolesMeta?.size) && listRoles(searchRole, rolesMeta?.page + 1, rolesMeta?.size) }}>
                                    &gt;
                                </div>
                                <p>size :
                                    <select name="" id="" value={rolesMeta?.size} onChange={(event) => listRoles(searchRole, "", event.target.value)} className='default-select-icon'>
                                        <option value="5">5 </option>
                                        <option value="10">10 </option>
                                        <option value="15">15 </option>
                                        <option value="20">20 </option>
                                        <option value="50">50 </option>
                                    </select>
                                </p>
                            </div>
                            : <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                                {rolesLoading === "Loading" ?
                                    <table className="w-full table-fixed">
                                        <tbody>
                                            {pulseRows.map((_, index) =>
                                                <tr key={index} className="animate-pulse h-14">
                                                    <td className="pl-9"><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td className='w-1/12'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td className='w-1/5'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                </tr>
                                            )}
                                            <tr className="animate-pulse h-11">
                                                <td className='pl-9'><div className='bg-neutral-200 rounded h-4 w-5'></div></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    : rolesLoading === "Loaded" ? `No Roles Found`
                                        : <div className='flex flex-col justify-center items-center'>
                                            <p>Error while Loading {currentTab}</p>
                                            <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listRoles(searchRole, rolesMeta?.page, rolesMeta?.size)}>Try Again</button>
                                        </div>}
                            </div>
                        }
                    </div>

                    :
                    currentTab === "Activity" ?

                        /* <<<<<<<<<<----------Activity Table---------->>>>>>>>>> */

                        <div className='overflow-auto mt-6  rounded-md drop-shadow'>
                            <table className='w-full table-fixed bg-white'>
                                <thead className="text-[#8B8B8B]">
                                    <tr className='h-16 text-[#303030]'>
                                        <th className='pl-9 w-2/5'>Activity</th>
                                        <th>Time</th>
                                        <th>Location</th>
                                        <th>Updated At</th>
                                    </tr>
                                </thead>
                                <tbody className='text-[#444648]'>
                                    {activity.map((data, index) => {
                                        return (
                                            <tr key={index} className='box-border h-14'>
                                                {/* <td className='pl-9'>{parse(data.subject)}</td> */}
                                                <td>{moment(data.modified).format("hh:mm:ss A")}</td>
                                                {/* <td>{moment(data.modified).format("DD-MMM-YYYY")}</td> */}
                                                <td>{data.ip_address}</td>
                                                <td>{moment(data.modified).format("DD-MMM-YYYY")}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {activity.length ?
                                // (activity.length / 10 === activityPage) &&
                                // <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-9 p-2'>
                                //     {activityLoading === "Loading" ?
                                //         <i className='bx bx-loader-alt animate-spin text-2xl'></i>
                                //         : <button className='bg-gray-300 border rounded h-5 px-2 font-medium hover:bg-gray-200' onClick={() => { listActivity(activityDate, activityPage); }}>Load more...</button>
                                //     }
                                // </div>
                                <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-9 p-2'>
                                    <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => listActivity(activityDate, activityMeta?.page, activityMeta?.size)}></i>
                                    <p>Total activities :&nbsp; {activity.length} / {activityMeta?.total}</p>
                                    <p>Page {activityMeta?.page + 1} of {Math.floor(((activityMeta?.total - 1) / activityMeta?.size) + 1)}</p>
                                    <div className={`${activityMeta?.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { activityMeta?.page != 0 && listActivity(activityDate, activityMeta?.page - 1, activityMeta?.size) }}>
                                        &lt;
                                    </div>
                                    <div className={`${activityMeta?.page < Math.floor((activityMeta?.total - 1) / activityMeta?.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { activityMeta?.page < Math.floor((activityMeta?.total - 1) / activityMeta?.size) && listActivity(activityDate, activityMeta?.page + 1, activityMeta?.size) }}>
                                        &gt;
                                    </div>
                                    <p>size :
                                        <select name="" id="" value={activityMeta?.size} onChange={(event) => listActivity(activityDate, "", event.target.value)} className='default-select-icon'>
                                            <option value="5">5 </option>
                                            <option value="10">10 </option>
                                            <option value="15">15 </option>
                                            <option value="20">20 </option>
                                            <option value="50">50 </option>
                                        </select>
                                    </p>
                                </div>
                                : <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                                    {activityLoading === "Loading" ?
                                        // <i className='bx bx-loader-alt animate-spin text-2xl'></i>
                                        <table className="w-full table-fixed">
                                            <tbody>
                                                {pulseRows.map((_, index) =>
                                                    <tr key={index} className="animate-pulse h-14">
                                                        <td className="pl-9 w-2/5"><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    </tr>
                                                )}
                                                <tr className="animate-pulse h-11">
                                                    <td className='pl-9'><div className='bg-neutral-200 rounded h-4 w-5'></div></td>
                                                    <td></td>
                                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        : activityLoading === "Loaded" ? "No Activities Found"
                                            : <div className='flex flex-col justify-center items-center'>
                                                <p>Error while Loading Activities</p>
                                                <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listActivity(activityDate, activityMeta?.page, activityMeta?.size)}>Try Again</button>
                                            </div>}
                                </div>
                            }
                        </div>
                        :

                        /* <<<<<<<<<<----------User Table---------->>>>>>>>>> */

                        <div className=' mt-6  rounded-md drop-shadow'>
                            <table className='w-full table-fixed bg-white'>
                                <thead className="text-[#8B8B8B]">
                                    <tr className='h-16 text-[#303030]'>
                                        <th className='pl-9 w-1/6'>Name</th>
                                        <th className='w-1/4'>Email ID</th>
                                        <th>Role</th>
                                        <th className='w-[10%]'>Status</th>
                                        <th >Last Login</th>
                                        <th className='pr-2 w-[12%]'>
                                            {/* <select name="" id="" className='border border-solid rounded-md px-2 w-full' value={userRole} onChange={(event) => { listUsers(searchUser, usersMeta?.page, usersMeta?.size, `${currentTab === "Active Users"}`, event.target.value); setUserRole(event.target.value) }}>
                                                <option value="">All</option>
                                                {roles.map((option, index) =>
                                                    <option key={index} value={option.name}>{option.name}</option>
                                                )}
                                            </select> */}
                                            <Fragment >
                                                <AsyncSelect defaultOptions={[{ label: "All", value: "" }, ...roles.map((optionData) => ({ label: optionData.name, value: optionData.name }))]}
                                                    loadOptions={(string, callback) => {
                                                        listRoles(string, "", 15).then((result) => {
                                                            console.log();
                                                            callback([{ label: "All", value: "" }, ...result.map((optionData) => ({ label: optionData.name, value: optionData.name }))])
                                                        }).catch((error) => {
                                                            console.log("Error while loading Roles for add user modal", error);
                                                            callback();
                                                        })
                                                    }}
                                                    onChange={(selected) => { console.log(selected), listUsers(searchUser, usersMeta?.page, usersMeta?.size, `${currentTab === "Active Users"}`, selected.value); setUserRole(selected.value) }}
                                                    className="w-full h-full py-2"
                                                    classNamePrefix="select"
                                                    name=""
                                                    required
                                                    defaultValue={{ value: "", label: userRole || "All" }}
                                                    isDisabled={loading}
                                                />
                                            </Fragment>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='text-[#444648]'>
                                    {users?.map((data, index) => {
                                        return (
                                            <tr key={index} className='box-border h-14'>
                                                <td className='pl-9 max-w-[200px]'>{data.full_name}</td>
                                                <td className='overflow-hidden text-ellipsis'>{data.email}</td>
                                                <td className='overflow-hidden text-ellipsis'>{data.role_profile_name || "-----"}</td>
                                                <td className={data.enabled ? "text-[#5ABA53]" : "text-[#F8254B]"}>{data.enabled ? "active" : "inactive"}</td>
                                                <td>{moment(data.last_login).format("DD-MMM-YYYY , hh:mm:ss A")}</td>
                                                <td className='pr-2'>
                                                    <button className='border border-solid rounded border-[#A0A3A6] text-[#444648] px-3' onClick={() => {
                                                        setUserButton(false);
                                                        setUserForm({
                                                            first_name: data.full_name,
                                                            phone: data.phone || data.mobile_no,
                                                            email: data.email,
                                                            // new_password: "*******",
                                                            role_profile_name: data.role_profile_name,
                                                            // role_id: data.role?.id,
                                                            role: data.role_profile_name,
                                                            enabled: data.enabled,
                                                            profile_photo: data.profile_photo,
                                                        })
                                                        loadFile(data.profile_photo?.path)
                                                        openAddUserModal();
                                                        setSelectedUserId(data.name)
                                                        // console.log(data)
                                                    }}>Edit</button>
                                                </td>
                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>
                            {users?.length ?
                                <div className='box-border h-11 bg-white flex gap-5 justify-end items-center pl-9 p-2'>
                                    <i className='bx bx-rotate-right mr-auto cursor-pointer text-lg' onClick={() => listUsers(searchUser, usersMeta?.page, usersMeta?.size, `${currentTab === "Active Users"}`, userRole)}></i>
                                    <p>Total {currentTab} :&nbsp; {users.length} / {usersMeta?.total}</p>
                                    <p>Page {usersMeta?.page + 1} of {Math.floor(((usersMeta?.total - 1) / usersMeta?.size) + 1)}</p>
                                    <div className={`${usersMeta?.page != 0 ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { usersMeta?.page != 0 && listUsers(searchUser, usersMeta?.page - 1, usersMeta?.size, `${currentTab === "Active Users"}`, userRole) }}>
                                        &lt;
                                    </div>
                                    <div className={`${usersMeta?.page < Math.floor((usersMeta?.total - 1) / usersMeta?.size) ? "hover:bg-gray-300 cursor-pointer" : "text-gray-400 cursor-not-allowed"} flex justify-center items-center rounded-full w-6 h-6 text-base select-none`} onClick={() => { usersMeta?.page < Math.floor((usersMeta?.total - 1) / usersMeta?.size) && listUsers(searchUser, usersMeta?.page + 1, usersMeta?.size, `${currentTab === "Active Users"}`, userRole) }}>
                                        &gt;
                                    </div>
                                    <p>size :
                                        <select name="" id="" defaultValue={usersMeta?.size} onChange={(event) => listUsers(searchUser, "", event.target.value, `${currentTab === "Active Users"}`, userRole)} className='default-select-icon'>
                                            <option value="5">5 </option>
                                            <option value="10">10 </option>
                                            <option value="15">15 </option>
                                            <option value="20">20 </option>
                                            <option value="50">50 </option>
                                        </select>
                                    </p>
                                </div>
                                :
                                <div className='box-border min-h-[60px] bg-white flex justify-center items-center'>
                                    {usersLoading === "Loading" ?
                                        <table className="w-full table-fixed">
                                            <tbody>
                                                {pulseRows.map((_, index) =>
                                                    <tr key={index} className="animate-pulse h-14">
                                                        <td className="pl-9 w-1/6"><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                        <td className='w-1/4'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                        <td className='w-[10%]'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                        <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                        <td className='w-[12%]'><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    </tr>
                                                )}
                                                <tr className="animate-pulse h-11">
                                                    <td className='pl-9'><div className='bg-neutral-200 rounded h-4 w-5'></div></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                    <td><div className='bg-neutral-200 rounded h-4 mr-2'></div></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        : usersLoading === "Loaded" ? `No ${currentTab} Found`
                                            : <div className='flex flex-col justify-center items-center'>
                                                <p>Error while Loading {currentTab}</p>
                                                <button className='bg-[#4285F4] rounded h-5 px-2 font-medium text-white hover:bg-[#2070F5]' onClick={() => listUsers(searchUser, usersMeta?.page, usersMeta?.size, `${currentTab === "Active Users"}`, userRole)}>Try Again</button>
                                            </div>}
                                </div>
                            }
                        </div>
                }
            </div>


            {/* <<<<<<<<<<----------Add OR Update User---------->>>>>>>>>> */}

            <>
                <Transition appear show={isUserOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-[500] " onClose={closeModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto ">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-x-full scale-75"
                                    enterTo="opacity-100 translate-x-0 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-x-0 tanslate-y-0 scale-100 "
                                    leaveTo="opacity-0 translate-x-3/4 -translate-y-20 scale-75"
                                >
                                    <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex gap-6 justify-between">
                                        <div className='flex flex-col w-1/2'>
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                <p className='font-semibold text-base'>
                                                    {userButton ? "Add User" : "Update User"}
                                                </p>

                                            </Dialog.Title>
                                            <div className='flex text-sm w-full'>
                                                <form className='w-full' onSubmit={handleUserSubmit}>
                                                    <div className="flex flex-col flex-wrap box-border items-center w-full mt-4 gap-4">
                                                        {userInputs.map((data, index) => {
                                                            return (
                                                                <div key={index} className={`${!userButton && data.name === "new_password" && "hidden"}`}>
                                                                    <p className='text-[#8A8A8A] leading-6 '>{data.head}</p>
                                                                    <div className="max-w-[380px] min-w-[280px]  font-medium flex items-center relative text-[#373434] gap-[2vw]">
                                                                        {data.types.map((obj, index) => {
                                                                            return (
                                                                                obj.type === "select" ?
                                                                                    data.name === "role_profile_name" ?
                                                                                        <Fragment key={index}>
                                                                                            <AsyncSelect key={index} defaultOptions={[{ label: "Recent Roles", isDisabled: true, }, ...roles.map((optionData) => ({ label: optionData.name, value: optionData.name }))]}
                                                                                                loadOptions={(string, callback) => {
                                                                                                    listRoles(string, "", 15).then((result) => {
                                                                                                        // console.log(result);
                                                                                                        callback(result.map((optionData) => ({ label: optionData.name, value: optionData.id })))
                                                                                                    }).catch((error) => {
                                                                                                        console.log("Error while loading Roles for add user modal", error);
                                                                                                        callback();
                                                                                                    })
                                                                                                }}
                                                                                                onChange={(selected) => setUserForm((prev) => ({ ...prev, [data.name]: selected.value, }))}
                                                                                                className="w-full h-12"
                                                                                                classNamePrefix="select"
                                                                                                name={data.name}
                                                                                                required
                                                                                                defaultValue={{ value: userForm[data.name], label: userForm.role }}
                                                                                                isDisabled={loading}
                                                                                            />
                                                                                        </Fragment>
                                                                                        : <select
                                                                                            name={data.name}
                                                                                            defaultValue={userForm[data.name]}
                                                                                            key={index}
                                                                                            onChange={handleUserChange}
                                                                                            className='flex gap-[1vw] items-center w-full h-12 border border-solid border-[#DFDFDF] bg-transparent rounded-md px-5 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                                                                            required={data.required}
                                                                                            disabled={loading}
                                                                                        >
                                                                                            {data.options.map((optionData, index) => {
                                                                                                return (
                                                                                                    <option key={index} value={optionData === "active" ? 1 : 0} className='rounded-md transition-all w-full px-5 h-full min-w-[26px]'>{optionData}</option>
                                                                                                )
                                                                                            })}
                                                                                        </select> :
                                                                                    <div key={index} className={`flex flex-col gap-[1vw] items-center w-full h-12 border border-solid border-[#DFDFDF] rounded-md relative`}>
                                                                                        <input
                                                                                            type={obj.type === "password" && showPassword && userButton ? "text" : obj.type}
                                                                                            name={data.name}
                                                                                            className={`${obj.type != "radio" && obj.type != "checkbox" ? 'w-full h-full rounded-md px-5 min-w-[18px]' : "h-4 w-4 "} outline-none `}
                                                                                            onFocus={(event) => { obj.type === "date" && event.target.showPicker() }}
                                                                                            onChange={handleUserChange}
                                                                                            value={obj.type === "date" ? !userButton ? moment(userForm[data.name]).format("YYYY-MM-DD") : this : userForm[data.name]}
                                                                                            pattern={data.pattern}
                                                                                            title={data.title}
                                                                                            required={data.required}
                                                                                            disabled={(!userButton && (obj.type === "email" || obj.type === "password")) || loading}
                                                                                        />
                                                                                        {obj.type === "password" && <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                                                                                            {userButton && (showPassword ? <img src={showPasswordIcon} alt="" /> : <img src={hidePasswordIcon} alt="" />)}
                                                                                        </span>}
                                                                                    </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                    {data.name === "password" && <p className='text-xs text-[#8A8A8A] font-normal'>* Choose 8 characters, combining letters, numbers, and symbols.</p>}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <div className='mt-6 flex gap-2.5'>
                                                        <button className={`${loading && "opacity-50 cursor-wait active:scale-100"} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Save"}</button>
                                                        <button type='button' className={`${loading && "opacity-50 cursor-wait active:scale-100"} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`} onClick={closeModal} >Discard</button>
                                                    </div>
                                                </form >
                                            </div>
                                            <button className={`${loading && "opacity-50 cursor-wait active:scale-100"} absolute right-5 top-6`} onClick={closeModal} ><i className='bx bx-x text-2xl leading-7' /></button>
                                        </div>
                                        <div className='mt-16 '>
                                            <label className={`${loading && "opacity-50 cursor-wait active:scale-100"} border-none outline-none flex flex-col gap-2`} htmlFor="profile_photo">
                                                {selectedPicture ?
                                                    < img src={URL.createObjectURL(selectedPicture)} alt="" className='w-[187px] h-[187px] object-cover rounded-lg' crossOrigin='anonymous' />
                                                    :
                                                    selectedUserPicture ?
                                                        selectedUserPicture === "Loading" ?
                                                            < div className='w-[187px] h-[187px] animate-pulse bg-neutral-200 rounded-lg'></div>
                                                            :
                                                            selectedUserPicture === "Error" ?
                                                                <i className='bx bx-refresh w-[187px] h-[187px] text-[50px] leading-[187px] text-center bg-white border rounded-lg'></i>
                                                                :
                                                                selectedUserPicture === "Missing" ?
                                                                    <i className='bx bxs-error-circle w-[187px] h-[187px] text-[50px] leading-[187px] text-center text-[#c70000] bg-white border rounded-lg'></i>
                                                                    :
                                                                    < img src={selectedUserPicture} alt="" className='w-[187px] h-[187px] object-cover rounded-lg drop-shadow' crossOrigin='anonymous' />
                                                        :
                                                        <i className='bx bxs-user w-[187px] h-[187px] text-[150px] leading-[187px] text-center text-[#DDE6F8] bg-[#F2F4F9] border border-[#5A94F5] border-dashed rounded-lg'></i>
                                                }
                                                <span className='flex gap-2 text-[#4285F4] justify-center'><i className='bx bx-image text-lg leading-6' />Upload Picture</span>
                                            </label>
                                            {(selectedPicture || (selectedUserPicture && selectedUserPicture != "Loading")) && <span className={`${loading && "opacity-50 cursor-wait"} mt-2 flex gap-2 text-[#c70000] justify-center cursor-pointer`} onClick={removePicture}><i className='bx bx-trash text-lg leading-6' />Remove Picture</span>}
                                            <input className='w-full hidden' name='profile_photo' accept='image/png ,image/jpeg ,image/jpg, image/webp' id='profile_photo' type="file" onChange={fileChange} disabled={loading} />
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition >
            </>


            {/* <<<<<<<<<<----------Add OR Update Role---------->>>>>>>>>> */}

            <>
                <Transition appear show={isAddRoleOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-[500] " onClose={closeModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto ">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-x-full scale-75"
                                    enterTo="opacity-100 translate-x-0 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-x-0 tanslate-y-0 scale-100 "
                                    leaveTo="opacity-0 translate-x-3/4 -translate-y-20 scale-75"
                                >
                                    <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            <p className='font-semibold text-base' onClick={() => console.log(roleForm.roles)}>
                                                {roleButton ? "Add Role" : "Update Role"}
                                            </p>

                                        </Dialog.Title>
                                        <div className='flex text-sm w-full'>
                                            <form className='w-full' onSubmit={handleRoleSubmit}>
                                                <div className="box-border w-full">
                                                    {roleInputs.map((data, index) => {
                                                        return (
                                                            <div key={index} className='flex flex-col mt-4'>
                                                                <p className='text-[#8A8A8A] leading-6 '>{data.head}</p>
                                                                <div className="min-w-[280px] h-12 font-medium flex items-center relative text-[#373434] gap-[2vw]">
                                                                    {data.types.map((obj, index) => {
                                                                        return (data.name === "role" ?
                                                                            // this select tag ( drop down ) for frequent role setup field 
                                                                            <select
                                                                                key={index}
                                                                                name={data.name}
                                                                                defaultValue=""
                                                                                onChange={handleRoleChange}
                                                                                className='flex gap-[1vw] items-center w-full h-full border border-solid border-[#DFDFDF] bg-transparent rounded-md px-5 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                                                                required={data.required}
                                                                                disabled={loading}
                                                                            >
                                                                                <option value="" disabled hidden className=' transition-all w-full px-5 h-full min-w-[26px]'></option>
                                                                                {data.options.map((optionData, index) => {
                                                                                    return (
                                                                                        <option key={index} value={optionData} className='rounded-md transition-all w-full px-5 h-full min-w-[26px]'>{optionData}</option>
                                                                                    )
                                                                                })}
                                                                            </select>
                                                                            :
                                                                            <div key={index} className='flex gap-[1vw] items-center w-full h-full border border-solid border-[#DFDFDF]  rounded-md'>
                                                                                <input
                                                                                    type={obj.type}
                                                                                    name={data.name}
                                                                                    className={obj.type != "radio" && obj.type != "checkbox" ? 'outline-none w-full h-full rounded-md px-5 min-w-[18px]' : "outline-none h-4 w-4"}
                                                                                    onFocus={(event) => { obj.type === "date" && event.target.showPicker() }}
                                                                                    onChange={handleRoleChange}
                                                                                    value={roleForm[data.name]}
                                                                                    required={data.required}
                                                                                    disabled={loading}
                                                                                />
                                                                                {obj.text && <span className='font-medium'>{obj.text}</span>}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    <div className='mt-3 flex flex-col gap-3'>
                                                        <div>
                                                            <h3 className='font-bold' onClick={() => console.log(roleForm.roles)}>Permissions</h3>
                                                            <p className='text-[#8B8B8B] text-xs '>All actions are listed below. Choose the permissions for the role from the options provided</p>
                                                        </div>
                                                        <div className='flex flex-col gap-3 flex-wrap'>
                                                            {Object.entries(permissionsCatogery).map(([key, value], index) =>
                                                                <div className={`${permissionsOpen[key] ? "border-[#446DFF]" : "hover:border-[#446DFF]"} border rounded-md px-4 custom-transition`} key={index}>
                                                                    <div className={`${permissionsOpen[key] ? "border-b text-[#446DFF]" : "hover:text-[#446DFF]"} flex justify-between items-center w-full h-12  cursor-pointer custom-transition`} onClick={() =>
                                                                        setPermissionsOpen({ ...permissionsOpen, [key]: !permissionsOpen[key] })}>
                                                                        <p className='text-sm font-bold'>{key}</p>
                                                                        <i className={`${permissionsOpen[key] ? "rotate-180" : ""} bx bx-caret-down-circle text-2xl custom-transition`} />
                                                                    </div>
                                                                    <div className={`flex overflow-hidden flex-wrap custom-transition`} style={{ height: permissionsOpen[key] ? Math.floor((value.length + 1) / 2) * 32 + "px" : 0, minHeight: permissionsOpen[key] ? "32px" : 0 }}>
                                                                        {value?.map((permission, index) => {
                                                                            return (
                                                                                <div className='flex items-center w-1/2 gap-2 text-xs py-1 my-1 hover:bg-[#DFDFDF] rounded-md px-4' key={index} title={permission.name}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        onChange={permissionSelect}
                                                                                        // checked={roleForm.roles.find(findId => findId === permission.id) || false}
                                                                                        value={permission.role_name}
                                                                                        name=""
                                                                                        id=""
                                                                                        disabled={loading}
                                                                                    />
                                                                                    <p>{permission.name.split(':').slice(key === "Other" ? 0 : 1).join(':')}</p>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='mt-6 flex gap-2.5'>
                                                    <button className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Save"}</button>
                                                    <button type='button' className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`} onClick={closeModal} >Discard</button>
                                                </div>
                                            </form >
                                        </div>
                                        <button className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} absolute right-5 top-6`} onClick={closeModal} ><i className='bx bx-x text-2xl leading-7' /></button>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </>

            {/* <<<<<<<<<<----------Role deletion Confirm Box---------->>>>>>>>>> */}

            <>
                <Transition appear show={isConfirmBoxOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-[500] " onClose={closeModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto ">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-x-2/4 scale-50"
                                    enterTo="opacity-100 translate-x-0 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-x-0 tanslate-y-0 scale-100 "
                                    leaveTo="opacity-0 translate-x-2/4 translate-y-0 scale-50"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#F9F9F9] p-6 text-left align-middle shadow-xl transition-all flex flex-col justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            <p className='font-semibold text-base'>
                                                Are you sure want to <span className='text-[#D10000]'>Delete </span> the Role?
                                            </p>

                                        </Dialog.Title>
                                        <div className='flex text-sm w-full'>
                                            <form className='w-full' onSubmit={(event) => {
                                                event.preventDefault();
                                                if (selectedRole.name === confirmBoxValue) {
                                                    setConfirmBoxError("")
                                                    removeRole(selectedRole.id)
                                                } else {
                                                    setConfirmBoxError("Entered text is not matching")
                                                }
                                            }}>
                                                <div className="box-border items-center w-full">
                                                    <div className='flex flex-col mt-4 gap-2'>
                                                        <p className='text-[#8A8A8A] leading-6 '>Type <span className='text-black font-semibold'>{selectedRole.name}</span> to Confirm</p>
                                                        {/* <div className="min-w-[280px] h-12 font-medium flex items-center relative text-[#373434] gap-[2vw]"> */}
                                                        <div className='flex items-center w-full h-10 border border-solid border-[#DFDFDF]  rounded-md'>
                                                            <input
                                                                type="text"
                                                                // name={data.name}
                                                                className="outline-none w-full h-full rounded-md px-5"
                                                                // onFocus={(event) => { obj.type === "date" && event.target.showPicker() }}
                                                                onChange={(event) => { setConfirmBoxValue(event.target.value); setConfirmBoxError("") }}
                                                                value={confirmBoxValue}
                                                                required
                                                                disabled={loading}
                                                            />
                                                            {/* {obj.text && <span className='font-medium'>{obj.text}</span>} */}
                                                        </div>
                                                        <p className='text-[#D10000] text-xs'>{confirmBoxError}</p>
                                                        {/* </div> */}
                                                    </div>
                                                </div>
                                                <div className='mt-4 flex gap-2.5'>
                                                    <button className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} bg-[#4285F4] w-28 h-10 text-white rounded font-bold`}>{loading ? <i className='bx bx-loader-alt animate-spin'></i> : "Confirm"}</button>
                                                    <button type='button' className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} bg-[#F3F3F3] w-28 h-10 text-[#373434] rounded font-medium`} onClick={closeModal} >Cancel</button>
                                                </div>
                                            </form >
                                        </div>
                                        <button className={`${loading && "bg-opacity-50 cursor-wait active:scale-100"} absolute right-5 top-6`} onClick={closeModal} ><i className='bx bx-x text-2xl leading-7' /></button>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </>
        </div >
    )
}

export default UserManagement
