import React from 'react';
import '../styles/PolicyComponent.css'

const PolicyComponent = ({ title, definitions = [] }) => {
    return (
        <div className='component-privacy'>
            <div className='privacy-title'>
                <h3 className='privacy-title'>{title}</h3>
                <hr></hr>
            </div>
            <ul className='privacy-terms-list'>
                {definitions.length > 0 ? (
                    definitions.map((definition, index) => (
                        <li key={index} className='privacy-term-item'>
                            <strong className='type'>{definition.type}: </strong>
                            <span className='privacy-style'>{definition.description}</span>
                        </li>
                    ))
                ) : (
                    <p>No definitions available.</p>
                )}
            </ul>
        </div>
    );
};

export default PolicyComponent;