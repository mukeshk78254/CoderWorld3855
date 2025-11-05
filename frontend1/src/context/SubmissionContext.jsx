import { createContext, useContext, useState, useCallback } from 'react';

const SubmissionContext = createContext();

export const useSubmission = () => {
    const context = useContext(SubmissionContext);
    if (!context) {
        throw new Error('useSubmission must be used within a SubmissionProvider');
    }
    return context;
};

export const SubmissionProvider = ({ children }) => {
    const [submissionTrigger, setSubmissionTrigger] = useState(0);
    const [lastSubmission, setLastSubmission] = useState(null);

    // Call this when a submission is successfully accepted
    const notifySubmissionSuccess = useCallback((submissionData) => {
        console.log('✅ Submission Success Notification:', submissionData);
        setLastSubmission({
            ...submissionData,
            timestamp: Date.now()
        });
        // Increment trigger to notify all listeners
        setSubmissionTrigger(prev => prev + 1);
    }, []);

    // Reset trigger
    const resetSubmissionTrigger = useCallback(() => {
        setSubmissionTrigger(0);
        setLastSubmission(null);
    }, []);

    const value = {
        submissionTrigger,
        lastSubmission,
        notifySubmissionSuccess,
        resetSubmissionTrigger
    };

    return (
        <SubmissionContext.Provider value={value}>
            {children}
        </SubmissionContext.Provider>
    );
};
