import React from 'react';
import { FaUser, FaCode, FaGraduationCap, FaBriefcase, FaTools, FaTimes, FaLinkedin, FaGithub, FaFileAlt, FaEnvelope } from 'react-icons/fa';

const Sidebar = ({ data, isOpen, toggleSidebar, activeSection }) => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            // Close sidebar on mobile after click
            if (window.innerWidth <= 900) {
                toggleSidebar();
            }
        }
    };

    const menuItems = [
        { id: 'about', label: 'About', icon: <FaUser /> },
        { id: 'projects', label: 'Projects', icon: <FaCode /> },
        { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
        { id: 'experience', label: 'Experience', icon: <FaBriefcase /> },
        { id: 'skills', label: 'Skills', icon: <FaTools /> },
        { id: 'contact', label: 'Contact', icon: <FaEnvelope /> },
    ];

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>

                {/* Close button inside sidebar */}
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <FaTimes />
                </button>

                <div className="profile">
                    <img src="/profile_photo.jpeg" alt="Profile" className="avatar" />
                    <h1>{data?.about?.title || 'Web Developer'}</h1>
                    <p className="subtitle">Full Stack Developer</p>
                </div>

                <nav className="nav-menu">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="social-links">
                    <a href="https://www.linkedin.com/in/shefali-582845289/" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn"><FaLinkedin /></a>
                    <a href="https://github.com/shefukri" target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub"><FaGithub /></a>
                    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="social-icon" title="Resume"><FaFileAlt /></a>
                </div>

                <div className="footer">
                    <p>&copy; 2024 Portfolio</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
