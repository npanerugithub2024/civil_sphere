import React from 'react';
import './Modal.css';  // Assume you have some basic CSS for the modal

const Modal = ({ children, onClose }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
