import React, { useState, useEffect } from 'react';
import Rebar_Calculation_Heel from './Rebar_Calculation_Heel';


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


const LoadCombinationTable1 = ({ wallData, loadFactor }) => {
  
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
  console.log (verticalEarthPressure_EV, "is e_combination");
  return {e_combination, sigmav_max}
};



const Toe_Load_Case_Calculation = ({wallData,loadFactor}) => {
  console.log ("wall data is",wallData);
  const footingWidth = wallData.toelength_a +wallData.wallthick_b + wallData.heellength_c;
  // const serviceLoad = Factored_Loads_Heel({wallData, loadFactor : {DC_f: 1, EV_f: 1} });
  const { e_combination,sigmav_max} = LoadCombinationTable1({wallData,loadFactor } ); 
  const effectiveFootingWidth = footingWidth - 2*e_combination;
  const bearingPressure = sigmav_max;
  const toeLength = Math.min (wallData.toelength_a, effectiveFootingWidth);
  const shearAtFaceOfWall = toeLength* bearingPressure;
  const momentAtFaceOfWall =  bearingPressure * 0.5* toeLength**2 ;
  console.log ("effective footing width is ", footingWidth);
  return {effectiveFootingWidth ,bearingPressure, toeLength,shearAtFaceOfWall,momentAtFaceOfWall};
};


const Toe_Load_Case_Table = ({wallData, loadFactor,tableHeading}) => {
    
    const {effectiveFootingWidth,bearingPressure, toeLength,shearAtFaceOfWall,momentAtFaceOfWall} = Toe_Load_Case_Calculation ({wallData, loadFactor:{RW_f: 1.25, EV_f: 1.35, EH_f: 1.5, LS_f: 1.75,PH_f: 0}})
    console.log ("effective footing width is ", effectiveFootingWidth);
    return (
        <div >
        <h4>{tableHeading}</h4> {/* Use the passed-in tableHeading */}
         <table className = "unFactoredLoadTable " id = "Toe_Load_Calculation_Table">
           <thead>
             <tr>
               <th>Parameters</th>
               <th>Value</th>
               <th>Unit</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td>Effective Footing Width</td>
               <td>{effectiveFootingWidth.toFixed(2)}</td>
               <td>ft</td>  
             </tr>
             <tr>
               <td>Bearing Pressure</td>
               <td>{bearingPressure.toFixed(2)}</td>
               <td>ksf</td>  
             </tr>
             <tr>
               <td>Toe Length </td>
               <td>{toeLength.toFixed(2)}</td>
               <td>ft</td>  
             </tr>
             <tr>
               <td>Shear at Face of Wall</td>
               <td>{shearAtFaceOfWall.toFixed(2)}</td>
               <td>kips</td>  
             </tr>
             <tr>
               <td>Moment at Face of Wall</td>
               <td>{momentAtFaceOfWall.toFixed(2)}</td>
               <td>kips-ft/ft</td>  
             </tr>
           </tbody>
         </table>
       </div>
     );
   };


// TABLE FOR   
const Toe_Design = ({ wallData }) => {
    const tableHeading1 = "Strength I Maximum Loading";
    const strengthILoad = Toe_Load_Case_Calculation({wallData, loadFactor : {RW_f: 1.25, EV_f: 1.35, EH_f: 1.5, LS_f: 1.75,PH_f: 0}, tableHeading1});
    const tableHeading2 = "Strength I - Minimum Loading - Eccentricity Check";
    const strengthIILoad = Toe_Load_Case_Calculation({wallData, loadFactor : { RW_f: 0.9, EV_f: 1, EH_f: 1.5, PH_f: -0.5,LS_f: 1.75  },tableHeading2 });
    const tableHeading3 = "Service I - Maximum Loading";
    const serviceLoad = Toe_Load_Case_Calculation({wallData, loadFactor : {RW_f: 1, EV_f: 1,EH_f: 1,PH_f: 0,LS_f: 1   }, tableHeading3  });

    const largerTotalFactored_M = Math.max(strengthILoad.momentAtFaceOfWall, strengthIILoad.momentAtFaceOfWall, serviceLoad.momentAtFaceOfWall)
    const largerTotalFactored_W = Math.max(strengthILoad.shearAtFaceOfWall, strengthIILoad.shearAtFaceOfWall, serviceLoad.shearAtFaceOfWall)
    

    return (
        <div >
        <h2>HEEL DESIGN </h2>
        <h3>Top transverse reinforcement - Footing heel</h3>
        <p><i>This acts as a cantilever beam. Face of the wall is the critical region.</i></p>
            <Toe_Load_Case_Table 
          wallData={wallData} 
          loadFactor={{RW_f: 1.25, EV_f: 1.35, EH_f: 1.5, LS_f: 1.75,PH_f: 0}} 
          tableHeading= {tableHeading1}
        />

        <Toe_Load_Case_Table 
          wallData={wallData} 
          loadFactor={{ RW_f: 0.9, EV_f: 1, EH_f: 1.5, PH_f: -0.5,LS_f: 1.75  }} 
          tableHeading= {tableHeading2} 
        />

        <Toe_Load_Case_Table 
          wallData={wallData} 
          loadFactor={{RW_f: 1, EV_f: 1,EH_f: 1,PH_f: 0,LS_f: 1   }} 
          tableHeading= {tableHeading3} 
        />

        

        <div> 
          <p><b>Loads</b> </p>
          <p> Design MOMENT   = {largerTotalFactored_M.toFixed(2)}  <i>kips-ft</i></p>
          <p> Design SHEAR   = {largerTotalFactored_W.toFixed(2)}  <i>kips</i></p>


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

export default Toe_Design;


