// LeftSidedFeature.js
import React from 'react';
import '../Features.css';


// TODO change to right side of the page
const RightSidedFeature = ({ imageWebp, imagePng, title, description, buttons }) => {
    return (
        <div className='features-right-sided'>
            <div className='features-right-sided-text'>
                <div className='features-right-sided-title'>
                    <div className='buttton-box'>
                        {buttons && buttons.map((Button, index) => (
                            <Button key={index} />
                        ))}
                    </div>
                    <h3>{title}</h3>
                </div>
                <p id='small-text'>{description}</p>
            </div>
            <picture>
                <source srcSet={imageWebp} type="image/webp" />
                <source srcSet={imagePng} type="image/png" />
                <img src={imagePng} alt={title} />
            </picture>
        </div>
    );
};

export default RightSidedFeature;
