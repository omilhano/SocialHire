// components/common/Toast/Toast.js
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

const TOAST_TYPES = {
    success: {
        icon: CheckCircle,
        className: 'toast-success'
    },
    error: {
        icon: AlertCircle,
        className: 'toast-error'
    },
    info: {
        icon: Info,
        className: 'toast-info'
    }
};

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const { icon: Icon, className } = TOAST_TYPES[type] || TOAST_TYPES.info;

    return (
        <div className={`toast ${className}`}>
            <div className="toast-content">
                <Icon className="toast-icon" />
                <span className="toast-message">{message}</span>
            </div>
            <button className="toast-close" onClick={onClose}>
                <X />
            </button>
        </div>
    );
};

export default Toast;