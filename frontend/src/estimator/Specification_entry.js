
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
// import './Specification_entry.css';


function DynamicInput({ items, setItems, placeholder }) {
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
            <button onClick={addField}>+</button>
            <div className="DynamicInputCategory">
                {items.map((item, index) => (
                    <div className="DynamicInputItem" key={index}>
                        <button onClick={() => removeField(index)}>-</button>
                        <input
                            value={item.name}
                            placeholder={`${placeholder} Name`}
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                        />
                        <input
                            value={item.unitQuantity}
                            placeholder={`${placeholder} Unit Quantity`}
                            onChange={(e) => handleInputChange(index, 'unitQuantity', e.target.value)}
                        />
                        <input
                            value={item.unit}
                            placeholder={`${placeholder} Unit`}
                            onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                        />
                    </div>
                    
                ))}
            </div>
        </div>
    );
}

function WorkSpecificationForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialSpec = location.state ? location.state.selectedSpec : {};
    const [mode, setMode] = useState(location.state ? "edit" : "add");
    const [isLoading, setIsLoading] = useState(false);
    
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
        ...initialSpec,
        manpower: initialSpec.manpower || defaultSpec.manpower,
        materials: initialSpec.materials || defaultSpec.materials,
        miscellaneous: initialSpec.miscellaneous || defaultSpec.miscellaneous
    };
    
    const [inputs, setInputs] = useState(mergedSpec);
    
    // Using useRef to track the original code value
    const originalCodeRef = useRef(inputs.code);
    
    useEffect(() => {
        if (inputs.code !== originalCodeRef.current) {
            setMode('add');
        } else {
            setMode('edit');
        }
    }, [inputs.code]);
    
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
            const apiUrl = `http://localhost:8010/estimator/work_specification/${inputs.code}`;
            addOrUpdateWorkSpec(apiUrl, 'PUT');
        } else {
            const apiUrl = 'http://localhost:8010/estimator/add_work_specification';
            addOrUpdateWorkSpec(apiUrl, 'POST');
        }
    };

    return (
        <div className="specification_form">
            <h1>Work Specification Building</h1>
            <div className="specification_names">
                <div className="specification_names_row">
                    <input value={inputs.code} name="code" onChange={handleInputChange} placeholder="Code" />
                    <input value={inputs.unit} name="unit" onChange={handleInputChange} placeholder="Unit" />
                </div>
                <div className="specification_names_row">
                    <input value={inputs.work_type} name="work_type" onChange={handleInputChange} placeholder="Work Type" />
                    <input value={inputs.labour_rate} name="labour_rate" onChange={handleInputChange} placeholder="Labour Rate" />
                </div>
                <textarea value={inputs.description} name="description" onChange={handleInputChange} placeholder="Description" />
            </div>

            <div className="dynamicInputContainer">
                <DynamicInput items={inputs.manpower} setItems={newItems => setInputs({ ...inputs, manpower: newItems })} placeholder="Manpower" />
                <DynamicInput items={inputs.materials} setItems={newItems => setInputs({ ...inputs, materials: newItems })} placeholder="Materials" />
                <DynamicInput items={inputs.miscellaneous} setItems={newItems => setInputs({ ...inputs, miscellaneous: newItems })} placeholder="Miscellaneous" />
            </div>

            <div className="submit_zone">
                <button 
                    className="submit_button green" 
                    onClick={handleSubmit}>
                    {/* Compare the original code value with the current code input value */}
                    {inputs.code !== originalCodeRef.current ? "ADD SPECIFICATION" : "SAVE CHANGES"}
                </button>
                <button 
                    className="submit_button blue" 
                    onClick={() => navigate('/specification_list')}>
                    SPECIFICATION LIST PAGE
                </button>
            </div>

            {isLoading && (
                <div className="loading-modal">
                    <p>Processing...</p>
                </div>
            )}
        </div>
    );
}

export default WorkSpecificationForm;

