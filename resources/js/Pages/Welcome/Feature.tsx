const Feature = () => {
  return (
      <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-16">
                  <span className="inline-block py-1 px-3 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-4">
                      Key Features
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Simplify Environment Management
                  </h2>
                  <p className="text-xl text-gray-600">
                      Our platform helps you overcome the challenges of
                      environment management with powerful, easy-to-use tools.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Feature 1 */}
                  <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 hover:border-indigo-100 group">
                      <div className="w-16 h-16 mb-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                              />
                          </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          Centralized Management
                      </h3>
                      <p className="text-gray-600">
                          Manage all your development, testing, staging, and
                          production environments from a single platform with
                          intuitive controls.
                      </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 hover:border-indigo-100 group">
                      <div className="w-16 h-16 mb-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                          </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          Role-Based Access
                      </h3>
                      <p className="text-gray-600">
                          Granular permission control with custom roles for
                          programmers, supervisors, and basic users to ensure
                          proper access levels.
                      </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 hover:border-indigo-100 group">
                      <div className="w-16 h-16 mb-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                          </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          Enhanced Security
                      </h3>
                      <p className="text-gray-600">
                          Prevent accidental deletions with strict permission
                          rules and multi-step approval workflows for critical
                          environments.
                      </p>
                  </div>

                  {/* Feature 4 */}
                  <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 hover:border-indigo-100 group">
                      <div className="w-16 h-16 mb-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                              />
                          </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          Complete Audit Logging
                      </h3>
                      <p className="text-gray-600">
                          Track all changes with detailed audit logs to maintain
                          transparency and accountability throughout your
                          organization.
                      </p>
                  </div>
              </div>
          </div>
      </section>
  );
}

export default Feature;