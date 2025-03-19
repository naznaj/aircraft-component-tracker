
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900">ACRS</span>
              <span className="ml-2 text-sm text-gray-500">Aircraft Component Robbing System</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Aircraft Component Robbing System
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Streamline your component robbing workflow from request creation through component removal and aircraft normalization.
              </p>

              <div className="mt-8">
                <div className="rounded-md shadow">
                  <Link 
                    to="/dashboard" 
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                  >
                    Go to Dashboard
                    <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-base font-semibold tracking-wider text-gray-500 uppercase">Core Features</h2>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary">
                        <span className="text-sm font-medium">1</span>
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <span className="font-medium text-gray-900">Request Management</span> - Create and track component robbing requests
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary">
                        <span className="text-sm font-medium">2</span>
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <span className="font-medium text-gray-900">Role-Based Workflow</span> - Different actions per user role
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary">
                        <span className="text-sm font-medium">3</span>
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <span className="font-medium text-gray-900">Documentation Tracking</span> - Upload and track required documents
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary">
                        <span className="text-sm font-medium">4</span>
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-500">
                      <span className="font-medium text-gray-900">Status Visualization</span> - Clear status indicators and history
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:pl-8">
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">System Overview</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This prototype demonstrates the complete workflow for aircraft component robbing
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                          <span className="text-sm font-medium">1</span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">Request Creation</h4>
                        <p className="text-xs text-gray-500">CAMO Planning creates robbing request</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 text-amber-600">
                          <span className="text-sm font-medium">2</span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">Approval Process</h4>
                        <p className="text-xs text-gray-500">FTAM approves requests for aircraft without C of A</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600">
                          <span className="text-sm font-medium">3</span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">Component Removal</h4>
                        <p className="text-xs text-gray-500">AMO 145 removes component and documents removal</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                          <span className="text-sm font-medium">4</span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">Store Processing</h4>
                        <p className="text-xs text-gray-500">Material Store processes component and uploads S-Label</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
                          <span className="text-sm font-medium">5</span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">Normalization</h4>
                        <p className="text-xs text-gray-500">CAMO Planning plans and documents donor aircraft normalization</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <div className="text-sm text-center">
                    <p className="text-gray-500">
                      This is a prototype system to demonstrate workflow functionality
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              Aircraft Component Robbing System Prototype
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
