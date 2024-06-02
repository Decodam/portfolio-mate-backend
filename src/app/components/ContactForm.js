import React, { useState } from 'react';
import '../styles/ContactForm.css';
import CloseIcon from '@mui/icons-material/Close';
import {db} from "../context/FirebaseConfig"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"; 


const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [ModalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => {
        if (ModalOpen === true) {
            setModalOpen(false);
        } else {
            setModalOpen(true);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        handleModalOpen();

        await addDoc(collection(db, "user_messages"), {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            timestamp: serverTimestamp()
        });
        
        window.alert(`Thank you for getting in touch ${formData.name}! We will get back to you soon.`);
    };

    return (
        <div id='contact' className="contact_page">
            <div className="contact_page__image"><img src="https://illustrations.popsy.co/white/freelancer.svg" alt="" /></div>
            
            <div className="contact_page__content">
                <div className='contacts_lead__title'>Contact Us!</div>
                <p className="contacts_lead__body">If you have any further questions, need assistance, or would like to provide feedback, please don't hesitate to contact us. We're here to help! Your satisfaction is our priority, and we welcome the opportunity to address any concerns you may have.</p>

                <div onClick={handleModalOpen} className='btn connect_btn'>Lets Connect</div>

                <form onSubmit={handleSubmit} style={{bottom: ModalOpen === true ? 0 : "-120%"}} className="contact_form">
                    <div className="form_content">
                        <div className="content_close">
                            <div className="content_close__lead">Lets Connect!</div>
                            <div onClick={handleModalOpen}><CloseIcon  style={{cursor: "pointer"}} size={28}/></div>
                            
                        </div>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Subject:
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Message:
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </label>
                        <button className='btn' type="submit">Submit</button>
                    </div>              
                </form>
            </div>
        </div>
    );
};

export default ContactForm;