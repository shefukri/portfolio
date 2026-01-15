import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import SectionCard from './SectionCard';
import { FaGithub, FaLinkedin, FaInstagram, FaBars } from 'react-icons/fa';
import '../App.css';

function Portfolio() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState(null);
    const [activeSection, setActiveSection] = useState('about');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/portfolio');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Scroll Spy Logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3 }
        );

        const sections = document.querySelectorAll('.section-card');
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, [data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('sending');
        try {
            await axios.post('/api/contact', formData);
            setFormStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error("Error sending message:", error);
            const msg = error.response?.data?.error || 'Failed to send message';
            setFormStatus(msg);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (loading) {
        return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading Portfolio...</div>;
    }

    if (!data || !data.about) {
        return (
            <div style={{ color: 'red', padding: '2rem', textAlign: 'center' }}>
                <h2>Failed to load profile data.</h2>
                <p>Ensure backend is running and database is seeded.</p>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Sidebar
                data={data}
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                activeSection={activeSection}
            />

            {/* Mobile Menu Toggle Button */}
            <button className="menu-toggle-btn" onClick={toggleSidebar}>
                <FaBars />
            </button>

            {/* Split Layout Container */}
            <div className="split-layout">

                {/* Left Pane: Image & Identity */}
                <div className="image-pane">
                    <img src="/profile_photo.jpeg" alt="Profile" className="hero-image" loading="lazy" />
                    <div className="hero-overlay-content">
                        <h1 className="hero-name">{data.about.title}</h1>
                        <h2 className="hero-role">{data.about.role}</h2>
                        <p className="hero-tagline">{data.about.tagline}</p>
                        <div className="hero-actions">
                            <a href="#projects" className="btn btn-primary">View Projects</a>
                            <a href="/resume.pdf" download className="btn btn-secondary">Download Resume</a>
                        </div>
                    </div>
                </div>

                {/* Right Pane: Content */}
                <main className="content-pane">
                    {/* Admin Login Button */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                        <Link to="/admin" className="btn btn-secondary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', color: 'var(--text-secondary)' }}>
                            Admin Login
                        </Link>
                    </div>

                    <SectionCard id="about" title="About">
                        <div className="about-content">
                            <p className="about-intro">{data.about.intro}</p>
                            <ul className="about-highlights">
                                {data.about.highlights && data.about.highlights.map((highlight, index) => (
                                    <li key={index}>{highlight}</li>
                                ))}
                            </ul>
                            <p className="about-closing">{data.about.closing}</p>
                        </div>
                    </SectionCard>

                    <SectionCard id="projects" title="Projects">
                        <div className="projects-grid">
                            {data.projects.map((project) => (
                                <div key={project.id} className="project-card">
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                    <div className="tags">
                                        {project.tech.map(t => <span key={t} className="tag">{t}</span>)}
                                    </div>
                                    {project.link && project.link !== '#' && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                                            View Project ↗
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard id="education" title="Education">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="timeline-item">
                                <h3>{edu.institution}</h3>
                                <p style={{ color: 'var(--primary)', fontWeight: '600' }}>{edu.degree}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <span>{edu.year}</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{edu.score}</span>
                                </div>
                            </div>
                        ))}
                    </SectionCard>

                    <SectionCard id="experience" title="Experience">
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="timeline-item">
                                <h3>{exp.company}</h3>
                                <p style={{ fontWeight: 600, color: 'var(--primary)' }}>{exp.role}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    <span>{exp.year}</span>
                                    <span>{exp.location}</span>
                                </div>
                                <p>{exp.description}</p>
                            </div>
                        ))}
                    </SectionCard>

                    <SectionCard id="skills" title="Skills">
                        <div className="skills-container">
                            {data.skills.map((skill) => (
                                <span key={skill} className="skill-badge">{skill}</span>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard id="contact" title="Get In Touch">
                        <div className="contact-container">
                            <div className="contact-info">
                                <p><strong>Email:</strong> {data?.contact?.email || 'hello@portfolio.dev'}</p>
                                <p><strong>Location:</strong> {data?.contact?.location || 'Remote'}</p>
                            </div>
                            <form className="contact-form" onSubmit={handleContactSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-btn" disabled={formStatus === 'sending'}>
                                    {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                                {formStatus === 'success' && <p className="success-msg">Message sent successfully!</p>}
                                {formStatus !== null && formStatus !== 'success' && formStatus !== 'sending' && <p className="error-msg">{formStatus}</p>}
                            </form>
                        </div>
                    </SectionCard>

                    {/* Footer in Content Pane */}
                    <footer className="pane-footer">
                        <div className="footer-content">
                            <span className="signature">Designed & Built by <span className="cursive">Shefukri</span></span>
                            <div className="footer-socials">
                                <a href="https://github.com/shefukri" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                                <a href="https://www.linkedin.com/in/shefali-582845289/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                                <a href={data?.contact?.socials?.instagram || "#"} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                            </div>
                            <p className="copyright">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}

export default Portfolio;
