import React, { createContext, useContext, useState } from 'react';
import LogoutModal from '../components/LogoutModal';

const LogoutModalContext = createContext();

export const useLogoutModal = () => {
    const context = useContext(LogoutModalContext);
    if (!context) {
        throw new Error('useLogoutModal must be used within a LogoutModalProvider');
    }
    return context;
};

export const LogoutModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [onConfirm, setOnConfirm] = useState(null);

    const showLogoutModal = (userData, confirmCallback) => {
        setUser(userData);
        setOnConfirm(() => confirmCallback);
        setIsOpen(true);
    };

    const hideLogoutModal = () => {
        setIsOpen(false);
        setUser(null);
        setOnConfirm(null);
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        hideLogoutModal();
    };

    return (
        <LogoutModalContext.Provider value={{
            showLogoutModal,
            hideLogoutModal,
            isOpen,
            user
        }}>
            {children}
            <LogoutModal
                isOpen={isOpen}
                onCancel={hideLogoutModal}
                onConfirm={handleConfirm}
                user={user}
            />
        </LogoutModalContext.Provider>
    );
};




























