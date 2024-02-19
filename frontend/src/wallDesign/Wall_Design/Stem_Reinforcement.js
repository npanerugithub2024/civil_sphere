import React, { useState, useEffect } from 'react';
import Rebar_Calculation from './Rebar_Calculation';

const Factored_Loads_Stem = ({wallData, loadFactor}) => {
    const ka = 0.3
    const horizontalEarthPressure_EH =  0.5* wallData.soilunitweight * ka * wallData.stemheight_H ^2 
    const horizontalEarthPressure_EH_z =  wallData.stemheight_H/3
    const LS = 1.0* wallData.soilunitweight * ka * wallData.heq * wallData.stemheight_H
    const LS_z =  wallData.stemheight_H/2
    const totalFactored_W = horizontalEarthPressure_EH* loadFactor ['EH_f'] + LS * loadFactor['LS_f']
    const totalFactored_M = horizontalEarthPressure_EH* loadFactor ['EH_f'] * horizontalEarthPressure_EH_z + LS * loadFactor['LS_f'] * LS_z
    return {horizontalEarthPressure_EH, horizontalEarthPressure_EH_z, LS, LS_z, totalFactored_W, totalFactored_M};
   };

const Stem_Load_Combination_Table = ({wallData, loadFactor,tableHeading}) => {
    const {horizontalEarthPressure_EH, horizontalEarthPressure_EH_z, LS, LS_z, totalFactored_W, totalFactored_M} = Factored_Loads_Stem ({wallData, loadFactor})
    return (
        <div >
        <h4>{tableHeading}</h4> {/* Use the passed-in tableHeading */}
         <table id = "factoredLoadTable">
           <thead>
             <tr>
               <th>Horizontal Loads</th>
               <th>Weight (kips)</th>
               <th>Factor</th>
               <th>Factored Weight (kips)</th>
               <th>C.G. from pivot (ft)</th>
               <th>Factored Moment (kips-ft)</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td>EH :</td>
               <td>{horizontalEarthPressure_EH.toFixed(2)}</td>
               <td>{loadFactor['EH_f']}</td>
               <td>{(horizontalEarthPressure_EH * loadFactor['EH_f']).toFixed(2)} </td>
               <td>{horizontalEarthPressure_EH_z.toFixed(2)}</td>
               <td>{(horizontalEarthPressure_EH* loadFactor ['EH_f'] * horizontalEarthPressure_EH_z).toFixed(2)} </td>           
             </tr>
             <tr>
               <td>LS : </td>
               <td>{LS.toFixed(2)}</td>
               <td>{loadFactor['LS_f']}</td>
               <td>{(LS * loadFactor['LS_f']).toFixed(2)} </td>
               <td>{LS_z.toFixed(2)}</td>
               <td>{(LS * loadFactor['LS_f'] * LS_z).toFixed(2)} </td>
             </tr>
             
             <tr>
               <td colSpan="2">Total:</td>
               <td>{totalFactored_W.toFixed(2)}</td>
               <td></td>
               <td></td>
               <td>{totalFactored_M.toFixed(2)}</td>
             </tr>
           </tbody>
         </table>
       </div>
     );
   };


// TABLE FOR   
const Flexural_Reinforcement_For_Stem = ({ wallData }) => {
    // const {horizontalEarthPressure_EH, horizontalEarthPressure_EH_z, LS, LS_z, totalFactored_W, totalFactored_M} = Factored_Loads_Stem ({wallData, loadFactor})
    const serviceLoad = Factored_Loads_Stem({wallData, loadFactor : {EH_f: 1, LS_f: 1} });
    const strengthLoad = Factored_Loads_Stem({wallData, loadFactor : { EH_f: 1.5, LS_f: 1.75} });

    // Determine which is larger
    const largerTotalFactored_W = serviceLoad.totalFactored_W > strengthLoad.totalFactored_W ? serviceLoad.totalFactored_W : strengthLoad.totalFactored_W;
    const largerTotalFactored_M = serviceLoad.totalFactored_M > strengthLoad.totalFactored_M ? serviceLoad.totalFactored_M : strengthLoad.totalFactored_M;


    return (
        <div >
        <h2>STEM REINFORCEMENT DESIGN</h2>
            <Stem_Load_Combination_Table 
          wallData={wallData} 
          loadFactor={{
            EH_f: 1, 
            LS_f: 1,
           }} 
          tableHeading= "Service I - Maximum Loading" 
        />

        <Stem_Load_Combination_Table 
          wallData={wallData} 
          loadFactor={{
            EH_f: 1.5, 
            LS_f: 1.75,
           }} 
          tableHeading= "Strength I - Maximum Loading" 
        />
        

        <div> 
          <p><b>Loads</b> </p>
          <p> Design MOMENT for full height stem  = {largerTotalFactored_M.toFixed(2)}  <i>kips-ft</i></p>
          <p> Design SHEAR for full height stem  = {largerTotalFactored_W.toFixed(2)}  <i>kips</i></p>


          <Rebar_Calculation
            wallData = {wallData}
            thicknessOfWall={wallData.wallthick_b}
            factoredMoment={largerTotalFactored_M}
            factoredShear = {largerTotalFactored_W}
            serviceFactoredMoment =  {serviceLoad.totalFactored_M}
          />
        </div>



 
         
        </div>
      );
    };

export default Flexural_Reinforcement_For_Stem;


