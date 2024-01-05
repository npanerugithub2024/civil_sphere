import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Estimator.css';
import Mat_Table from './Mat_Table.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoad, faTrowelBricks, faTree, faPlus, faTrowel,faTable, faPersonDigging, faFillDrip, faVectorSquare, faTools, faRulerCombined,faRocket, faIcons } from '@fortawesome/free-solid-svg-icons';

const WorkDetailsPage = () => {
    const params = useParams();
    const [workItemsData, setWorkItemsData] = useState([]);
    const [filteredWorkItems, setFilteredWorkItems] = useState([]);
    const [selectedWorkType, setSelectedWorkType] = useState("Show All");
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const isShowAllSelected = selectedWorkType === 'Show All';
    
    const [workTypesAndCodes, setWorkTypesAndCodes] = useState({});
    const workCodesForSelectedType = workTypesAndCodes[selectedWorkType] || [];

     // const [rows, setRows] = useState(initialRows);
     const [showResults, setShowResults] = useState(false);
     const [calculationResults, setCalculationResults] = useState({
         materials: {},
         manpower: {},
         miscellaneous: {}
     });

    // console.log(params); // Check what params holds
    
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
    const workTypes = [
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
    // { name: 'Add New', icon: 'faPlus', path: '' },
    { name: 'Show All', icon: 'faRocket', path: '/details/all-work' }
    ]          

    const [newWork, setNewWork] = useState({
        work_code: '',
        quantity: '',
        unit: '',
        details: '',
        remarks: '',
        work_type: '',
        project_id : params.projectId    // Initially empty
    });
// FUNCTION TO FETCH ALL WORK ITEMS RELATED TO THE PROJECT
    const fetchWorkItemsData = async (projectId) => {
        try {
            // Construct the URL with the projectId, if provided
            const url = projectId 
                ? `${process.env.REACT_APP_API_BASE_URL}/estimator/projects/${projectId}/work-items/`
                : `${process.env.REACT_APP_API_BASE_URL}/estimator/work-items/`;
            
            const response = await fetch(url); // Fetch data from the API
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            setWorkItemsData(data); // Update the state with the fetched data
            // console.log(data);
        } catch (error) {
            console.error("Error fetching work items:", error);
            // Re-throw the error to let the caller handle it
            throw error;
        }
    };

// New fetch for work types and codes
    const fetchWorkTypesAndCodes = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/get_worktype_and_code`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setWorkTypesAndCodes(data);
            if (data && data[selectedWorkType] && data[selectedWorkType].length > 0) {
                // Set the default work_code as the first item in the list
                setNewWork(current => ({ ...current, work_code: data[selectedWorkType][0]['code'], unit :data[selectedWorkType][0]['unit'] }));
            }
            // console.log(data);
        } catch (error) {
            console.error("Error fetching work types and codes:", error);
        }
            };
  

    useEffect(() => {
        fetchWorkTypesAndCodes();
        setNewWork(current => ({ ...current, work_type: selectedWorkType }));
    }, [selectedWorkType]);

    useEffect(() => {
        fetchWorkItemsData(params.projectId)
            .catch(error => {
                console.error("Error fetching work items:", error);
                // Handle errors, maybe set an error message in state to display to the user
            });
        }, [params.projectId]); // Only re-run the effect if projectId changes
    
    useEffect(() => {
        // Check if the selected work type is "SHOW ALL"
        if (selectedWorkType === "Show All") {
            // If so, remove the filter and set all work items
            setFilteredWorkItems(workItemsData);
        } else {
            // Otherwise, apply the filter based on the selected work type
            const newFilteredWorkItems = workItemsData.filter(item => !selectedWorkType || item.work_type === selectedWorkType);
            setFilteredWorkItems(newFilteredWorkItems);
        }
    }, [selectedWorkType, workItemsData]); // Depend on selectedWorkType and workItemsData
    

   
// ADD OR EDIT FUNCTION FOR WORK ITEMS
    const handleAddWork = async () => {
        // console.log(params.ProjectId)
        const url = isEditing
        ? `${process.env.REACT_APP_API_BASE_URL}/estimator/work-items/${editingId}`
        : `${process.env.REACT_APP_API_BASE_URL}/estimator/work-items`;
   
        const method = isEditing ? 'PUT' : 'POST';
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newWork, work_type: selectedWorkType })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            fetchWorkItemsData(params.projectId)
            .catch(error => {
                console.error("Error fetching work items:", error);
                // Handle errors, maybe set an error message in state to display to the user
            });
            if (isEditing) {
                setIsEditing(false);
                setEditingId(null);
            }
    
        } catch (error) {
            console.error("Error adding or updating work item:", error);
        }
    };
    
    // DELETE FUNCTIONS FOR WORK ITEMS
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/work-items/${id}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            fetchWorkItemsData(params.projectId)
            .catch(error => {
                console.error("Error fetching work items:", error);
                // Handle errors, maybe set an error message in state to display to the user
            });
        } catch (error) {
            console.error("Error deleting work item:", error);
        }
    };

    const handleEdit = (item) => {
        setNewWork({
            work_code: item.work_code,
            quantity: item.quantity,
            unit: item.unit,
            details: item.details,
            remarks: item.remarks,
            work_type: item.work_type,
            project_id:params.projectId
        });
        setEditingId(item.id);
        setIsEditing(true);
    };

   // Prepare code to unit mapping
    const codeToUnitMap = {};
    Object.values(workTypesAndCodes).forEach(workTypeArray => {
        workTypeArray.forEach(({ code, unit }) => {
            codeToUnitMap[code] = unit;
        });
    });


    return(
    <div className="work-details-page">
        <aside className="sidebar">
            {workTypes.map((workType, index) => (
                <div
                    key={index}
                    className={`work-type ${selectedWorkType === workType.name ? "selected" : ""}`}
                    onClick={() => setSelectedWorkType(workType.name)}
                >
                    <FontAwesomeIcon icon={icons[workType.icon]} /> 
                    <span>{workType.name}</span>
                </div>
            ))}
        </aside>

        <main className="main-content">
            {/* <p>Project ID: {params.projectId}</p> */}
            <h2>{selectedWorkType || "Show All"}</h2>
            
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
            <select value={newWork.work_code} onChange={(e) => {
                const selectedCode = e.target.value;
                const correspondingUnit = codeToUnitMap[selectedCode] || 'Default Unit';
                setNewWork(prev => ({ ...prev, work_code: selectedCode, unit: correspondingUnit }));
            }}>
                {workCodesForSelectedType.map(codeObj => (
                    <option key={codeObj.code} value={codeObj.code}>{codeObj.code}</option>
                ))}
            </select>

          </td>
            <td>{selectedWorkType}</td>
            <td><input type="number" placeholder="Quantity" value={newWork.quantity} onChange={(e) => setNewWork({...newWork, quantity: e.target.value})} /></td>
            {/* <td><input type="text" placeholder="Unit" value={newWork.unit} onChange={(e) => setNewWork({...newWork, unit: e.target.value})} /></td> */}
            <td><input type="text" placeholder="Unit" value={newWork.unit} readOnly /></td>

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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/calculate_mat/`, {
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
  
