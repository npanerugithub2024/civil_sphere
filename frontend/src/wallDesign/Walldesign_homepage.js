import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Walldesign.css';
import WallVisualizer from './Wallsection.js';
// src/components/CantileverWallCalculator.js

// import React, { useState } from 'react';
import axios from 'axios';

const CantileverWallCalculator = () => {
  const [wallData, setWallData] = useState({
    name: '',
    footlength_a: 0,
    wallthick_b: 0,
    heellength_e: 0,
    stemheight_H: 0,
    footingdepth_Hf: 0,
    lengthoffooting_Lf: 0,
    concreteunitweight: 0,
    keydistancefromrotatingpoint: 0,
    keydepth: 0,
    keywidth: 0,
    soilunitweight: 0,
    frictionangle: 0,
    factoredbearingresistanceinstrength: 0,
    factoredbearingresistanceinservice: 0,
    coefficientoffriction_f: 0,
    resistancefactorforsliding: 0,
    heq: 0
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
      footlength_a: parseFloat(wallData.footlength_a),
      wallthick_b: parseFloat(wallData.wallthick_b),
      heellength_e: parseFloat(wallData.heellength_e),
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
      alert('Volume calculated successfully!');
    } catch (error) {
      console.error('Error submitting wall data:', error);
      alert('Failed to calculate volume. Please try again.');
    }
  };
  

  const createLabel = (fieldName) => {
    const splitWords = fieldName.replace('_', ' ').split(' ');
    return splitWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
          />
        </div>
        <h3>Dimensions</h3>
        <div className="dimensions-group">
          {['footlength_a', 'wallthick_b', 'heellength_e', 'stemheight_H', 'footingdepth_Hf', 'lengthoffooting_Lf'].map(field => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{createLabel(field)}</label>
              <input
                type="number"
                id={field}
                name={field}
                value={wallData[field]}
                onChange={handleChange}
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
              />
            </div>
          ))}
        </div>
        
        <button type="submit">Submit Wall Data</button>
      </form>
    </div>
  );
};

export default CantileverWallCalculator;
