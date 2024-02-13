import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Walldesign.css';
import WallVisualizer from './Wallsection.js';
// src/components/CantileverWallCalculator.js

// import React, { useState } from 'react';
import axios from 'axios';

const CantileverWallCalculator = () => {
  const [wallData, setWallData] = useState({
    //all of these below are initial values or default values
    name: 'Cantilever Wall Design', 
    toelength_a: 2,
    wallthick_b: 1,
    heellength_c: 4,
    stemheight_H: 9,
    footingdepth_Hf: 1.5,
    lengthoffooting_Lf: 1,
    concreteunitweight: 0.150,
    keydistancefromrotatingpoint: 0,
    keydepth: 1,
    keywidth: 1,
    soilunitweight: 0.125,
    frictionangle: 30,
    factoredbearingresistanceinstrength: 3,
    factoredbearingresistanceinservice: 2,
    coefficientoffriction_f: 0.45,
    resistancefactorforsliding: 0.8,
    heq: 2
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWallData({ ...wallData, [name]: value });
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
            min="0" //prevent values less than 0
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
                min="0" //prevent values less than 0
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
                min="0" //prevent values less than 0
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
                min="0" //prevent values less than 0
              />
            </div>
          ))}
        </div>
        
        <button type="submit">Submit Wall Data</button>
      </form>
      <p>Wall Load Calcs</p>

     



    </div>
  );
};

export default CantileverWallCalculator;