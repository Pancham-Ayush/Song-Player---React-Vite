import React from 'react';

export const UserContext = React.createContext(null);

export const ContextProvider = ({ children }) => {
    const [user, setUser] = React.useState('');
    const [useremail, setUserEmail] = React.useState('');
    const [playlist, setPlaylist] = React.useState([]);
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    const [isMobile, setisMobile] = React.useState(isMobileDevice);
    const [isAdmin,setIsAdmin] = React.useState(false);
    const [uploadPermission, setUploadPermission] = React.useState(false); // default: no permission

    const uploadMessage = !uploadPermission && isMobile
        ? "Uploading from mobile is not permitted. Please get approval to upload."
        : "";

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
