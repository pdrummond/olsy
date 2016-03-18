import React from 'react';
import MobileMenu from '../components/MobileMenu.jsx';

const NotFoundPage = () => (
  <div className="page not-found">
    <nav>
      <MobileMenu/>
    </nav>
    <div className="content-scrollable">
      <p>Page not found</p>
    </div>
  </div>
);

export default NotFoundPage;
