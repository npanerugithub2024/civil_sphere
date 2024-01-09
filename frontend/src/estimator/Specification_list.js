import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';  // Import the Modal component
import WorkSpecificationForm from './Specification_entry'; // Import the form component
import './Specification_entry.css';

// import './Specification_list.css';

function SpecificationList() {
    const [specifications, setSpecifications] = useState([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpecForModal, setSelectedSpecForModal] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/all_work_specifications`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);  // log the fetched data to the console
                setSpecifications(data);
            })
            .catch(error => {
                console.log("An error occurred while fetching the data.", error);
            });
    }, []);  // Empty dependency array means this effect will only run once, when the component mounts

  
    const handleView = (spec) => {
        setSelectedSpecForModal({ spec, mode: 'view' });
        setIsModalOpen(true);
    };

    const handleCopy = (spec) => {
        setSelectedSpecForModal({ spec: { ...spec, code: '' } });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSpecForModal(null);
    };

    const handleDelete = async (code) => {
        if (window.confirm("Are you sure you want to delete this specification?")) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/work_specification/${code}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    console.log('Successfully deleted specification:', code);
                    const updatedSpecifications = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/all_work_specifications`).then(res => res.json());
                    setSpecifications(updatedSpecifications);
                } else {
                    console.error('Failed to delete specification:', code);
                }
            } catch (error) {
                console.error('Error deleting specification:', error);
            }
        }
    };
    
    // const handleView = (spec) => {
    //     navigate('/specification_entry', { state: { selectedSpec: spec, mode: 'view' } });
    // };

    // const handleCopy = (spec) => {
    //     const copiedSpec = { ...spec, code: '' };
    //     navigate('/specification_entry', { state: { selectedSpec: copiedSpec } });
    // };


    return (
        <div className="specification_list">
            <h2>Specifications List</h2> 
            <button  onClick={() => navigate('/specification_entry')}>
                 Add New
            </button>      
            <table id = "specification_list_table">
                <thead>
                    <tr>
                        <th>S.N.    </th>
                        <th>Code</th>
                        <th>Work Type</th>
                        <th>Description</th>
                        <th>Unit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {specifications.map((spec, index) => (
                        <tr key={index}>
                            <td>{index+1}</td>
                            
                            <td>{spec.code}</td>
                            <td>{spec.work_type}</td>
                            <td>{spec.description.substring(0, 100)}...</td>
                            <td>{spec.unit}</td>
                            <td>
                                <button className='icon-btn' onClick={() => handleView(spec)}>👁️ </button>
                                <button className='icon-btn' onClick={() => handleCopy(spec)}>📄 </button>
                                
                                {/* <button className="btn-icon" onClick={() => navigate(`/specification_entry`, { state: { selectedSpec: spec } })}>✏️</button> */}
                                {/* <button className="btn-icon" onClick={() => handleDelete(spec.code)}>🗑️ </button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <WorkSpecificationForm 
                        initialSpec={selectedSpecForModal.spec} 
                        mode={selectedSpecForModal.mode} 
                    />
                </Modal>
            )}
        </div>
    );
}

export default SpecificationList;
