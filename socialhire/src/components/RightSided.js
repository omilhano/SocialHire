// LeftSidedFeature.js
import React from 'react';
import '../styles/Features.css';


// TODO change to right side of the page
const RightSidedFeature = ({ imageWebp, imagePng, title, description, buttons }) => {
    return (
        <div className='features-right-sided'>
            <picture>
                <source srcSet={imageWebp} type="image/webp" />
                <source srcSet={imagePng} type="image/png" />
                <img src={imagePng} alt={title} />
            </picture>
            <div className='features-right-sided-text'>
                <div className='features-right-sided-title'>
                    <h3>{title}</h3>
                    <div className='buttton-box'>
                        {buttons && buttons.map((Button, index) => (
                            <Button key={index} />
                        ))}
                    </div>
                </div>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default RightSidedFeature;
