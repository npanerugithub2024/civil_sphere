import React, { useState, useEffect } from 'react';

const Rebar_Calculation_Stem = ({ wallData,thicknessOfWall, factoredMoment, factoredShear,serviceFactoredMoment }) => {

  // State for inputs
  const [rebarDiameterMain, setrebarDiameterMain] = useState(0.75);
  const [concreteCover, setConcreteCover] = useState(2);
  const [rebarYieldStrength, setRebarYieldStrength] = useState(60);
  const [concreteCompressiveStrength, setConcreteCompressiveStrength] = useState(3);
  const [resistanceFactor, setResistanceFactor] = useState(0.9);
  const [equivalentWidth, setEquivalentWidth] = useState(12); 
  const [barSpacingMain, setbarSpacingMain] = useState(12); 
  
  // Calculations for Moment Check
  const d = thicknessOfWall*12 - concreteCover - (rebarDiameterMain / 2);
  const AsMain = Math.PI * (rebarDiameterMain / 2) ** 2 * equivalentWidth/barSpacingMain;
  const Mn = (d - (AsMain*rebarYieldStrength)/(1.7*concreteCompressiveStrength*equivalentWidth))*AsMain*rebarYieldStrength ; // Nominal moment capacity in kip-inches
  const nominalMomentCapacityKft = Mn/12; // Convert kip-inches to kip-feet
  const reducedNominalMomentCapacity = nominalMomentCapacityKft * resistanceFactor;
  const momentCheck = reducedNominalMomentCapacity > factoredMoment ? " GOOD" : "NOT GOOD";
  
 
  // Calculations for Bar TEMPERATURE and Shrinkage
  const [rebarDiameterTemperature, setrebarDiameterTemperature] = useState(0.5);
  const [barSpacingTemperature, setbarSpacingTemperature] = useState(12); 
  const rebarAreaTemperature = Math.PI * (rebarDiameterTemperature / 2) ** 2;
  const AsTemperature = Math.PI * (rebarDiameterTemperature / 2) ** 2 * equivalentWidth/barSpacingTemperature;  

  const As_LRDF_5_10_8_1 = 1.3*equivalentWidth*thicknessOfWall*12/(2*(equivalentWidth+thicknessOfWall*12) * rebarYieldStrength )
  const As_LRDF_5_10_8_1_double = As_LRDF_5_10_8_1*2
  const As_LRDF_5_10_8_1_check = AsTemperature > As_LRDF_5_10_8_1 ? " GOOD" : "NOT GOOD";
 
  const As_ACI_Table_11_6_1_longitudinal_ratio = ( rebarAreaTemperature <= 0.31 && concreteCompressiveStrength >= 60) ? 0.0012 : 0.0015;
  const As_ACI_Table_11_6_1_longitudinal = As_ACI_Table_11_6_1_longitudinal_ratio * equivalentWidth*thicknessOfWall*12
  const As_ACI_Table_11_6_1_longitudinal_check = AsTemperature*2 > As_ACI_Table_11_6_1_longitudinal ? " GOOD" : "NOT GOOD";

  const As_ACI_Table_11_6_1_transverse_ratio = ( rebarAreaTemperature <= 0.31 && concreteCompressiveStrength >= 60) ? 0.002 : 0.0025;
  const As_ACI_Table_11_6_1_transverse = As_ACI_Table_11_6_1_transverse_ratio * equivalentWidth*thicknessOfWall*12
  const As_ACI_Table_11_6_1_transverse_check = AsTemperature*2 > As_ACI_Table_11_6_1_transverse ? " GOOD" : "NOT GOOD";
  const As_transverse_both_sides = AsTemperature + AsMain ;

// Calculations for MINIMUM REINFORCEMENT
    const M_factored1_33 =  1.33*factoredMoment*12;
    const fr_modulus = 0.24 *( concreteCompressiveStrength) **0.5;

  const [gamma1,setGamma1 ] = useState(1.6);
  const [gamma2,setGamma2 ] = useState(0);
  const [gamma3,setGamma3 ] = useState(0.67);
  const [fcpe, setFcpe ]  = useState(0.0);
  const Mndc = 0.0;
  const sectionModulus_Sc_Monolithic = (equivalentWidth * (thicknessOfWall*12)**2)/6;
  const sectionModulus_Sc_Composite = sectionModulus_Sc_Monolithic;
//   const Mcr = ((fr_modulus*gamma1 + gamma2*fcpe)*sectionModulus_Sc_Composite - (Mndc*gamma1 + Mndc*((sectionModulus_Sc_Composite/sectionModulus_Sc_Monolithic)-1)))*gamma3;
  const Mcr = ((gamma1*fr_modulus + gamma2*fcpe)*sectionModulus_Sc_Composite - (Mndc*((sectionModulus_Sc_Composite/sectionModulus_Sc_Monolithic)-1)))*gamma3;
  const minimumReinforcementMoment =   Math.min(Mcr, M_factored1_33);
  const minimumReinforcementMomentCheck = minimumReinforcementMoment/12 > reducedNominalMomentCapacity ? " NOT GOOD" : "GOOD";

//  CALCULATIONS FOR CRAC-CONTROL-MAXIMUM SPACING
    const crack_dc = 2+rebarDiameterMain/2;
    const betaSubS  = 1+ (crack_dc/(0.7*(thicknessOfWall*12-crack_dc)));
    const [gammae,setGammae ] = useState(0.75);
    const solve_K = 1;
    // const solve_Ec = 33000*concreteCompressiveStrength**0.5*wallData.concreteunitweight**1.5*crack_dc;
    const solve_Ec = 33000* solve_K * wallData.concreteunitweight**1.5 * concreteCompressiveStrength**0.5;
    const solve_Es = 29000;
    const solve_n = solve_Es/solve_Ec;
    const solve_a = 1;
    const solve_b = 2* solve_n*AsMain/ equivalentWidth;
    const solve_c = -2*solve_n*AsMain* d/ equivalentWidth;
    const root_1 = (-solve_b+(solve_b**2 - 4*solve_a*solve_c)**0.5)/(2*solve_a);
    const root_2 = (-solve_b-(solve_b**2 - 4*solve_a*solve_c)**0.5)/(2*solve_a);
    const positiveRoots = [root_1, root_2].filter(root => root > 0);
    // Find the lowest positive value, if any; otherwise set to undefined if no positive roots
    const root_final = positiveRoots.length ? Math.min(...positiveRoots) : undefined;
    const fss_Main_Reinforcement = root_final/AsMain;
    const small_fss_fy0_6 = Math.min(rebarYieldStrength*0.6,fss_Main_Reinforcement);
    const crack_max_rebar_spacing = (700*gammae)/(betaSubS*small_fss_fy0_6)-2*crack_dc;
    const crack_max_rebar_spacing_check = crack_max_rebar_spacing < barSpacingMain  ? " NOT GOOD" : "GOOD";

// CHECK SHEAR FOR STEM
    const [shearBeta,setShearBeta ] = useState(2);
    const [shearPhi,setShearPhi ] = useState(0.9);
    const shear_x = root_final;
    const shear_z = d- shear_x/3;
    const shear_dv = Math.max( shear_z, 0.9*d, 0.75*thicknessOfWall);
    const shear_Vc = 0.0316*2*1* concreteCompressiveStrength**0.5 * equivalentWidth * shear_dv;
    const shear_Vc_Factored = shear_Vc * shearPhi;
    const shear_Vc_Factored_check = shear_Vc_Factored < factoredShear  ? " NOT GOOD" : "GOOD";

// SHEAR REINFORCEMENT FOR WALL CHECK
    const [shearPhiWall,setShearPhiWall ] = useState(0.8);
    const [loadFactor, setLoadFactor] = useState(1);
    const [asNeeded, setAsNeeded] = useState(0.36);

    const shear_wall_Av = factoredShear/(shearPhiWall*loadFactor*rebarYieldStrength);
    const As_Difference_Wall = AsMain - asNeeded;
    const shear_Av_check = shear_wall_Av > As_Difference_Wall  ? " NOT GOOD" : "GOOD";

    

  return (
    <div>
        <div className="MomentParameterInput">
            <h3> Moment parameter input</h3>
            <form>
                <div className="form-group">
                    <label htmlFor="rebarDiameterMain">Rebar Diameter (in)</label>
                    <input
                    type="number"
                    id="rebarDiameterMain"
                    name="rebarDiameterMain"
                    value={rebarDiameterMain}
                    onChange={e => setrebarDiameterMain(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="barSpacingMain">Bar Spacing (in)</label>
                    <input
                    type="number"
                    id="barSpacingMain"
                    name="barSpacingMain"
                    value={barSpacingMain} // Make sure you have a corresponding state variable for this
                    onChange={e => setbarSpacingMain(parseFloat(e.target.value))} // And a setter function for the state variable
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="equivalentWidth">Equivalent Width (in)</label>
                    <input
                    type="number"
                    id="equivalentWidth"
                    name="equivalentWidth"
                    value={equivalentWidth} // Make sure you have a corresponding state variable for this
                    onChange={e => setEquivalentWidth(parseFloat(e.target.value))} // And a setter function for the state variable
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="concreteCover">Concrete Cover (in)</label>
                    <input
                    type="number"
                    id="concreteCover"
                    name="concreteCover"
                    value={concreteCover}
                    onChange={e => setConcreteCover(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="rebarYieldStrength">Rebar Yield Strength (ksi)</label>
                    <input
                    type="number"
                    id="rebarYieldStrength"
                    name="rebarYieldStrength"
                    value={rebarYieldStrength}
                    onChange={e => setRebarYieldStrength(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="concreteCompressiveStrength">Concrete Compressive Strength (ksi)</label>
                    <input
                    type="number"
                    id="concreteCompressiveStrength"
                    name="concreteCompressiveStrength"
                    value={concreteCompressiveStrength}
                    onChange={e => setConcreteCompressiveStrength(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="resistanceFactor">Resistance Factor</label>
                    <input
                    type="number"
                    id="resistanceFactor"
                    name="resistanceFactor"
                    step="0.01"
                    value={resistanceFactor}
                    onChange={e => setResistanceFactor(parseFloat(e.target.value))}
                    />
                </div>
                </form>

            <div>
                <p>Effective Depth (d): {d.toFixed(2)} <i>in</i></p>
                <p>Area of Steel (AsMain): {AsMain.toFixed(2)} <i>in²</i></p>
                <p>Nominal Moment Capacity (Mn): {Mn.toFixed(1)} <i>kips-in</i></p>
                <p>Nominal Moment Capacity: {nominalMomentCapacityKft.toFixed(1)} <i>kips-ft</i></p>
                <p>Reduced Nominal Moment Capacity: {reducedNominalMomentCapacity.toFixed(1)} <i>kips-ft</i></p>
                <p>Moment Check. <b>{momentCheck}</b></p>

            </div>
        </div>

        <div className='TemperatureAndShrinkage'> 
            <h3>Stem Temperature and Shrinkage REINFORCEMENT</h3>
            <form>
                <div className="form-group">
                    <label htmlFor="rebarDiameterTemperature">Rebar Diameter (in)</label>
                    <input
                    type="number"
                    id="rebarDiameterTemperature"
                    name="rebarDiameterTemperature"
                    value={rebarDiameterTemperature}
                    onChange={e => setrebarDiameterTemperature(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="barSpacingTemperature">Bar Spacing (in)</label>
                    <input
                    type="number"
                    id="barSpacingTemperature"
                    name="barSpacingTemperature"
                    value={barSpacingTemperature} // Make sure you have a corresponding state variable for this
                    onChange={e => setbarSpacingTemperature(parseFloat(e.target.value))} // And a setter function for the state variable
                    />
                </div>
                           
            </form>

            <div>
                <p>Area of Steel (AsTemperature): {AsTemperature.toFixed(2)} <i>in²</i></p>
                <p>Area of Steel LRDF 5.10.8-1 : {As_LRDF_5_10_8_1.toFixed(3)} <i>in²</i></p>
                <p>Bar Area Check. <b>{As_LRDF_5_10_8_1_check}</b></p>

                <p> <b> ACI Table 11.6.1 for minimum longitudinal for cast-in-place walls</b> </p>
                <p>Area of Steel ratio as per ACI Table 11.6.1  (As_table): {As_ACI_Table_11_6_1_longitudinal_ratio.toFixed(4)} <i>in²</i> {rebarAreaTemperature}</p>
                <p>Area of Steel as per ACI Table 11.6.1  (As_table): {As_ACI_Table_11_6_1_longitudinal.toFixed(2)} <i>in²</i></p>
                <p>Area of Steel on one side (AsTemperature): {AsTemperature.toFixed(2)} <i>in²</i></p>
                <p>Area of Steel on both sides (AsTemperature): {2* AsTemperature.toFixed(2)} <i>in²</i> (horizontal steel)</p>
                <p>Bar Area Check. <b>{As_ACI_Table_11_6_1_longitudinal_check}</b></p>

                <p> <b> ACI Table 11.6.1 for minimum transverse for cast-in-place walls</b> </p>
                <p>Area of Steel ratio as per ACI Table 11.6.1  (As_table): {As_ACI_Table_11_6_1_transverse_ratio.toFixed(4)} <i>in²</i></p>
                <p>Area of Steel as per ACI Table 11.6.1  (As_table): {As_ACI_Table_11_6_1_transverse.toFixed(2)} <i>in²</i></p>
                <p>Area of Steel on one side (AsTemperature): {AsTemperature.toFixed(2)} <i>in²</i></p>
                <p>Area of Steel on both sides (AsTemperature): {As_transverse_both_sides.toFixed(2)} <i>in²</i> (horizontal steel)</p>
                <p>Bar Area Check. <b>{As_ACI_Table_11_6_1_transverse_check}</b></p>

            </div>
        </div>

        <div className = 'MinimumReinforcement'>
            <h3>MINIMUM REINFORCEMENT -- <i>LRFD 5.7.3.3.2 </i></h3>
            <form>
                <div className="form-group">
                    <label htmlFor="gamma1">Gamma1</label>
                    <input
                    type="number"
                    id="gamma1"
                    name="gamma1"
                    value={gamma1}
                    onChange={e => setGamma1(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gamma2">Gamma2</label>
                    <input
                    type="number"
                    id="gamma2"
                    name="gamma2"
                    value={gamma2}
                    onChange={e => setGamma2(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gamma1">Gamma3</label>
                    <input
                    type="number"
                    id="gamma3"
                    name="gamma3"
                    value={gamma3}
                    onChange={e => setGamma3(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fcpe">Fcpe</label>
                    <input
                    type="number"
                    id="fcpe"
                    name="fcpe"
                    value={gamma3}
                    onChange={e => setFcpe(parseFloat(e.target.value))}
                    />
                </div>                          
            </form>
            <div>
                <p>Modulus of Rupture Fr: {fr_modulus.toFixed(2)} <i>ksi</i></p>
                
                <p>Mdnc (total unfactored dead load moment): {Mndc.toFixed(2)} <i>kips-in</i></p>
                <p> Sc (section modulus for the extreme fiber of the composite section where tensile stress is caused by externally applied loads (in^3): {sectionModulus_Sc_Monolithic.toFixed(2)} <i>in3</i></p>
                <p> Snc(section modulus for the extreme fiber of the monolithic or noncomposite section where tensile stress is caused by externally applied loads (in^3): {sectionModulus_Sc_Composite.toFixed(2)} <i>in3</i></p>
                <p>Mcr : {Mcr.toFixed(2)} <i>kips-in</i></p>
                <p>1.33 * Factored Moment : {M_factored1_33.toFixed(2)} <i>kips-in</i></p>
                <p>Smaller of 1.33*factored moment and Mcr : {minimumReinforcementMoment.toFixed(2)} <i>kips-in</i></p>
                <p>Smaller of 1.33*factored moment and Mcr in k-ft : {(minimumReinforcementMoment/12).toFixed(2)} <i>kips-ft</i></p>
                <p>Reduced Nominal Moment Capacity : {factoredMoment.toFixed(2)} <i>kips-ft</i></p>
                <p>Main Reinforcement Check. <b>{minimumReinforcementMomentCheck}</b></p>           
            </div>
        </div>

        <div className = 'CrackControlMaximumSpacing'>
            <h3>CRACK CONTROL-MAXIMUM SPACING -- <i>LRDF 5.7.3.4</i></h3>
            <form>
                <div className="form-group">
                    <label htmlFor="gammae">Gammae</label>
                    <input
                    type="number"
                    id="gammae"
                    name="gammae"
                    value={gammae}
                    onChange={e => setGammae(parseFloat(e.target.value))}
                    />
                </div>
            </form>
            <div>
                <p>Thickness of wall for Cracked Section dc: {crack_dc.toFixed(2)} <i>in3</i></p>
                <p>Beta Sub S: {betaSubS.toFixed(2)} </p>
                <p> Mn (Service Limit State): {(12*serviceFactoredMoment).toFixed(2)} <i>kips-in</i></p>
                <p> K: {solve_K.toFixed(2)} </p>
                <p> Ec: {solve_Ec.toFixed(2)} </p>
                <p> Es: {solve_Es.toFixed(2)} </p>
                <p> n: {solve_n.toFixed(2)} </p>
                <p> a: {solve_a.toFixed(2)} </p>
                <p> b: {solve_b.toFixed(2)} </p>
                <p> c: {solve_c.toFixed(2)} </p>
                <p> root 1: {root_1.toFixed(2)} </p>
                <p> root 2: {root_2.toFixed(2)} </p>
                <p> Smaller Root: {root_final.toFixed(2)} </p>
                <p> Main Reinforcement fss: {fss_Main_Reinforcement.toFixed(2)} <i>ksi</i></p>
                <p> Smaller between fss and 0.6 fy: {small_fss_fy0_6.toFixed(2)} <i>ksi</i></p>
                <p>Maximum Rebar Spacing: {crack_max_rebar_spacing.toFixed(2)} <i>in</i></p>         
                <p>Main Reinforcement Check. <b>{crack_max_rebar_spacing_check}</b></p>           
            </div>
        </div>

        <div className = 'CheckForShear'>
            <h3>CHECK SHEAR ON WALL -- <i>LRDF 5.7.3.3</i></h3>
            <form>
                <div className="form-group">
                    <label htmlFor="shearPhi">Phi for Shear</label>
                    <input
                    type="number"
                    id="shearPhi"
                    name="shearPhi"
                    value={shearPhi}
                    onChange={e => setShearPhi(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shearBeta">Phi for Shear</label>
                    <input
                    type="number"
                    id="shearBeta"
                    name="shearBeta"
                    value={shearBeta}
                    onChange={e => setShearBeta(parseFloat(e.target.value))}
                    />
                </div>
            </form>
            <div>
                <p>Value of x : {shear_x.toFixed(2)} <i>in</i></p>
                <p>Value of z: {shear_z.toFixed(2)} <i>in</i></p>
                <p>Value of dv (Minimum of z,0.9d,0.72h): {shear_dv.toFixed(2)} <i>kips-in</i></p>
                <p>Maximum Shear on Wall {factoredShear.toFixed(2)} </p>
                <p>Shear Capacity of wall Vc: {shear_Vc.toFixed(2)} </p>
                <p>Factored Shear Resistance Vc_factored: {shear_Vc_Factored.toFixed(2)} </p>
                <p>Shear Check. <b>{shear_Vc_Factored_check}</b></p>           
            </div>
        </div>

        <div className = 'ShearReinforcementForWall'>
            <h3>ACI 11.5.4.8 SHEAR REINFORCEMENT FOR WALL</h3>
            <form>
                <div className="form-group">
                    <label htmlFor="shearPhiWall">Phi for Shear</label>
                    <input
                    type="number"
                    id="shearPhiWall"
                    name="shearPhiWall"
                    value={shearPhiWall}
                    onChange={e => setShearPhiWall(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="loadFactor">Load Factor</label>
                    <input
                    type="number"
                    id="loadFactor"
                    name="loadFactor"
                    value={loadFactor}
                    onChange={e => setLoadFactor(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="asNeeded">As required for moment</label>
                    <input
                    type="number"
                    id="asNeeded"
                    name="asNeeded"
                    value={asNeeded}
                    onChange={e => setAsNeeded(parseFloat(e.target.value))}
                    />
                </div>
            </form>
            <div>
                <p>Maximum Shear Force : {factoredShear.toFixed(2)} <i>kips</i></p>
                <p>Value of Av: {shear_wall_Av.toFixed(2)} <i>in2</i></p>
                <p>Value of dv (Minimum of z,0.9d,0.72h): {shear_dv.toFixed(2)} <i>kips-in</i></p>
                <p>As Provided for Moment : {AsMain.toFixed(2)} <i>in2</i></p>
                <p>Difference of As: {As_Difference_Wall.toFixed(2)} <i>in2</i></p>
                <p>Shear Check. <b>{shear_Av_check}</b></p>           
            </div>
        </div>



    </div>
  );
};

export default Rebar_Calculation_Stem;
