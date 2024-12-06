"use client"
import { useState } from 'react';

interface ProjectUsersProps {
    params: {
      id: string;
    };
  }

const UserManagement: React.FC<ProjectUsersProps> = ({ params }) => {

  // Données fictives des utilisateurs du projet
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', role: 'Project Manager' },
    { id: 2, name: 'Jane Smith', role: 'Engineer' },
    { id: 3, name: 'Alice Johnson', role: 'Architect' },
  ]);

  const [showAddUserForm, setShowAddUserForm] = useState(false); // Contrôle de l'affichage du formulaire d'ajout d'utilisateur
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');

  // Fonction pour ajouter un utilisateur
  const addUser = () => {
    if (newUserName && newUserRole) {
      const newUser = {
        id: Date.now(), // Un ID unique
        name: newUserName,
        role: newUserRole,
      };
      setUsers([...users, newUser]);
      setNewUserName('');
      setNewUserRole('');
      setShowAddUserForm(false); // Masquer le formulaire après soumission
    }
  };

  // Fonction pour supprimer un utilisateur
  const removeUser = (userId: number) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Management for Project {params.id}</h1>

      {/* Liste des utilisateurs */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Project Users</h2>
        <ul className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="p-4 flex justify-between items-center">
              <span>
                <strong>{user.name}</strong> - {user.role}
              </span>
              <button
                onClick={() => removeUser(user.id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bouton pour afficher/masquer le formulaire d'ajout d'utilisateur */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
        onClick={() => setShowAddUserForm(!showAddUserForm)}
      >
        {showAddUserForm ? 'Hide Add User Form' : 'Add New User'}
      </button>

      {/* Formulaire pour ajouter un utilisateur */}
      {showAddUserForm && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add New User</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="User Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="User Role"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={addUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
            >
              Add User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
