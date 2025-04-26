import { useFrappeGetCall } from "frappe-react-sdk"

const useCurrentUserData = () => {
    const { data, mutate } = useFrappeGetCall('dentsoft_app.api.users.get_current_user_data', undefined, 'my_profile', {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        revalidateOnReconnect: true,
    })
    return {
        myProfile: data?.message,
        mutate
    }
}


export default useCurrentUserData;