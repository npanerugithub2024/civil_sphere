import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Estimator.css';

const EstimationPages = () => {
    const navigate = useNavigate();
    const workItems = [
        { name: 'Concreting Work', icon: '🚧', path: '/details/concreting' },
        { name: 'Brick Masonry', icon: '🧱', path: '/details/brick-masonry' },
        { name: 'Plastering', icon: '🔨', path: '/details/plastering' },
        { name: 'Excavation', icon: '⛏️', path: '/details/excavation' },
        { name: 'Planting', icon: '🌳', path: '/details/planting' },
        { name: 'Add New', icon: '+', path: '' },
        
        // ... add more work items
    ];

    const navigateToDetails = (path) => {
        navigate(path);
    };

    return (
        <div className="estimation-page">
            {workItems.map(item => (
                <div key={item.name} className="card" onClick={() => navigateToDetails(item.path)}>
                    <span className="icon">{item.icon}</span>
                    <p>{item.name}</p>
                </div>
            ))}
        </div>
    );
};

export default EstimationPages;
