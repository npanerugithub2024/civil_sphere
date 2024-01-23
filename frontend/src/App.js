import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './base/Navbar';
import Footer from './base/Footer';
import HomePage from './base/HomePage';
import About from './base/About';
import ContactUs from './base/ContactUs';

import WorkDetailsPage from './estimator/EstimationDetailsPage';
import EstimationPage from './estimator/Estimation_homepage';
import WorkSpecificationForm from './estimator/Specification_entry';
import SpecificationList from './estimator/Specification_list';
import Login from './user/Login';
import Signup from './user/Signup';
import PrivateRoute from './user/PrivateRoute';
import { AuthProvider } from './user/AuthContext';
import './App.css';
import CantileverWallCalculator from './wallDesign/Walldesign_homepage';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contactus" element={<ContactUs />} />
                            <Route path="/walldesign" element={<CantileverWallCalculator />} />

                            {/* Wrap the component with PrivateRoute within the element prop */}
                            <Route path="/estimationpage" element={
                                <PrivateRoute>
                                    <EstimationPage />
                                </PrivateRoute>
                            } />
                            {/* <Route path="/estimationpages" element={
                                <PrivateRoute>
                                    <EstimationPages />
                                </PrivateRoute>
                            } /> */}
                            <Route path="/specification_list" element={
                                <PrivateRoute>
                                    <SpecificationList />
                                </PrivateRoute>
                            } />
                            <Route path="/specification_entry" element={
                                <PrivateRoute>
                                    <WorkSpecificationForm />
                                </PrivateRoute>
                            } />
                            <Route path="/details/:projectId" element={
                                <PrivateRoute>
                                    <WorkDetailsPage />
                                </PrivateRoute>
                            } />
                            {/* Add more routes as needed */}
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;

