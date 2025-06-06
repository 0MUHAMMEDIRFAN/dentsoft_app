import { useFrappeAuth } from 'frappe-react-sdk'
import { Navigate, Outlet } from 'react-router-dom';

export const AuthRedirect = () => {
    const { currentUser, isLoading } = useFrappeAuth();
    // console.log(currentUser,isLoading)

    if (isLoading) {
        return <></>
    } else if (currentUser && currentUser !== 'Guest') {
        return <Navigate to="/" />
    }
    return <Outlet />
}

export default AuthRedirect
