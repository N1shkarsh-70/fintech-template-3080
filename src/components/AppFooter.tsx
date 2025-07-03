
import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  return (
    <footer className="bg-background/80 backdrop-blur-md border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">FT</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              FinTrace
            </span>
          </div>
          
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <span>© 2025 FinTrace. All rights reserved.</span>
            <Link to="#" className="hover:text-pink-500 transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-pink-500 transition-colors">
              Terms of Use
            </Link>
            <Link to="#" className="hover:text-pink-500 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
