import { toast } from "react-toastify";


export const showToastMessage = (options: {
    type: "success" | "error" | "info" | "addToCart" | "subFromCart" | "removeFromCart" | "validation" | "stockLimit";
    title?: string;
    message?: string;
    position?: "bottom" | "top";
    duration?: number;
}) => {
    if (options.type == "success") {
        return toast.success(options.title || 'Success', {
            // position: "bottom-center",
            autoClose: options.duration || 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
        });
    } else if (options.type == "error") {
        return toast.error(options.title || 'Error', {
            // position: "bottom-center",
            autoClose: options.duration || 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
        });
    } else if (options.type == "info") {
        return toast.info(options.title || 'Info', {
            // position: "bottom-center",
            autoClose: options.duration || 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
        });
    } else if (options.type == "validation") {
        return toast.info(options.title, {
            // position: "bottom-center",
            autoClose: 200,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
            // icon: () => <img src={subFromCart} />
        });
    }
};
