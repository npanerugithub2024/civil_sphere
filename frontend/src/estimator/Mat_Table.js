import React from 'react';
import './Estimator.css';

function Mat_Table({ data }) {
    let counter = 0;

    const renderRows = (dataObject, type) => {
        return Object.entries(dataObject).map(([name, value]) => (
            <tr key={`${type}-${name}-${value.unitQuantity}`}>
                <td>{++counter}</td>
                <td>{name}</td>
                <td>{value.quantity}</td>
                <td>{value.unitQuantity}</td>
                <td>{type}</td>
                <td>{value.details}</td>
            </tr>
        ));
    };

    return (
        <> 
            <h2>Materials Table</h2>
            <table className="table-container" id='mat-table'>
                <thead>
                    <tr>
                        <th>S.no.</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Units</th>
                        <th>Type</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {renderRows(data.materials, "Material")}
                    {renderRows(data.manpower, "Manpower")}
                    {renderRows(data.miscellaneous, "Miscellaneous")}
                </tbody>
            </table>
        </>
    );
}


export default Mat_Table;
