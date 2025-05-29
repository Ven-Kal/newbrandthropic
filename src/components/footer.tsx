
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">Brandthropic</h3>
            <p className="text-gray-400 text-sm">
              Your voice matters. Share authentic brand experiences and discover what others are saying.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-gray-400 hover:text-white transition-colors">
                  Brands
                </Link>
              </li>
              <li>
                <Link to="/my-reviews" className="text-gray-400 hover:text-white transition-colors">
                  My Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Participate */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-4">Participate</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/survey/550e8400-e29b-41d4-a716-446655440000" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Take Survey
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                  Join Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">support@brandthropic.com</span>
              </li>
              <li>
                <span className="text-gray-400">Follow us on social media</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Brandthropic. All rights reserved. | You're well heard here.
          </p>
        </div>
      </div>
    </footer>
  );
};
