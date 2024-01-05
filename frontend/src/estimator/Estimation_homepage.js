import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../user/AuthContext';
import './Estimator.css';

function EstimationPage() {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const { user } = useAuth(); // Get the current user's details
    useEffect(() => {
        fetchProjects();
    }, []);

    console.log ("user in estimation homepage is", user)
    const errorTimeoutRef = useRef(null);

    useEffect(() => {
        if (errorMessage) {
            // Clear any existing timeout to ensure we don't have multiple timeouts running simultaneously
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }

            // Set a new timeout to clear the error message after 5 seconds
            errorTimeoutRef.current = setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }

        // Cleanup function: If the component is unmounted, clear the timeout
        return () => {
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }
        };
    }, [errorMessage]); // Watch for changes in the errorMessage state

    const handleApiError = (response) => {
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        return response.json();
    };

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/projects`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            

            const data = await handleApiError(response);
            console.log("Fetched data:", data);  // Debug: Log what's being received
    
            setProjects(data.map(project => {
                // Use project_id from the backend if available, otherwise fall back to _id
                const projectId = project.project_id ? project.project_id : project._id;
                return {
                    ...project,
                    id: projectId, // Use a consistent key for React components (here it's 'id')
                };
            }));
        } catch (error) {
            console.error("Error fetching projects:", error);
            setErrorMessage("Failed to fetch projects. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
      
    const createProject = async () => {
        console.log("user while creating project is",user)
        if (!user || !user.access_token) {
            setErrorMessage("You must be logged in to create a project.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/projects/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ 
                    name: newProjectName,
                    user_id: user.id  // Send the user's ID with the request
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create project");
            }
            
            fetchProjects();
        } catch (error) {
            console.error("Error creating project:", error);
            setErrorMessage("Error Creating Project");
        }
    };

    const deleteProject = async (project_id) => {
        
        if (!project_id) {
            console.error("Project ID is undefined");
            setErrorMessage("Cannot delete project without a valid ID");
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/projects/${project_id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete project");
            }

            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
            setErrorMessage("Error deleting project");
        }
    };

    const copyProject = async (project_id) => {
        // Assuming the server will handle copying all other project data, 
        // we only need to send the new project name
        if (!project_id) {
            console.error("Project ID is undefined");
            setErrorMessage("Cannot copy project without a valid ID");
            return;
        }
        const newProjectName = `${project_id} (Copy)`;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/estimator/projects/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ name: newProjectName })
            });

            if (!response.ok) {
                throw new Error("Failed to copy project");
            }

            fetchProjects();
        } catch (error) {
            console.error("Error copying project:", error);
            setErrorMessage("Error copying project");
        }
    };

    return (
        <div className="estimation-page">
            <h1>Estimation Page</h1>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {isLoading && <div className="loading-message">Loading projects...</div>}
            
            <div className='estimation_block'>
                <div className='project_block'>
                    <h2>Projects</h2>
                    <div className='project_block_entry'>
                    <input 
                        type="text" 
                        value={newProjectName} 
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="New project name" 
                    />

                        <button className="submit_button blue" type="submit" onClick={createProject}>Add New Project</button>
                    </div>

                    
                    <ProjectList
                        projects={projects}
                        onDelete={deleteProject}
                        onCopy={copyProject}
                        onSelect={setSelectedProjectId} // Pass the setSelectedProjectId function
                    />

            
                </div>
    
                <div className='uick_links'>
                    <h3>Quick Links</h3>
                    <Link to="/specification_list" className="nav-button">Specification Lists</Link>
                    <Link to="/boq_entry" className="nav-button">BOQ Entry</Link>
                </div>
            </div>
        </div>
    );
}

const ProjectList = ({ projects, onDelete, onCopy, onSelect }) => {
    // const { user } = useAuth(); // Get the current user's details
    // console.log("projects are ",projects);
    return (
        <div className="project_list">
            {projects.map(project => (
 
            <div className="project_box" key={project.id}>
                <Link to={`/details/${project.id}`} className="cool-link">
                    <div className="cool-link" onClick={() => onSelect(project.id)}>
                        {project.name}
                    </div>
                </Link>
               
                <div className="button_container">
                    {/* <button className="copy" onClick={() => onCopy(project.id)}>Copy</button> */}
                    <button className="delete" onClick={() => onDelete(project.id)}>Delete</button>                   
                </div>             
            </div>           
            ))}
            </div>
        );
    };


export default EstimationPage;