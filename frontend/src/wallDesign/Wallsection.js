import React from 'react';

const WallVisualizer = ({ wallData }) => {
  const { footlength_a, stemheight_H, wallthick_b, heellength_e, footingdepth_Hf } = wallData;

  const startX = 400;
  const startY = 500;

  const pathD = `
    M ${startX} ${startY}
    h +${footlength_a}
    v -${stemheight_H}
    h ${wallthick_b}
    v +${stemheight_H}
    h +${heellength_e}
    v ${footingdepth_Hf}
    h -${heellength_e}-${wallthick_b}-${footlength_a}
    v -${footingdepth_Hf}
  `;

 // Text positions (adjust as necessary)
const textPositions = {
    footlength_a: { x: startX - footlength_a / 2, y: startY + 20 },
    stemheight_H: { 
      x: startX - footlength_a, // Adjusted for rotation
      y: startY - stemheight_H / 2,
      rotate: 90 // Rotating by -90 degrees
    },
    wallthick_b: { x: startX - footlength_a + wallthick_b / 4, y: startY - stemheight_H - 10 },
    heellength_e: { x: startX - footlength_a + wallthick_b + heellength_e / 2, y: startY + 20 },
    footingdepth_Hf: { x: startX - footlength_a + wallthick_b + heellength_e + 20, y: startY + stemheight_H + footingdepth_Hf / 2 }
  };
  
  // In your SVG component
  <text
    x={textPositions.stemheight_H.x}
    y={textPositions.stemheight_H.y}
    fontSize="12"
    transform={`rotate(${textPositions.stemheight_H.rotate}, ${textPositions.stemheight_H.x}, ${textPositions.stemheight_H.y})`}
    textAnchor="middle"
  >
    {`stemheight_H: ${stemheight_H}`}
  </text>
  

  return (
    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
      <path d={pathD} fill="none" stroke="black" strokeWidth="2" />
      <text x={textPositions.footlength_a.x} y={textPositions.footlength_a.y} fontSize="12" textAnchor="middle">{`footlength_a: ${footlength_a}`}</text>
      <text x={textPositions.stemheight_H.x} y={textPositions.stemheight_H.y} fontSize="12" textAnchor="middle">{`stemheight_H: ${stemheight_H}`}</text>
      <text x={textPositions.wallthick_b.x} y={textPositions.wallthick_b.y} fontSize="12" textAnchor="middle">{`wallthick_b: ${wallthick_b}`}</text>
      <text x={textPositions.heellength_e.x} y={textPositions.heellength_e.y} fontSize="12" textAnchor="middle">{`heellength_e: ${heellength_e}`}</text>
      <text x={textPositions.footingdepth_Hf.x} y={textPositions.footingdepth_Hf.y} fontSize="12" textAnchor="middle">{`footingdepth_Hf: ${footingdepth_Hf}`}</text>
    </svg>
  );
};

export default WallVisualizer;
