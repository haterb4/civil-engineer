'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createProject, getProjects } from '@/app/actions/projects/projectActions';
import { Project, ProjectUser, User } from '@/app/types/type';
import { getUsers } from '@/app/actions/users/userActions';


const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [projectData, setProjectData] = useState({ name: '', description: '' });
  const [assignedUsers, setAssignedUsers] = useState<ProjectUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([])

  // State for handling user selection and role assignment
  const [selectedUser, setSelectedUser] = useState('');
  const [role, setRole] = useState('');

  // Fetch the list of projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      const projectData = await getProjects();
      setProjects(projectData);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers();
      setAvailableUsers(usersData);
    };

    fetchUsers();
  }, []);

  // Handle form field changes
  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding users with roles to the project
  const handleAddUser = () => {
    if (selectedUser && role) {
      const user = availableUsers.find((u) => u.id.toString() === selectedUser)
      if (!user) {
        alert('User not found');
        return;
      }
      setAssignedUsers([...assignedUsers, { user, role }]);
      setSelectedUser('');
      setRole('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProject = await createProject(
        projectData.name,
        projectData.description,
        1, // Replace '1' with the current user's ID
        assignedUsers.map((u) => ({ user: availableUsers.find((user) => user.id === u.user.id)!, role: u.role }))
      );
      setProjects([...projects, newProject]);
      setShowForm(false); // Hide the form after submission
      setProjectData({ name: '', description: '' });
      setAssignedUsers([]); // Reset assigned users
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the project.');
    }
  };

  return (
    <div className="w-full h-full">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      {/* Add New Project Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
        >
          {showForm ? 'Close Form' : 'Add New Project'}
        </button>
      </div>

      {/* Form to Add New Project */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="projectName">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={projectData.name}
              onChange={handleProjectChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
              Project Description
            </label>
            <textarea
              name="description"
              value={projectData.description}
              onChange={handleProjectChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Add Users and Assign Roles */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Assign Users and Roles</label>

            <div className="flex space-x-4 mb-4">
              {/* Select User */}
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select User</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              {/* Assign Role */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Assign Role</option>
                <option value="Admin">Admin</option>
                <option value="Engineer">Engineer</option>
                <option value="Manager">Manager</option>
                <option value="Client">Client</option>
              </select>

              {/* Add User to the Project */}
              <button
                type="button"
                onClick={handleAddUser}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300"
              >
                Add User
              </button>
            </div>

            {/* Display Assigned Users */}
            {assignedUsers.length > 0 && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="text-gray-700 font-semibold mb-2">Assigned Users:</h4>
                <ul className="space-y-2">
                  {assignedUsers.map((assignedUser, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{assignedUser.user.name}</span>
                      <span className="px-3 py-1 rounded-full bg-blue-200 text-sm">
                        {assignedUser.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition duration-300"
            >
              Create Project
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="flex justify-between items-center">
              <Link href={`/dashboard/projects/${project.id}`}>
                <span className="text-blue-600 hover:underline">{project.name}</span>
              </Link>
              <span
                className={`px-3 py-1 rounded-full ${
                  project.status === 'Ongoing' ? 'bg-yellow-200' : 'bg-green-200'
                } text-sm`}
              >
                {project.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Projects;
