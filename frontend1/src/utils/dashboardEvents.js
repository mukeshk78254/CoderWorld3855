/**
 * Dashboard Event System
 * Simple event emitter for dashboard updates when users submit code
 */

class DashboardEventEmitter {
    constructor() {
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    emit(event) {
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in dashboard event listener:', error);
            }
        });
    }
}

// Create singleton instance
export const dashboardEvents = new DashboardEventEmitter();

// Helper function to notify dashboard of updates
export const notifyDashboardUpdate = (submissionData) => {
    console.log('📊 Notifying dashboard of submission:', submissionData);
    dashboardEvents.emit({
        type: 'SUBMISSION_SUCCESS',
        data: submissionData,
        timestamp: new Date()
    });
};
