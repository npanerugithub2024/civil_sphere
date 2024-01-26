// WeightCalculatorForm.js
import React, { useState } from 'react';
import './rough.css';

const WeightCalculatorForm = () => {
  const [values, setValues] = useState({
    depthOfFooting: 0,
    lengthOfToe: 10,
    lengthOfHeel: 10,
    heightOfStem: 10,
    depthOfStem: 10,
    soilUnitWeight: 20,
    concreteUnitWeight: 25
  });

  const inputUnits = {
    depthOfFooting: 'ft',
    lengthOfToe: 'ft',
    lengthOfHeel: 'ft',
    heightOfStem: 'ft',
    depthOfStem: 'ft',
    soilUnitWeight: 'pcf',
    concreteUnitWeight: 'pcf'
  };

  const handleInputChange = (e) => {
    const { name, valueAsNumber } = e.target;
    setValues({ ...values, [name]: valueAsNumber });
  };

  return (
    <div className='wall-container'>
      <h2>Cantilever Wall Design</h2>
      <div className="wall-form-container">
        <div className="inputs-container">
          {Object.keys(values).map(key => (
            <div className="input-group" key={key}>
              <label htmlFor={key}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} :
              </label> 
              <input
                type="number"
                id={key}
                name={key}
                value={values[key]}
                onChange={handleInputChange}
              />
              <span className="input-unit">{inputUnits[key]}</span>
            </div>
          ))}
          <button onClick={() => {}} className="button-calculate">
            Calculate
          </button>
        </div>
        <div className="image">
            <h2>There goes the image</h2></div>
       
      </div>
      <div>
            <WeightDisplayTable values={values} />
            <UnfactoredLoadTable values={values} />
        </div>
    </div>
  );
};

export default WeightCalculatorForm;

// Separated Table Component (Should be in its own file ideally)
const WeightDisplayTable = ({ values }) => {
    const calculateWeights = () => {
        const footingWeight = values.depthOfFooting * (values.lengthOfToe + values.lengthOfHeel) * values.concreteUnitWeight;
        const stemWeight = values.depthOfStem * values.heightOfStem * values.concreteUnitWeight;
        const totalWeight = footingWeight + stemWeight;
        const z1 = values.depthOfStem/2
        const z2 = ( values.lengthOfHeel +values.lengthOfHeel) * 0.5
        const cg_z = (z1*footingWeight   + z2*stemWeight) /totalWeight
        return { footingWeight, stemWeight, totalWeight,z1,z2,cg_z };
      };   
  
      const { footingWeight, stemWeight, totalWeight,z1,z2,cg_z } = calculateWeights();

      return (
        <div className="rough-table-container">
         <h4 >Wall Weight</h4>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Weight (kips)</th>
                <th>Unit</th>
                <th>z (ft)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Footing </td>
                <td>{footingWeight.toFixed(2)}</td>
                <td>kips</td>
                <td>{z1.toFixed(2)}</td>              
              </tr>
              <tr>
                <td>Stem </td>
                <td>{stemWeight.toFixed(2)}</td>
                <td>kips</td>
                <td>{z2.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Total Weight</td>
                <td>{totalWeight.toFixed(2)}</td>
                <td>kips</td>
              </tr>
            </tbody>
          </table>
        <p>The C.G. lies at {cg_z.toFixed(2)} ft.  ( <b> cg_z = {cg_z.toFixed(2)}</b>)</p>
        </div>
      );
    };

    // Separated Table Component (Should be in its own file ideally)
const UnfactoredLoadTable = ({ values }) => {
    const calculateWeights = () => {
        const footingWeight = values.depthOfFooting * (values.lengthOfToe + values.lengthOfHeel) * values.concreteUnitWeight;
        const stemWeight = values.depthOfStem * values.heightOfStem * values.concreteUnitWeight;
        const totalWeight = footingWeight + stemWeight;
        const z1 = values.depthOfStem/2
        const z2 = ( values.lengthOfHeel +values.lengthOfHeel) * 0.5
        const cg_z = (z1*footingWeight   + z2*stemWeight) /totalWeight
        return { footingWeight, stemWeight, totalWeight,z1,z2,cg_z };
      };   
  
      const { footingWeight, stemWeight, totalWeight,z1,z2,cg_z } = calculateWeights();

      return (
        <div className="unfactoredLoadTable">
         <h4 >Unfactored Load Table</h4>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Weight (kips)</th>
                <th>Unit</th>
                <th>C.G. from pivot (ft)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Retaining wall, RW: </td>
                <td>{footingWeight.toFixed(2)}</td>
                <td>kips</td>
                <td>{cg_z.toFixed(2)}</td>              
              </tr>
              <tr>
                <td>Vertical Earth Pressure, EV : </td>
                <td>{stemWeight.toFixed(2)}</td>
                <td>kips</td>
                <td>{z2.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Horizontal Earth pressure, EH :</td>
                <td>{totalWeight.toFixed(2)}</td>
                <td>kips</td>
                <td>{z2.toFixed(2)}</td>
              </tr>
              <tr>
                <td>LL Surcharge, LS :</td>
                <td>{totalWeight.toFixed(2)}</td>
                <td>kips</td>
                <td>{z2.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    };

