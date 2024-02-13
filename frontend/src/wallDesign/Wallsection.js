import React from 'react';
import './Wallsection.css'; // Import the CSS file

const WallVisualizer = ({ wallData, scaleFactor = 25, title = "Fig: Wall Section" }) => {
  const { toelength_a, stemheight_H, wallthick_b, heellength_c, footingdepth_Hf, keywidth, keydepth, keydistancefromrotatingpoint } = wallData;

  const startX = 100;
  const startY = 300;

    // Ensuring all values are non-negative for the path calculation
    const safeValues = {
      toelength_a: Math.max(0, toelength_a),
      stemheight_H: Math.max(0, stemheight_H),
      wallthick_b: Math.max(0, wallthick_b),
      heellength_c: Math.max(0, heellength_c),
      footingdepth_Hf: Math.max(0, footingdepth_Hf),
      keywidth: Math.max(0, keywidth),
      keydepth: Math.max(0, keydepth),
      keydistancefromrotatingpoint: Math.max(0, keydistancefromrotatingpoint)
    };

  const pathD = `
    M ${startX} ${startY}
    h ${safeValues.toelength_a * scaleFactor}
    v -${safeValues.stemheight_H * scaleFactor}
    h ${safeValues.wallthick_b * scaleFactor}
    v ${safeValues.stemheight_H * scaleFactor}
    h ${safeValues.heellength_c * scaleFactor}
    v ${safeValues.footingdepth_Hf * scaleFactor}
    h -${(safeValues.heellength_c + safeValues.wallthick_b + safeValues.toelength_a - safeValues.keywidth - safeValues.keydistancefromrotatingpoint) * scaleFactor}
    v ${safeValues.keydepth * scaleFactor}
    h -${safeValues.keywidth * scaleFactor}
    v -${safeValues.keydepth * scaleFactor}
    h -${safeValues.keydistancefromrotatingpoint * scaleFactor}
    v -${safeValues.footingdepth_Hf * scaleFactor}
  `;

 // Adjust text positions based on scale factor
// Adjust text positions to be close to and above individual lines
const textPositions = {
  toelength_a: { 
    x: startX + (toelength_a * scaleFactor) / 2, 
    y: startY - 10 // Adjusted to be slightly above the line
  },
  stemheight_H: { 
    x: startX + (toelength_a * scaleFactor)-5, 
    y: startY - (stemheight_H * scaleFactor) / 2, // Adjusted to be above the line
    rotate: 270 // Rotating by -90 degrees
  },
  wallthick_b: { 
    x: startX + (toelength_a * scaleFactor) + (wallthick_b * scaleFactor) / 2, 
    y: startY - stemheight_H * scaleFactor - 10, // Moved further above the line
  },
  heellength_c: { 
    x: startX + (toelength_a * scaleFactor) + (wallthick_b * scaleFactor) + (heellength_c * scaleFactor) / 2, 
    y: startY - 10 // Adjusted to be slightly above the line
  },
  footingdepth_Hf: { 
    x: startX + (toelength_a * scaleFactor) + (wallthick_b * scaleFactor) + (heellength_c * scaleFactor) + 20, 
    y: startY + (footingdepth_Hf * scaleFactor) / 2, // Adjusted to be above the line
    rotate: 270 // Rotating by -90 degrees
  },

  keywidth: { 
    x: startX + keydistancefromrotatingpoint * scaleFactor + (keywidth) * scaleFactor / 2, 
    y: startY + (footingdepth_Hf+ keydepth*1) * scaleFactor + 15 // Adjusted to be clearly above the line
  },
  keydepth: { 
    x: startX + (keydistancefromrotatingpoint)*scaleFactor + keywidth * scaleFactor + 15, 
    y: startY + (footingdepth_Hf * scaleFactor) + (keydepth * scaleFactor) / 2, // Adjusted to be clearly above and centered with the line
    rotate: 270 // Rotating by -90 degrees
  },
  keydistancefromrotatingpoint: { 
    x: startX + (keydistancefromrotatingpoint * scaleFactor) / 2, 
    y: startY + (footingdepth_Hf) * scaleFactor+15
  },
  titleposition: {
    x: startX + (toelength_a * scaleFactor + wallthick_b * scaleFactor + heellength_c * scaleFactor) / 2 -20, // use above line as reference
    y: startY + (footingdepth_Hf + keydepth*1) * scaleFactor+40
  }
};

// Adjust the SVG viewBox to encompass the entire shape
const svgWidth = 500;
const svgHeight = 500;
const viewBox = `0 0 ${svgWidth} ${svgHeight}`;

return (
  <svg className="wall-visualizer-svg" width="500" height="500" viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
    <path d={pathD} fill="none" stroke="black" strokeWidth="2" />
    <text x={textPositions.toelength_a.x} y={textPositions.toelength_a.y} fontSize="12" fontWeight="bold" textAnchor="middle">{`a = ${toelength_a} ft`}</text>
    <text x={textPositions.stemheight_H.x} y={textPositions.stemheight_H.y} fontSize="12" fontWeight="bold" transform={`rotate(${textPositions.stemheight_H.rotate}, ${textPositions.stemheight_H.x}, ${textPositions.stemheight_H.y})`} textAnchor="middle">{`H = ${stemheight_H} ft`}</text>
    <text x={textPositions.wallthick_b.x} y={textPositions.wallthick_b.y} fontSize="12" fontWeight="bold" textAnchor="middle">{`b = ${wallthick_b} ft`}</text>
    <text x={textPositions.heellength_c.x} y={textPositions.heellength_c.y} fontSize="12" fontWeight="bold" textAnchor="middle">{`c = ${heellength_c} ft`}</text>
    <text x={textPositions.footingdepth_Hf.x} y={textPositions.footingdepth_Hf.y} fontSize="12" fontWeight="bold" transform={`rotate(${textPositions.footingdepth_Hf.rotate}, ${textPositions.footingdepth_Hf.x}, ${textPositions.footingdepth_Hf.y})`} textAnchor="middle">{`Hf = ${footingdepth_Hf} ft`}</text>
    <text x={textPositions.keywidth.x} y={textPositions.keywidth.y} fontSize="12" fontWeight="bold" textAnchor="middle">{`${keywidth} ft`}</text>
    <text x={textPositions.keydepth.x} y={textPositions.keydepth.y} fontSize="12" fontWeight="bold" transform={`rotate(${textPositions.keydepth.rotate}, ${textPositions.keydepth.x}, ${textPositions.keydepth.y})`} textAnchor="middle">{`${keydepth} ft`}</text>
    <text x={textPositions.keydistancefromrotatingpoint.x} y={textPositions.keydistancefromrotatingpoint.y} fontSize="12" fontWeight="bold" textAnchor="middle">{`${keydistancefromrotatingpoint} ft`}</text>
    {/* Add title text element */}
    <text x={textPositions.titleposition.x} y={textPositions.titleposition.y} fontSize="14" fontWeight="bold" textAnchor="middle">{title}</text>
  </svg>
);
};

export default WallVisualizer;