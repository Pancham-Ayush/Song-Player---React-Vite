import React, { useEffect } from 'react';
import axios from 'axios';
import Constant from '../Component/Constant';
export const UserContext = React.createContext(null);

export const ContextProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [useremail, setUserEmail] = React.useState(null);
    const [playlist, setPlaylist] = React.useState([]);
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    const [isMobile, setisMobile] = React.useState(isMobileDevice);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [uploadPermission, setUploadPermission] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const uploadMessage = !uploadPermission && isMobile
        ? "Uploading from mobile is not permitted. Please get approval to upload."
        : "";

    // 🔑 SESSION RESTORE LOGIC (THIS FIXES REFRESH)
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const res = await axios.get(
                    `${Constant.Login_URL}/google/me`,
                    { withCredentials: true }
                );

                setUser(res.data.username);
                setUserEmail(res.data.email);
                setIsAdmin(res.data.admin);
            } catch (err) {
                setUser(null);
                setUserEmail(null);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    if (loading) return null; 

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            useremail,
            setUserEmail,
            playlist,
            setPlaylist,
            isMobile,
            setisMobile,
            uploadPermission,
            setUploadPermission,
            uploadMessage,
            isAdmin,
            setIsAdmin
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default ContextProvider;
