import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Estimator.css';
import Mat_Table from './Mat_Table.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoad, faTrowelBricks, faTree, faPlus, faTrowel,faTable, faPersonDigging, faFillDrip, faVectorSquare, faTools, faRulerCombined,faRocket } from '@fortawesome/free-solid-svg-icons';

const icons = {
    faRoad,
    faTrowelBricks,
    faTrowel,
    faPersonDigging,
    faTree,
    faFillDrip,
    faVectorSquare,
    faTools,
    faRulerCombined,
    faPlus,faTable,faRocket
};


const WorkDetailsPage = () => {
    const params = useParams();
    const [workItemsData, setWorkItemsData] = useState([]);
    const [workTypesAndCodes, setWorkTypesAndCodes] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const [newWork, setNewWork] = useState({
        work_code: '',
        quantity: '',
        unit: '',
        details: '',
        remarks: '',
        work_type: '' // Initially empty
    });
    
    const workItems = [
        { name: 'Site Preparation Work', icon: 'faTree', path: '/details/site-preparation' },
        { name: 'Excavation Work', icon: 'faPersonDigging', path: '/details/excavation' },
        { name: 'Backfilling Work', icon: 'faFillDrip', path: '/details/back-filling' },
        { name: 'Soling Work', icon: 'faVectorSquare', path: '/details/soling' },
        { name: 'Concreting Work', icon: 'faRoad', path: '/details/concreting' },
        { name: 'Formwork', icon: 'faTable', path: '/details/formwork' },
        { name: 'Rebar Work', icon: 'faRulerCombined', path: '/details/rebarwork' },
        { name: 'Brick Masonry Work', icon: 'faTrowelBricks', path: '/details/brick-masonry' },
        { name: 'Plaster Work', icon: 'faTrowel', path: '/details/plastering' },
        { name: 'Floor Finish Work', icon: 'faTools', path: '/details/floor-finish' },
        { name: 'Add New', icon: 'faPlus', path: '' },
        { name: 'Show All', icon: 'faRocket', path: '/details/all-work' }
        
    ];
    

    const selectedWorkTypePath = `/projects/${params.workType}`;
    const selectedWorkItem = workItems.find(item => item.path === selectedWorkTypePath)?.name || 'Unknown Work Type';
    const { projectIdzz } = useParams();
    // Filter work codes based on the selected work type
    const workCodesForSelectedType = workTypesAndCodes[selectedWorkItem] || [];
   
    // Determine if 'Show All' is selected
    const isShowAllSelected = selectedWorkItem === 'Show All';

    // Existing items, unfiltered if 'Show All' is selected
    const filteredWorkItems = isShowAllSelected 
        ? workItemsData 
        : workItemsData.filter(item => item.work_type === selectedWorkItem);


    // const [rows, setRows] = useState(initialRows);
    const [showResults, setShowResults] = useState(false);
    const [calculationResults, setCalculationResults] = useState({
        materials: {},
        manpower: {},
        miscellaneous: {}
    });
    

    const fetchWorkItemsData = async () => {
        try {
            const response = await fetch('${process.env.REACT_APP_API_BASE_URL}/estimator/work-items/'); // Adjust API URL
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // console.log(data);
            setWorkItemsData(data);
            
        } catch (error) {
            console.error("Error fetching work items:", error);
            // Handle errors as needed
        }
    };

    useEffect(() => {
        if (selectedProjectId) {
            fetchWorkItemsData();
        }
    }, [selectedProjectId]); // Re-fetch work items when the selected project changes

    useEffect(() => {

        // New fetch for work types and codes
        const fetchWorkTypesAndCodes = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/work-items/${selectedProjectId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setWorkTypesAndCodes(data);
            if (data && data[selectedWorkItem] && data[selectedWorkItem].length > 0) {
                // Set the default work_code as the first item in the list
                setNewWork(current => ({ ...current, work_code: data[selectedWorkItem][0] }));
            }
            // console.log(data);
        } catch (error) {
            console.error("Error fetching work types and codes:", error);
        }
            };
        fetchWorkTypesAndCodes();

        setNewWork(current => ({ ...current, work_type: selectedWorkItem }));
    }, [selectedWorkItem]);
    
  
    const handleAddWork = async () => {
        console.log(selectedProjectId)
        const url = isEditing
        ? `${process.env.REACT_APP_API_BASE_URL}/estimator/work-items/${editingId}/${selectedProjectId}`
        : `${process.env.REACT_APP_API_BASE_URL}/estimator/work-items/${selectedProjectId}`;
   
        const method = isEditing ? 'PUT' : 'POST';
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newWork, work_type: selectedWorkItem })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // After successful deletion, re-fetch the work items data
            const fetchResponse = await fetch('${process.env.REACT_APP_API_BASE_URL}/estimator/work-items/');
            if (!fetchResponse.ok) {
                throw new Error(`HTTP error! status: ${fetchResponse.status}`);
            }
            const data = await fetchResponse.json();
            setWorkItemsData(data);
            // setNewWork({ work_code: '', quantity: '', unit: '', details: '', remarks: '', work_type: '' });
            if (isEditing) {
                setIsEditing(false);
                setEditingId(null);
            }
    
        } catch (error) {
            console.error("Error adding or updating work item:", error);
        }
    };
    
    
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/work-items/${id}/${selectedProjectId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // After successful deletion, re-fetch the work items data
            const fetchResponse = await fetch('${process.env.REACT_APP_API_BASE_URL}/estimator/work-items/');
            if (!fetchResponse.ok) {
                throw new Error(`HTTP error! status: ${fetchResponse.status}`);
            }
            const data = await fetchResponse.json();
            setWorkItemsData(data);
        } catch (error) {
            console.error("Error deleting work item:", error);
        }
    };

    const [editingId, setEditingId] = useState(null);

    const handleEdit = (item) => {
        setNewWork({
            work_code: item.work_code,
            quantity: item.quantity,
            unit: item.unit,
            details: item.details,
            remarks: item.remarks,
            work_type: item.work_type
        });
        setEditingId(item.id);
        setIsEditing(true);
    };
 
    return (
        <div className="work-details-page">
            <aside className="sidebar">
                {workItems.map(item => (                       
                    <Link
                        key={item.name} 
                        to={item.path}
                        className={selectedWorkItem === item.name ? 'active' : ''}
                    >
                        <FontAwesomeIcon icon={icons[item.icon]} /> 
                        {item.name}
                    </Link>
                ))}
            </aside>
            <main className="main-content">

            <div>
            <h1>Project Details</h1>
            <p>Project ID: {projectIdzz}</p>
            // ... more details
        </div>

    <h2>{selectedWorkItem}</h2>
    <div className="table-container">
        <table>
            <thead>
                <tr>
                    <th>S.N.</th>
                    <th>Work Code</th>
                    <th class="work-type-col">Work Type</th>
                    <th class="quantity-col">Quantity</th>
                    <th class="unit-col">Unit</th>
                    <th>Details</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
            {!isShowAllSelected && (
                <tr>
                    <td></td>
                    <td>
                        <select value={newWork.work_code} onChange={(e) => setNewWork({...newWork, work_code: e.target.value})}>
                            {workCodesForSelectedType.map(code => (
                                <option key={code} value={code}>{code}</option>
                            ))}
                        </select>
                    </td>
                    <td>{selectedWorkItem}</td>
                    
                    <td><input type="number" placeholder="Quantity" value={newWork.quantity} onChange={(e) => setNewWork({...newWork, quantity: e.target.value})} /></td>
                    <td><input type="text" placeholder="Unit" value={newWork.unit} onChange={(e) => setNewWork({...newWork, unit: e.target.value})} /></td>
                    <td><input type="text" placeholder="Details" value={newWork.details} onChange={(e) => setNewWork({...newWork, details: e.target.value})} /></td>
                    <td><input type="text" placeholder="Remarks" value={newWork.remarks} onChange={(e) => setNewWork({...newWork, remarks: e.target.value})} /></td>
                    <button onClick={handleAddWork}>{isEditing ? 'Save' : 'Add New'}</button>
                </tr>
            )}
                {/* Existing items */}
                {filteredWorkItems.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.work_code}</td>
                        <td>{item.work_type}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unit}</td>
                        <td>{item.details}</td>
                        <td>{item.remarks}</td>
                        <td className="table-icon-cell">
                        {!isShowAllSelected && (
                                     
                                    
                            <button onClick={() => handleEdit(item)} className="btn-icon">✏️</button>
                            )}
                            <button onClick={() => handleDelete(item.id)} className="btn-icon">🗑️</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
       
    </div>
    
    <p></p>
    <button onClick={() => calculate_materials(filteredWorkItems, setCalculationResults, setShowResults)}>Calculate Materials</button>     
    {showResults && <Mat_Table data={calculationResults} />}  {/* Conditionally render the ResultsTable */}
    
   
</main>

            
        </div>
    );
};

export default WorkDetailsPage;


export const calculate_materials = async (rows, setCalculationResults, setShowResults) => {
    const inputData = rows.map(row => ({
      code: row.work_code,
      quantity: row.quantity,
      remarks: row.remarks,
    }));
  
    try {
      const response = await fetch('${process.env.REACT_APP_API_BASE_URL}/estimator/calculate_mat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to calculate materials with status: ${response.status}`);
      }
  
      const result = await response.json();
      setCalculationResults(result);
      setShowResults(true);
    } catch (error) {
      console.error('Error calculating materials:', error.message);
      // Consider showing a user-friendly error message or notification here
    }
  };
  