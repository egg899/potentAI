import React from 'react';
import logo from '../assets/images/logo-potentia.png';

const Logo = ({ className = '', size = 44 }) => (
  <img
    src={logo}
    alt="Logo potentIA"
    width="90px"
    height="auto"
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

export default Logo; 