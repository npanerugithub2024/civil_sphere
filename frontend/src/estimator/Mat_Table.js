import React from 'react';
import './Estimator.css';

function Mat_Table({ data }) {
    let counter = 0; // Initialize a counter

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
                </tr>
            </thead>
            <tbody>
                {Object.entries(data.materials).map(([name, values]) => (
                    values.map(value => (
                        <tr key={`mat-${name}-${value.unitQuantity}`}>
                            <td>{++counter}</td>
                            <td>{name}</td>
                            <td>{value.quantity}</td>
                            <td>{value.unitQuantity}</td>
                            <td>Material</td>
                        </tr>
                    ))
                ))}
                {Object.entries(data.manpower).map(([name, values]) => (
                    values.map(value => (
                        <tr key={`man-${name}-${value.unitQuantity}`}>
                            <td>{++counter}</td>
                            <td>{name}</td>
                            <td>{value.quantity}</td>
                            <td>{value.unitQuantity}</td>
                            <td>Manpower</td>
                        </tr>
                    ))
                ))}
                {Object.entries(data.miscellaneous).map(([name, values]) => (
                    values.map(value => (
                        <tr key={`misc-${name}-${value.unitQuantity}`}>
                            <td>{++counter}</td>
                            <td>{name}</td>
                            <td>{value.quantity}</td>
                            <td>{value.unitQuantity}</td>
                            <td>Miscellaneous</td>
                        </tr>
                    ))
                ))}
            </tbody>
        </table>
        </>
    );
}

export default Mat_Table;
