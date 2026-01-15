import React from 'react';
import { motion } from 'framer-motion';

const SectionCard = ({ id, title, children }) => {
    return (
        <section id={id} className="section-container">
            <motion.div
                className="card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <h2 className="section-title">{title}</h2>
                <div className="card-content">
                    {children}
                </div>
            </motion.div>
        </section>
    );
};

export default SectionCard;
