import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Walldesign.css';
import WallVisualizer from './Wallsection.js';
// src/components/CantileverWallCalculator.js
import Flexural_Reinforcement_For_Stem from './Wall_Design/Stem_Reinforcement.js';


// import React, { useState } from 'react';
import axios from 'axios';

const CantileverWallCalculator = () => {
  const [wallData, setWallData] = useState({
    //all of these below are initial wallData or default wallData
    name: 'Cantilever Wall Design', 
    toelength_a: 1.0,
    wallthick_b: 1.0,
    heellength_c: 6.0,
    stemheight_H: 9.75,
    footingdepth_Hf: 1.0,
    lengthoffooting_Lf: 1.0,
    concreteunitweight: 0.150,
    keydistancefromrotatingpoint: 0.0,
    keydepth: 1.25,
    keywidth: 0.67,
    soilunitweight: 0.12,
    frictionangle: 30,
    factoredbearingresistanceinstrength: 3,
    factoredbearingresistanceinservice: 2,
    coefficientoffriction_f: 0.45,
    resistancefactorforsliding: 0.8,
    heq: 2
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Check if the input type is number to convert the value, otherwise keep it as is
    const updatedValue = type === 'number' ? parseFloat(value) : value;
    // Update the state with either the converted number or original value
    setWallData(prevState => ({
      ...prevState,
      [name]: updatedValue
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare the payload with the wall data state
    const payload = {
      name: wallData.name,
      toelength_a: parseFloat(wallData.toelength_a),
      wallthick_b: parseFloat(wallData.wallthick_b),
      heellength_c: parseFloat(wallData.heellength_c),
      stemheight_H: parseFloat(wallData.stemheight_H),
      footingdepth_Hf: parseFloat(wallData.footingdepth_Hf),
      lengthoffooting_Lf: parseFloat(wallData.lengthoffooting_Lf),
      concreteunitweight: parseFloat(wallData.concreteunitweight),
      keydistancefromrotatingpoint: parseFloat(wallData.keydistancefromrotatingpoint),
      keydepth: parseFloat(wallData.keydepth),
      keywidth: parseFloat(wallData.keywidth),
      soilunitweight: parseFloat(wallData.soilunitweight),
      frictionangle: parseFloat(wallData.frictionangle),
      factoredbearingresistanceinstrength: parseFloat(wallData.factoredbearingresistanceinstrength),
      factoredbearingresistanceinservice: parseFloat(wallData.factoredbearingresistanceinservice),
      coefficientoffriction_f: parseFloat(wallData.coefficientoffriction_f),
      resistancefactorforsliding: parseFloat(wallData.resistancefactorforsliding),
      heq: parseFloat(wallData.heq)
    };
  
    try {
      // Replace with the actual endpoint and adjust the path as needed
      const response = await axios.post('http://localhost:8000/api/wall-data', payload);
      // Assuming the server responds with the volume in the response data
      //setVolume(response.data.volume);
      alert('Calculated successfully!');
    } catch (error) {
      console.error('Error submitting wall data:', error);
      alert('Failed to calculate. Please try again.');
    }
  };
  

  const createLabel = (fieldName) => {
    switch (fieldName) {
      case 'toelength_a':
        return 'Toe length (a), ft';
      case 'wallthick_b':
        return 'Wall Thickness (b), ft';
      case 'heellength_c':
        return 'Heel Length (e), ft';
      case 'stemheight_H':
        return 'Stem Height (H), ft';  
      case 'footingdepth_Hf':
        return 'Footing Depth (Hf), ft';  
      case 'lengthoffooting_Lf':
        return 'Length of Footing (Lf), ft';  
      case 'concreteunitweight':
        return 'Concrete Unit Weight, kcf';  
      case 'keydistancefromrotatingpoint':
        return 'Key distance from rotating point, ft';  
      case 'keydepth':
        return 'Key Depth, ft';  
      case 'keywidth':
        return 'Key Width, ft';  
      case 'soilunitweight':
        return 'Soil unit weight, kcf';
      case 'frictionangle':
        return 'Friction angle, degrees';
      case 'factoredbearingresistanceinstrength':
        return 'Factored bearing resistance in Strength, ksf';
      case 'factoredbearingresistanceinservice':
        return 'Factored bearing resistance in Service, ksf';
      case 'coefficientoffriction_f':
        return 'Coefficient of friction';
      case 'resistancefactorforsliding':
        return 'Resistance factor for sliding';

      default:
        const splitWords = fieldName.replace('_', ' ').split(' ');
        return splitWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  
 
  return (
    <div className="wall-form-container">
      <WallVisualizer wallData={wallData} />
      <h2>Wall Specifications</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={wallData.name}
            onChange={handleChange}
            min="0" //prevent wallData less than 0
          />
        </div>
        <h3>Dimensions</h3>
        <div className="dimensions-group">
          {['toelength_a', 'wallthick_b', 'heellength_c', 'stemheight_H', 'footingdepth_Hf', 'lengthoffooting_Lf'].map(field => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{createLabel(field)}</label>
              <input
                type="number"
                id={field}
                name={field}
                value={wallData[field]}
                onChange={handleChange}
                min="0" //prevent wallData less than 0
              />
            </div>
          ))}
        </div>
        
        <h3>Key Dimensions</h3>
        <div className="key-dimensions-group">
          {['keydistancefromrotatingpoint', 'keydepth', 'keywidth'].map(field => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{createLabel(field)}</label>
              <input
                type="number"
                id={field}
                name={field}
                value={wallData[field]}
                onChange={handleChange}
                min="0" //prevent wallData less than 0
              />
            </div>
          ))}
        </div>

        <h3>Material Properties & Factors</h3>
        <div className="properties-factors-group">
          {[
            'concreteunitweight', 'soilunitweight', 'frictionangle', 
            'factoredbearingresistanceinstrength', 'factoredbearingresistanceinservice',
            'coefficientoffriction_f', 'resistancefactorforsliding', 'heq'
          ].map(field => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{createLabel(field)}</label>
              <input
                type="number"
                id={field}
                name={field}
                value={wallData[field]}
                onChange={handleChange}
                min="0" //prevent wallData less than 0
              />
            </div>
          ))}
        </div>
        
        <button type="submit">Submit Wall Data</button>
      </form>
      <div>
        <WeightDisplayTable wallData={wallData} />
        <UnfactoredLoadTable wallData={wallData} />
        <LoadCombinationTable1 
          wallData={wallData} 
          loadFactor={{
            RW_f: 1.25, 
            EV_f: 1.35,
            EH_f: 1.5,
            LS_f: 1.75,
            PH_f: 0 // Adjust these values as needed
          }} 
          tableHeading="Strength I - Maximum Loading" 
        />

        <LoadCombinationTable1 
          wallData={wallData} 
          loadFactor={{
            RW_f: 0.9, 
            EV_f: 1,
            EH_f: 1.5,
            PH_f: -0.5,
            LS_f: 1.75             // Adjust these values as needed
          }} 
          tableHeading="Strength I - Minimum Loading - Eccentricity Check" 
        />

        <LoadCombinationTable1 
          wallData={wallData} 
          loadFactor={{
            RW_f: 1, 
            EV_f: 1,
            EH_f: 1,
            PH_f: 0,
            LS_f: 1             // Adjust these values as needed
          }} 
          tableHeading="Service I - Maximum Loading:" 
        />

        <Flexural_Reinforcement_For_Stem 
          wallData={wallData} 
        />

        
      </div>

     



    </div>
  );
};

export default CantileverWallCalculator;



const Calculate_weight_props = (wallData) => {
  const footingWeight = wallData.footingdepth_Hf * (wallData.toelength_a + wallData.heellength_c+wallData.wallthick_b) * wallData.concreteunitweight;
  const stemWeight = wallData.stemheight_H * wallData.wallthick_b * wallData.concreteunitweight;
  const keyWeight = wallData.keydepth * wallData.keywidth * wallData.concreteunitweight
  const totalWeight = footingWeight + stemWeight + keyWeight;
  const footing_z = (wallData.toelength_a + wallData.heellength_c+wallData.wallthick_b)/2
  const stem_z = wallData.toelength_a + wallData.wallthick_b/2
  const key_z = wallData.keydistancefromrotatingpoint + wallData.keywidth/2
  const cg_z = (footing_z*footingWeight   + stem_z*stemWeight + key_z * keyWeight) /totalWeight
  return { footingWeight, stemWeight,keyWeight, totalWeight,footing_z,stem_z,key_z,cg_z };
};  


const Calculate_load_data = (wallData) => {
  const verticalEarthPressure_EV = wallData.soilunitweight* wallData.stemheight_H *wallData.heellength_c
  const verticalEarthPressure_EV_z = wallData.toelength_a + wallData.heellength_c /2 +wallData.wallthick_b
  const ka = 0.3
  const horizontalEarthPressure_EH =  0.5* wallData.soilunitweight * ka *(wallData.footingdepth_Hf + wallData.stemheight_H + wallData.keydepth )*(wallData.footingdepth_Hf + wallData.stemheight_H + wallData.keydepth )
  console.log(horizontalEarthPressure_EH)
  const horizontalEarthPressure_EH_z = (wallData.stemheight_H+ wallData.footingdepth_Hf)/3
  const surcharge_LL = ka *wallData.heq * wallData.soilunitweight*wallData.stemheight_H
  const surcharge_LL_z = wallData.stemheight_H/2
  const passiveEarthPressure_PH = surcharge_LL
  const passiveEarthPressure_PH_z = surcharge_LL_z
  return { verticalEarthPressure_EV,verticalEarthPressure_EV_z, horizontalEarthPressure_EH, horizontalEarthPressure_EH_z, surcharge_LL, surcharge_LL_z,passiveEarthPressure_PH,passiveEarthPressure_PH_z}
};  


// Separated Table Component (Should be in its own file ideally)
const WeightDisplayTable = ({ wallData }) => {
      const { footingWeight, stemWeight,keyWeight, totalWeight,footing_z,stem_z,key_z,cg_z } = Calculate_weight_props(wallData);
      return (
        <div className="rough-table-container">
         <h4 >Wall Weight</h4>
          <table >
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
                <td>{footing_z.toFixed(2)}</td>              
              </tr>
              <tr>
                <td>Stem </td>
                <td>{stemWeight.toFixed(2)}</td>
                <td>kips</td>
                <td>{stem_z}</td>
              </tr>
              <tr>
                <td>Key </td>
                <td>{keyWeight.toFixed(2)}</td>
                <td>kips</td>
                <td>{key_z.toFixed(2)}</td>
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
const UnfactoredLoadTable = ({ wallData }) => {
  
    const { verticalEarthPressure_EV, verticalEarthPressure_EV_z, horizontalEarthPressure_EH, horizontalEarthPressure_EH_z, surcharge_LL, surcharge_LL_z,passiveEarthPressure_PH,passiveEarthPressure_PH_z} = Calculate_load_data(wallData); 
    const { footingWeight, stemWeight, totalWeight, z1, z2, cg_z } = Calculate_weight_props(wallData);
   return (
        <div >
         <h4 >Unfactored Load Table</h4>
          <table id = "unfactoredLoadTable">
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
                <td>{totalWeight.toFixed(2)}</td>
                <td>kips</td>
                <td>{cg_z.toFixed(2)}</td>              
              </tr>
              <tr>
                <td>Vertical Earth Pressure, EV : </td>
                <td>{verticalEarthPressure_EV.toFixed(2)}</td>
                <td>kips</td>
                <td>{verticalEarthPressure_EV_z.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Horizontal Earth pressure, EH :</td>
                <td>{horizontalEarthPressure_EH.toFixed(2)}</td>
                <td>kips</td>
                <td>{horizontalEarthPressure_EH_z.toFixed(2)}</td>
              </tr>
              <tr>
                <td>LL Surcharge, LS :</td>
                <td>{surcharge_LL.toFixed(2)}</td>
                <td>kips</td>
                <td>{surcharge_LL_z.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Passive Earth Pressure, EHp:</td>
                <td>{passiveEarthPressure_PH.toFixed(2)}</td>
                <td>kips</td>
                <td>{passiveEarthPressure_PH_z}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    };

// TABLE FOR   
const LoadCombinationTable1 = ({ wallData, loadFactor, tableHeading }) => {
  
  const { verticalEarthPressure_EV, verticalEarthPressure_EV_z, horizontalEarthPressure_EH, horizontalEarthPressure_EH_z, surcharge_LL, surcharge_LL_z,passiveEarthPressure_PH,passiveEarthPressure_PH_z} = Calculate_load_data(wallData); 
  const { footingWeight, stemWeight, totalWeight, z1, z2, cg_z } = Calculate_weight_props(wallData);
  const totalUnfactoredWeight = totalWeight + verticalEarthPressure_EV + horizontalEarthPressure_EH + surcharge_LL;
  const totalFactoredWeight_V = (totalWeight * loadFactor['RW_f']) + 
                             (verticalEarthPressure_EV * loadFactor['EV_f']) ; 
                            //  + (horizontalEarthPressure_EH * loadFactor['EH_f']) + 
                            //  (surcharge_LL * loadFactor['LS_f']); 
  const totalFactoredWeight_H = (horizontalEarthPressure_EH * loadFactor['EH_f']) + (surcharge_LL * loadFactor['LS_f']) + passiveEarthPressure_PH * loadFactor['PH_f']; 

  const totalFactoredMoment = (totalWeight * loadFactor['RW_f'] * cg_z) + 
                            (verticalEarthPressure_EV * loadFactor['EV_f'] * verticalEarthPressure_EV_z) + 
                            (-1 * horizontalEarthPressure_EH * loadFactor['EH_f'] * horizontalEarthPressure_EH_z) + 
                            (-1 * surcharge_LL * loadFactor['LS_f'] * surcharge_LL_z)+ (-1*passiveEarthPressure_PH* loadFactor['PH_f']);

  const footingBreadth_B = (wallData.wallthick_b  + wallData.heellength_c + wallData.toelength_a )
                            const x = totalFactoredMoment/totalFactoredWeight_V;
  const e_combination = footingBreadth_B/2 -x ;
  const wf_6 = footingBreadth_B /6
  const footingLength_L =1
  const check = Math.abs(e_combination) < wf_6 ? "RESULTANT IS WITHIN MIDDLE THIRD" : "RESULTANT IS OUTSIDE MIDDLE THIRD";

  const sigmav_uniform = totalFactoredWeight_V/((footingBreadth_B - 2*e_combination)*footingLength_L);
  const sigmav_uniform_check = sigmav_uniform > wallData.factoredbearingresistanceinservice ? "NOT GOOD" : "GOOD";
  const sigmav_max = totalFactoredWeight_V/footingBreadth_B*(1+6*e_combination/footingBreadth_B)*1/footingLength_L;
  const sigmav_max_check = sigmav_max > wallData.factoredbearingresistanceinservice ? "NOT GOOD" : "GOOD";
  const sigmav_min = totalFactoredWeight_V/footingBreadth_B*(1-6*e_combination/footingBreadth_B)*1/footingLength_L;
  const sigmav_min_check = sigmav_min > wallData.factoredbearingresistanceinservice ? "NOT GOOD" : "GOOD";

  const factoredResistingForce = totalFactoredWeight_V*wallData.coefficientoffriction_f * wallData.resistancefactorforsliding + passiveEarthPressure_PH
  const fOSAgainstSliding = factoredResistingForce/totalFactoredWeight_H;
  const fOSAgainstSliding_check = fOSAgainstSliding > 1.5 ? " GOOD" : "NOT GOOD";
  const fOSAgainstOverturning = (totalWeight * loadFactor['RW_f'] * cg_z + verticalEarthPressure_EV * loadFactor['EV_f'] * verticalEarthPressure_EV_z)
                                /( horizontalEarthPressure_EH * loadFactor['EH_f'] * horizontalEarthPressure_EH_z + surcharge_LL * loadFactor['LS_f'] * surcharge_LL_z + passiveEarthPressure_PH * loadFactor['PH_f'])
  const fOSAgainstOverturning_check = fOSAgainstOverturning > 2 ? " GOOD" : "NOT GOOD";


  return (
      <div >
       <h4>{tableHeading}</h4> {/* Use the passed-in tableHeading */}
        <table id = "factoredLoadTable">
          <thead>
            <tr>
              <th>Vertical Load</th>
              <th>Weight (kips)</th>
              <th>Factor</th>
              <th>Factored Weight (kips)</th>
              <th>C.G. from pivot (ft)</th>
              <th>Factored Moment (kips-ft)</th>
              
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Retaining wall, RW: </td>
              <td>{totalWeight.toFixed(2)}</td>
              <td>{loadFactor['RW_f']}</td>
              <td>{(totalWeight * loadFactor['RW_f']).toFixed(2)} </td>
              <td>{cg_z.toFixed(2)}</td>
              <td>{(totalWeight * loadFactor['RW_f']*cg_z).toFixed(2)} </td>           
            </tr>
            <tr>
              <td>Vertical Earth Pressure, EV : </td>
              <td>{verticalEarthPressure_EV.toFixed(2)}</td>
              <td>{loadFactor['EV_f']}</td>
              <td>{(verticalEarthPressure_EV * loadFactor['EV_f']).toFixed(2)} </td>
              <td>{verticalEarthPressure_EV_z.toFixed(2)}</td>
              <td>{(verticalEarthPressure_EV * loadFactor['EV_f']*verticalEarthPressure_EV_z).toFixed(2)} </td>
            </tr>
            <tr>
              <td>Horizontal Earth pressure, EH :</td>
              <td>{horizontalEarthPressure_EH.toFixed(2)}</td>
              <td>{loadFactor['EH_f']}</td>
              <td>{(horizontalEarthPressure_EH * loadFactor['EH_f']).toFixed(2)} </td>
              <td>{horizontalEarthPressure_EH_z.toFixed(2)}</td>
              <td>{(-1*horizontalEarthPressure_EH * loadFactor['EH_f']*horizontalEarthPressure_EH_z).toFixed(2)} </td>
            </tr>
            <tr>
              <td>LL Surcharge, LS :</td>
              <td>{surcharge_LL.toFixed(2)}</td>
              <td>{loadFactor['LS_f']}</td>
              <td>{(surcharge_LL * loadFactor['LS_f']).toFixed(2)} </td>
              <td>{surcharge_LL_z.toFixed(2)}</td>
              <td>{(-1*surcharge_LL * loadFactor['LS_f']*surcharge_LL_z).toFixed(2)} </td>
            </tr>
            <tr>
              <td>Passive Earth Pressure, PH :</td>
              <td>{passiveEarthPressure_PH.toFixed(2)}</td>
              <td>{loadFactor['PH_f']}</td>
              <td>{(passiveEarthPressure_PH * loadFactor['PH_f']).toFixed(2)} </td>
              <td>{passiveEarthPressure_PH_z}</td>
              <td>{(-1*passiveEarthPressure_PH * loadFactor['PH_f']*passiveEarthPressure_PH_z).toFixed(2)} </td>
            </tr>
            <tr>
              <td colSpan="5">Total Factored Moment:</td>
              <td>{totalFactoredMoment.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div className = "bearingAndSlidingCheck"> 
          <div > 
            <p> <b>Bearing Capacity Check</b> </p>
            <p> Value, x  = {x.toFixed(2)}</p>
            <p> Value, e  = {e_combination.toFixed(2)}</p>
            <p> Value, wf/6  = {wf_6.toFixed(2)}</p>
            <p> CHECK  = {check}</p>
            
            <p> Value, signmav_uniform = {sigmav_uniform.toFixed(2)} [ {sigmav_uniform_check}]</p>
            <p> Value, signmav_max = {sigmav_max.toFixed(2)} [ {sigmav_max_check} ]</p>
            <p> Value, signmav_min = {sigmav_min.toFixed(2)} [ {sigmav_min_check} ]</p>
          </div>
          <div > 
            <p> <b>Sliding  Check</b> </p>
            <p> Factored Resisting Force  = {factoredResistingForce.toFixed(2)} <i>kips</i> </p>
            <p> Factored Driving Force  =  {totalFactoredWeight_H.toFixed(2)} <i>kips</i> </p>
            <p> FOS against Sliding = {fOSAgainstSliding.toFixed(2)} [{fOSAgainstSliding_check}]</p>
            <p> FOS against Overturning = {fOSAgainstOverturning.toFixed(2)} [{fOSAgainstOverturning_check}]</p>
          </div>
        </div>
      </div>
    );
  };
