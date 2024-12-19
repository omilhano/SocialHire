import React from 'react';
import './Precautions.css';

const Precautions = () =>{
    return (
      <div>
        <h2>Before applying</h2>
        <p>Consider the following precautions:
        </p>
        <ul className='precautions-list'>
            <li>
                Consult safety materials
            </li>
            <li>
                Verify with client the time and location
            </li>
            <li>
                Don't accept jobs that you don't feel confident doing
            </li>
            <li>
                Be nice
            </li>
        </ul>
      </div>
    );

}

export default Precautions;
