import React from 'react';

const About = () => {
    const handleClick = () => {
        // Redirect to the home page
        window.location.href = "/";
    };

    return (
        <div className="main-content">
            <h2>Construction simplified.</h2>
            <p>Nishan Thapa</p>
            <p><a href="mailto:nishan.idea23@gmail.com">nishan.idea23@gmail.com</a></p>
            <button  onClick={handleClick}>THANK YOU.</button>
            
            
        </div>
    );
};

export default About;


// import React from 'react';

// const About = () => {
//     // Define a function to handle the button click
//     const handleClick = () => {
//         // Redirect to the home page
//         window.location.href = "/";
//     };

//     return (
//         <div className="main-content" style={{backgroundColor: "#f0f0f0", fontFamily: "Arial", margin: "20px", padding: "20px"}}>
//             <h1 style={{textAlign: "center"}}>Construction simplified.</h1>
//             <p style={{textAlign: "center"}}>Nishan Thapa</p>
//             <p style={{textAlign: "center"}}><a href="mailto:nishan.idea23@gmail.com">nishan.idea23@gmail.com</a></p>
//             <button style={{display: "block", margin: "auto"}} onClick={handleClick}>THANK YOU.</button>
//         </div>
//     );
// };

// export default About;