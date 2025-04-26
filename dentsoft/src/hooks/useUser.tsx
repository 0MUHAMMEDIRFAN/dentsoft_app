import { useFrappeGetDocList, useFrappeCreateDoc } from 'frappe-react-sdk';

export const getUserList = (searchTerm: string | undefined) => {
    const { data, error, isLoading } = useFrappeGetDocList('User', {
        fields: ["full_name", "email", "enabled", "phone", "gender", "user_type", "role_profile_name", "last_login"], // Optional: Specify fields to retrieve
        // filters: [["full_name", "=", searchTerm || ""]], // Optional: Add filters
        limit: 20, // Optional: Limit the number of results
        orderBy: { field: "modified", order: "desc" } // Optional: Sort results
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (

        {
            data
            //     && data.map(doc => (

            //     { doc.name } - { doc.field1 }

            // ))
        }

    );
};


export const createUser = () => {
    const { createDoc, isCompleted, error, loading } = useFrappeCreateDoc();

    const handleCreateUser = async () => {
        const newUser = {
            full_name: "John Doe",
            email: "johndoe@example.com",
            enabled: 1,
            phone: "1234567890",
            gender: "Male",
            user_type: "System User",
            role_profile_name: "Employee",
        };

        try {
            const response = await createDoc('User',newUser);
            console.log("User created successfully:", response);
        } catch (err) {
            console.error("Error creating user:", err);
        }
    };

    if (loading) return <p>Creating user...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (isCompleted) return <p>User created successfully!</p>;

    return (
        <button onClick={handleCreateUser}>
            Create User
        </button>
    );
}
