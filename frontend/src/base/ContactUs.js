// ContactUs.js

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        from_name: '',
        reply_to: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Sending the email
        emailjs.send('service_uxgybfy', 'template_e43hcsc', formData, 'F_AUY_S0l0pINuNst')
            .then((result) => {
                alert('Message Sent, We will get back to you shortly', result.text);
            }, (error) => {
                alert('An error occurred, Please try again', error.text);
            });

        // Resetting the form
        setFormData({
            from_name: '',
            reply_to: '',
            message: ''
        });
    };

    return (
        <div className="contact-container">
            <h2 className="contact-header">We'd love to hear from you!</h2>
            <p className="contact-subheader">Please fill out the form below and we'll get back to you as soon as possible.</p>
            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" for="name">Name:</label>
                    <input type="text" id="name" name="from_name" value={formData.from_name} onChange={handleChange} required className="form-input" placeholder="Enter your name" />
                </div>
                <div className="form-group">
                    <label className="form-label" for="email">Email:</label>
                    <input type="email" id="email" name="reply_to" value={formData.reply_to} onChange={handleChange} required className="form-input" placeholder="Enter your email address" />
                </div>
                <div className="form-group">
                    <label className="form-label" for="message">Message:</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required className="form-textarea" placeholder="Enter your message" rows="5"></textarea>
                </div>
                <div className="form-group">
                    <button type="submit" className="form-button">Send</button>
                </div>
            </form>
        </div>

    );
};

export default ContactUs;