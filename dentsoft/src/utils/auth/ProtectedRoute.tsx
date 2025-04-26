// import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
// import { FullPageLoader } from '../../components/layout/Loaders'
import { useFrappeAuth } from 'frappe-react-sdk'

export const ProtectedRoute = () => {

    const { currentUser, isLoading } = useFrappeAuth()
    // console.log(currentUser,isLoading)
    if (isLoading) {
        return <></>
    }
    else if (!currentUser || currentUser === 'Guest') {
        return <Navigate to="/login" />
    }
    return (
        <Outlet />
    )
}