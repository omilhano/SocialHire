import React from 'react';
import '../styles/TOScomponent.css'

const TOScomponent = ({ title, definitions = [] }) => {
    return (
        <div className='component-tos'>
            <div className='tos-title'>
                <h3 className='TOS-title'>{title}</h3>
                <hr></hr>
            </div>
            <ul className='tos-terms-list'>
                {definitions.length > 0 ? (
                    definitions.map((definition, index) => (
                        <li key={index} className='tos-term-item'>
                            <strong className='term'>{definition.term}: </strong>
                            <span className='description-style'>{definition.description}</span>
                        </li>
                    ))
                ) : (
                    <p>No definitions available.</p>
                )}
            </ul>
        </div>
    );
};

export default TOScomponent;
