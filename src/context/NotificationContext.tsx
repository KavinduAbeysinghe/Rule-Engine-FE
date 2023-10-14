import React, { createContext } from "react";
import { useContext } from "react";
import {ToastContainer, ToastOptions, toast, Slide} from "react-toastify";

interface INotificationContext {
    (message: string, options?: ToastOptions): void;
    success: (message: string, options?: ToastOptions) => void;
    error: (message: string, options?: ToastOptions) => void;
    warn: (message: string, options?: ToastOptions) => void;
    info: (message: string, options?: ToastOptions) => void;
}
const NotificationContext = createContext<INotificationContext>({} as INotificationContext);

export function useNotification(): INotificationContext {
    return useContext(NotificationContext);
}

export const NotificationContextProvider: React.FC<any> = (props: any) => {
    return (
        <NotificationContext.Provider value={toast}>
            {props.children}
            <ToastContainer
                toastStyle={{
                    fontSize: "0.9em",
                    padding: 12,
                }}
                autoClose={1500}
                closeButton={false}
                newestOnTop={true}
                closeOnClick
                transition={Slide}
                theme={"light"}
            />
        </NotificationContext.Provider>
    );
};
