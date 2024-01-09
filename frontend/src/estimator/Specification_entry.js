
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
// import './Specification_entry.css';


function DynamicInput({ items, setItems, placeholder, readOnly }) {
    const handleInputChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addField = () => {
        setItems([...items, { name: "", unitQuantity: "", unit: "" }]);
    };

    const removeField = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    return (
        <div className="DynamicInput">
            <h3 className="PlaceholderTitle">{placeholder}</h3>
            {!readOnly && <button onClick={addField}>+</button>}
            <div className="DynamicInputCategory">
                {items.map((item, index) => (
                    <div className="DynamicInputItem" key={index}>
                        {readOnly ? <p>-</p> : <button onClick={() => removeField(index)}>-</button>  }
                       
                        <input
                            value={item.name}
                            placeholder={`${placeholder} Name`}
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                            readOnly={readOnly}
                        />
                        <input
                            value={item.unitQuantity}
                            placeholder={`${placeholder} Unit Quantity`}
                            onChange={(e) => handleInputChange(index, 'unitQuantity', e.target.value)}
                            readOnly={readOnly}
                            />
                        <input
                            value={item.unit}
                            placeholder={`${placeholder} Unit`}
                            onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                            readOnly={readOnly}
                        />
                    </div>
                    
                ))}
            </div>
        </div>
    );
}

function WorkSpecificationForm({ initialSpec: propInitialSpec, mode: propMode, onClose }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [hideButtons, setHideButtons] = useState(false);
    const [mode, setMode] = useState(propMode || 'add');  // Add this line
  
    const defaultSpec = {
        code: '',
        description: '',
        unit: '',
        manpower: [],
        materials: [],
        miscellaneous: [],
        labour_rate: '',
        work_type: '',
    };
    
    const mergedSpec = {
        ...defaultSpec,
        ...propInitialSpec,
        manpower: propInitialSpec.manpower || defaultSpec.manpower,
        materials: propInitialSpec.materials || defaultSpec.materials,
        miscellaneous: propInitialSpec.miscellaneous || defaultSpec.miscellaneous
    };

    const [inputs, setInputs] = useState(mergedSpec);
    
    // Using useRef to track the original code value
    const originalCodeRef = useRef(inputs.code);

    useEffect(() => {
        setReadOnly(propMode === 'view');
        setHideButtons(propMode === 'view');
    }, [propMode]);

    useEffect(() => {
        if (inputs.code !== originalCodeRef.current) {
            setMode('add');  // Use setMode here
        } else {
            setMode('edit');  // And here
        }
    }, [inputs.code, originalCodeRef.current]);  // Add originalCodeRef.current as a dependency
 
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value
        }));
    };

    const addOrUpdateWorkSpec = async (url, method) => {
        setIsLoading(true);
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs)
            });
    
            if (response.status === 200) {
                const responseData = await response.json();
                console.log("Data sent successfully:", responseData);
                
                // Update the original code value after successful data sending
                originalCodeRef.current = inputs.code;
            } else {
                console.error("Error sending data:", response.statusText);
            }
        } catch (error) {
            console.error("There was an error sending the data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submitted data",inputs);

        if (mode === "edit") {
            const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/estimator/work_specification/${inputs.code}`;
            addOrUpdateWorkSpec(apiUrl, 'PUT');
        } else {
            const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/estimator/add_work_specification`;
            addOrUpdateWorkSpec(apiUrl, 'POST');
        }
        if (onClose) onClose();
    };

    return (
        <div className="specification_form">
            <h2>Work Specification Form </h2>
            <div className="specification_names">
                <div className="specification_names_row">
                    <input value={inputs.code} name="code" onChange={handleInputChange} placeholder="Code" />
                    <input value={inputs.unit} name="unit" onChange={handleInputChange} placeholder="Unit" />
                    <input value={inputs.work_type} name="work_type" onChange={handleInputChange} placeholder="Work Type" />
                    <input value={inputs.labour_rate} name="labour_rate" onChange={handleInputChange} placeholder="Labour Rate" />
                </div>
                <textarea value={inputs.description} name="description" onChange={handleInputChange} placeholder="Description" />
            </div>

            <div className="dynamicInputContainer">
                <DynamicInput items={inputs.manpower} setItems={newItems => setInputs({ ...inputs, manpower: newItems })} placeholder="Manpower" readOnly={readOnly} />
                <DynamicInput items={inputs.materials} setItems={newItems => setInputs({ ...inputs, materials: newItems })} placeholder="Materials" readOnly={readOnly} />
                <DynamicInput items={inputs.miscellaneous} setItems={newItems => setInputs({ ...inputs, miscellaneous: newItems })} placeholder="Miscellaneous" readOnly={readOnly} />
            </div>

            {!hideButtons && (
                <div className="submit_zone">
                    <button className="submit_button green" onClick={handleSubmit}>
                        {inputs.code !== originalCodeRef.current ? "ADD SPECIFICATION" : "SAVE CHANGES"}
                    </button>
                    <button className="submit_button blue" onClick={() => navigate('/specification_list')}>
                        SPECIFICATION LIST PAGE
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="loading-modal">
                    <p>Processing...</p>
                </div>
            )}
        </div>
    );
}

export default WorkSpecificationForm;

