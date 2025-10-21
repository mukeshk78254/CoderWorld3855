import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const user = useSelector(state => state.auth.user);
    
   
    const defaultSettings = {
      
        email: user?.emailId || '',
        twoFactor: false,
        twoFactorSecret: '',
        socialAccounts: {
            github: {
                connected: false,
                username: '',
                url: ''
            },
            linkedin: {
                connected: false,
                username: '',
                url: ''
            },
            google: {
                connected: false,
                email: ''
            }
        },
        
        
        fontSize: 14,
        fontFamily: 'JetBrains Mono',
        tabSize: 4,
        wordWrap: true,
        minimap: true,
        lineNumbers: true,
        autoSave: true,
        bracketMatching: true,
        
        
        emailNotifications: true,
        pushNotifications: true,
        soundEnabled: true,
        desktopNotifications: false,
        contestReminders: true,
        problemRecommendations: true,
        
 
        profileVisibility: 'public',
        showEmail: true,
        showStats: true,
        showSolvedProblems: true,
        showContestHistory: true,
        allowDirectMessages: true
    };

    const [settings, setSettings] = useState(defaultSettings);
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); 

 
    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }, []);

 
    useEffect(() => {
        if (user?.emailId) {
            setSettings(prev => ({ ...prev, email: user.emailId }));
        }
    }, [user?.emailId]);

    
    useEffect(() => {
        applyEditorSettings();
    }, [settings.fontSize, settings.fontFamily, settings.tabSize]);

    const applyEditorSettings = () => {
        const root = document.documentElement;
        
       
        root.style.setProperty('--editor-font-size', `${settings.fontSize}px`);
        
      
        root.style.setProperty('--editor-font-family', settings.fontFamily);
        
     
        root.style.setProperty('--editor-tab-size', settings.tabSize);
        
     
        const codeElements = document.querySelectorAll('code, pre, .code-editor');
        codeElements.forEach(el => {
            el.style.fontSize = `${settings.fontSize}px`;
            el.style.fontFamily = settings.fontFamily;
            el.style.tabSize = settings.tabSize;
        });
    };

    const updateSetting = (category, key, value) => {
        console.log('updateSetting called:', { category, key, value });
        setSettings(prev => {
            const newSettings = { ...prev };
            
           
            if (category === 'socialAccounts') {
                newSettings.socialAccounts = {
                    ...prev.socialAccounts,
                    [key]: value
                };
            } else {
           
                newSettings[key] = value;
            }
            
            console.log('Updated settings:', newSettings);
            
            
            localStorage.setItem('userSettings', JSON.stringify(newSettings));
            
            return newSettings;
        });
    };

    const updateSocialAccount = (platform, updates) => {
        setSettings(prev => ({
            ...prev,
            socialAccounts: {
                ...prev.socialAccounts,
                [platform]: {
                    ...prev.socialAccounts[platform],
                    ...updates
                }
            }
        }));
    };

    const saveSettings = async () => {
        setIsLoading(true);
        setSaveStatus('saving');
        
        try {
            
            localStorage.setItem('userSettings', JSON.stringify(settings));
            
          
            
           
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(null), 3000);
            
            console.log('Settings saved successfully:', settings);
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
        applyEditorSettings();
        setSaveStatus('reset');
        setTimeout(() => setSaveStatus(null), 3000);
    };

    const changeEmail = async (newEmail, currentPassword, confirmPassword) => {
        if (currentPassword !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        setIsLoading(true);
        try {
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setSettings(prev => ({ ...prev, email: newEmail }));
            localStorage.setItem('userSettings', JSON.stringify(settings));
            
            return { success: true, message: 'Email updated successfully' };
        } catch (error) {
            throw new Error(error.message || 'Failed to update email');
        } finally {
            setIsLoading(false);
        }
    };

    const enableTwoFactor = async (password, confirmPassword) => {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        setIsLoading(true);
        try {
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const mockSecret = 'JBSWY3DPEHPK3PXP';
            setSettings(prev => ({ 
                ...prev, 
                twoFactor: true,
                twoFactorSecret: mockSecret
            }));
            
            return { 
                success: true, 
                message: 'Two-factor authentication enabled',
                secret: mockSecret,
                qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to enable two-factor authentication');
        } finally {
            setIsLoading(false);
        }
    };

    const disableTwoFactor = async (password) => {
        setIsLoading(true);
        try {
           
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSettings(prev => ({ 
                ...prev, 
                twoFactor: false,
                twoFactorSecret: ''
            }));
            
            return { success: true, message: 'Two-factor authentication disabled' };
        } catch (error) {
            throw new Error(error.message || 'Failed to disable two-factor authentication');
        } finally {
            setIsLoading(false);
        }
    };

    const connectSocialAccount = async (platform, username, password) => {
        setIsLoading(true);
        try {
           
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const url = platform === 'github' 
                ? `https://github.com/${username}`
                : `https://linkedin.com/in/${username}`;
            
            updateSocialAccount(platform, {
                connected: true,
                username,
                url
            });
            
            return { success: true, message: `${platform} account connected successfully` };
        } catch (error) {
            throw new Error(error.message || `Failed to connect ${platform} account`);
        } finally {
            setIsLoading(false);
        }
    };

    const disconnectSocialAccount = async (platform) => {
        setIsLoading(true);
        try {
           
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            updateSocialAccount(platform, {
                connected: false,
                username: '',
                url: ''
            });
            
            return { success: true, message: `${platform} account disconnected` };
        } catch (error) {
            throw new Error(error.message || `Failed to disconnect ${platform} account`);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        settings,
        isLoading,
        saveStatus,
        updateSetting,
        updateSocialAccount,
        saveSettings,
        resetSettings,
        changeEmail,
        enableTwoFactor,
        disableTwoFactor,
        connectSocialAccount,
        disconnectSocialAccount
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
