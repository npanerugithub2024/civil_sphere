import React, { useState, useEffect } from 'react';
import Rebar_Calculation_Heel from './Rebar_Calculation_Heel';

const Factored_Loads_Heel = ({wallData, loadFactor}) => {
    const ka = 0.3
    const heel_DC =  wallData.heellength_c* wallData.footingdepth_Hf* wallData.concreteunitweight;
    const heel_DC_z =  wallData.heellength_c/2;
    const heel_EV = wallData.heellength_c* wallData.stemheight_H * wallData.soilunitweight;
    const heel_EV_z =  wallData.heellength_c/2;
    const LS = 0;
    const LS_z =  0;
    const totalFactored_W = heel_DC* loadFactor ['DC_f'] + heel_EV * loadFactor['EV_f']
    const totalFactored_M = heel_DC* loadFactor ['DC_f'] * heel_DC_z + heel_EV * loadFactor['EV_f'] * heel_EV_z
    return {heel_DC, heel_DC_z, heel_EV, heel_EV_z, totalFactored_W, totalFactored_M};
   };

const Heel_Load_Combination_Table = ({wallData, loadFactor,tableHeading}) => {
    const {heel_DC, heel_DC_z, heel_EV, heel_EV_z, totalFactored_W, totalFactored_M} = Factored_Loads_Heel ({wallData, loadFactor})
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
               <td>DC</td>
               <td>{heel_DC.toFixed(2)}</td>
               <td>{loadFactor['DC_f']}</td>
               <td>{(heel_DC * loadFactor['DC_f']).toFixed(2)} </td>
               <td>{heel_DC_z.toFixed(2)}</td>
               <td>{(heel_DC* loadFactor ['DC_f'] * heel_DC_z).toFixed(2)} </td>           
             </tr>
             <tr>
               <td>EV : </td>
               <td>{heel_EV.toFixed(2)}</td>
               <td>{loadFactor['EV_f']}</td>
               <td>{(heel_EV * loadFactor['EV_f']).toFixed(2)} </td>
               <td>{heel_EV_z.toFixed(2)}</td>
               <td>{(heel_EV * loadFactor['EV_f'] * heel_EV_z).toFixed(2)} </td>
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
const Heel_Design = ({ wallData }) => {
    // const {horizontalEarthPressure_EH, horizontalEarthPressure_EH_z, LS, LS_z, totalFactored_W, totalFactored_M} = Factored_Loads_Heel ({wallData, loadFactor})
    const serviceLoad = Factored_Loads_Heel({wallData, loadFactor : {DC_f: 1, EV_f: 1} });
    const strengthLoad = Factored_Loads_Heel({wallData, loadFactor : { DC_f: 1.25, EV_f: 1.35} });

    // Determine which is larger
    const largerTotalFactored_W = serviceLoad.totalFactored_W > strengthLoad.totalFactored_W ? serviceLoad.totalFactored_W : strengthLoad.totalFactored_W;
    const largerTotalFactored_M = serviceLoad.totalFactored_M > strengthLoad.totalFactored_M ? serviceLoad.totalFactored_M : strengthLoad.totalFactored_M;


    return (
        <div >
        <h2>HEEL DESIGN </h2>
        <h3>Top transverse reinforcement - Footing heel</h3>
        <p><i>This acts as a cantilever beam. Face of the wall is the critical region.</i></p>
            <Heel_Load_Combination_Table 
          wallData={wallData} 
          loadFactor={{
            DC_f: 1, 
            EV_f: 1,
           }} 
          tableHeading= "Service I - Limit State (Vertical Loads- Moment at Back Face of wall)" 
        />

        <Heel_Load_Combination_Table 
          wallData={wallData} 
          loadFactor={{
            DC_f: 1.25, 
            EV_f: 1.35,
           }} 
          tableHeading= "Strength I - Limit State (Vertical Loads- Moment at Back Face of wall)" 
        />
        

        <div> 
          <p><b>Loads</b> </p>
          <p> Design MOMENT for full height Heel  = {largerTotalFactored_M.toFixed(2)}  <i>kips-ft</i></p>
          <p> Design SHEAR for full height Heel  = {largerTotalFactored_W.toFixed(2)}  <i>kips</i></p>


          <Rebar_Calculation_Heel
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

export default Heel_Design;


