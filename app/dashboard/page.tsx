import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full'>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects Overview */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            <p>You have 3 ongoing projects.</p>
            <a href="/dashboard/projects" className="text-blue-600 hover:underline mt-4 block">
              View Projects
            </a>
          </div>

          {/* Documents Overview */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <p>2 documents pending for your signature.</p>
            <a href="/dashboard" className="text-blue-600 hover:underline mt-4 block">
              View Documents
            </a>
          </div>

          {/* Users Overview */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <p>5 users involved in your projects.</p>
            <a href="/users" className="text-blue-600 hover:underline mt-4 block">
              Manage Users
            </a>
          </div>
        </div>
    </div>
  )
}

export default page