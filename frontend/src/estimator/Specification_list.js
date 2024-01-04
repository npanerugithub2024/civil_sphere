import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Specification_list.css';

function SpecificationList() {
    const [specifications, setSpecifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('${process.env.REACT_APP_API_BASE_URL}/estimator/all_work_specifications')
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

    const handleDelete = async (code) => {
        if (window.confirm("Are you sure you want to delete this specification?")) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/work_specification/${code}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    console.log('Successfully deleted specification:', code);
                    const updatedSpecifications = await fetch('${process.env.REACT_APP_API_BASE_URL}/estimator/all_work_specifications').then(res => res.json());
                    setSpecifications(updatedSpecifications);
                } else {
                    console.error('Failed to delete specification:', code);
                }
            } catch (error) {
                console.error('Error deleting specification:', error);
            }
        }
    };
    

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
                                <button className="btn-icon" onClick={() => navigate(`/specification_entry`, { state: { selectedSpec: spec } })}>✏️</button>
                                <button className="btn-icon" onClick={() => handleDelete(spec.code)}>🗑️ </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
           
        </div>
    );
}

export default SpecificationList;
