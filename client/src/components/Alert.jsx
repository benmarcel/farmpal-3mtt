    import React, { useState, useEffect } from 'react';


    const Alert = ({ message, type, onClose, autoHideDuration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Determine base styles and type-specific colors
    let baseClasses = 'p-4 rounded-lg shadow-md flex items-center justify-between transition-opacity duration-300';
    let iconClasses = 'mr-3 text-xl';
    let closeButtonClasses = 'ml-4 text-lg font-bold cursor-pointer opacity-75 hover:opacity-100';

    switch (type) {
        case 'success':
        baseClasses += ' bg-green-100 text-green-800 border border-green-200';
        iconClasses += ' text-green-500';
        closeButtonClasses += ' text-green-700';
        break;
        case 'error':
        baseClasses += ' bg-red-100 text-red-800 border border-red-200';
        iconClasses += ' text-red-500';
        closeButtonClasses += ' text-red-700';
        break;
        default:
        // Default to a neutral info style if type is not specified or unknown
        baseClasses += ' bg-blue-100 text-blue-800 border border-blue-200';
        iconClasses += ' text-blue-500';
        closeButtonClasses += ' text-blue-700';
        break;
    }

    // Auto-hide logic
    useEffect(() => {
        if (autoHideDuration > 0) {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) {
            onClose(); // Call onClose after fading out
            }
        }, autoHideDuration);

        // Cleanup the timer if the component unmounts or props change
        return () => clearTimeout(timer);
        }
    }, [autoHideDuration, onClose]); // Re-run effect if autoHideDuration or onClose changes

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) {
        onClose();
        }
    };

    if (!isVisible) {
        return null; // Don't render if not visible
    }

    return (
        <div className={baseClasses} role="alert">
        <div className="flex items-center">
            {type === 'success' && <span className={iconClasses}>&#10003;</span> /* Checkmark icon */}
            {type === 'error' && <span className={iconClasses}>&#10060;</span> /* Cross mark icon */}
            {type !== 'success' && type !== 'error' && <span className={iconClasses}>&#x2139;</span> /* Info icon */}
            <p className="text-sm font-medium">{message}</p>
        </div>
        <button
            onClick={handleClose}
            className={closeButtonClasses}
            aria-label="Close alert"
        >
            &times; {/* HTML entity for multiplication sign, commonly used for close */}
        </button>
        </div>
    );
    };

    export default Alert;
