
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export function Navbar() {
  const { currentUser, switchRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const roles: UserRole[] = [
    'CAMO Planning',
    'FTAM',
    'CAMO Technical Services',
    'AMO 145',
    'Material Store',
    'Admin'
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleRoleMenu = () => setIsRoleMenuOpen(!isRoleMenuOpen);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-semibold text-gray-900">ACRS</span>
                <span className="ml-2 text-sm text-gray-500">Aircraft Component Robbing System</span>
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/dashboard" 
                className="border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={toggleRoleMenu}
                >
                  <User className="h-8 w-8 rounded-full p-1 bg-gray-100 text-gray-700" />
                  <div className="ml-2 text-left">
                    <div className="text-sm font-medium text-gray-700">
                      {currentUser?.name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentUser?.role || 'Role'}
                    </div>
                  </div>
                </button>
              </div>
              
              {isRoleMenuOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                >
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 font-semibold">Switch Role</div>
                    {roles.map((role) => (
                      <button
                        key={role}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          role === currentUser?.role 
                            ? 'bg-gray-100 text-gray-900 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          switchRole(role);
                          setIsRoleMenuOpen(false);
                        }}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="bg-secondary text-secondary-foreground block pl-3 pr-4 py-2 text-base font-medium"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 rounded-full p-2 bg-gray-100 text-gray-700" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{currentUser?.name}</div>
                <div className="text-sm font-medium text-gray-500">{currentUser?.role}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="px-4 py-2 text-sm text-gray-700 font-semibold">Switch Role</div>
              {roles.map((role) => (
                <button
                  key={role}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    role === currentUser?.role 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    switchRole(role);
                    setIsMenuOpen(false);
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
