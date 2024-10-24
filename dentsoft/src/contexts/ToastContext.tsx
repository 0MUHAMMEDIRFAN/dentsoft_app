import { createContext } from "react"
import { toast } from "react-toastify"

export const ToastContext = createContext({})

export const ToastContextProvider = ({ children }) => {
    const notify = (message: string, type: string) => {
        switch (type) {
            case "success": toast.success(message);
                break;
            case "error": toast.error(message)
                break;
            case "warning": toast.warning(message)
                break;
            case "info": toast.info(message, {
                autoClose: 5000,
                progress: undefined,
                theme: "light",
                // icon: true,
                // icon: () => <img src={addedToCart} />
            })
                break;
            default: toast(message)
                break;
        }
    }

    const value = {
        notify,
    };

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}