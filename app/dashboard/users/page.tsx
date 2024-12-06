'use client';

import { useState, useEffect } from 'react';
import { registerUser, getUsers, updateUser, deleteUser } from '@/app/actions/users/userActions';
import { User } from '@/app/types/type';
import { Button } from '@/components/ui/button';
import { FaMinus, FaPlus } from 'react-icons/fa';

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [AddingUser, setAddingUser] = useState(false);

  useEffect(() => {
    // Charger les utilisateurs au montage du composant
    const fetchUsers = async () => {
      const userData = await getUsers();
      setUsers(userData);
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Mise à jour de l'utilisateur
        await updateUser(editingUser.id, name, email, password, role);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser.id ? { ...user, name, email, password, role } : user
          )
        );
        setEditingUser(null);
      } else {
        // Ajout d'un nouvel utilisateur
        const newUser = await registerUser(name, email, password, role);
        setUsers([...users, newUser]);
      }

      // Réinitialiser le formulaire
      setName('');
      setEmail('');
      setPassword('');
      setRole('');
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setAddingUser(true);
    setPassword(''); // Réinitialiser le champ du mot de passe
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
        <Button
            variant={'outline'}
            className='border-blue-500 bg-blue-500 text-white'
            onClick={() => setAddingUser((prev) => !prev)}
        >
            {AddingUser ? <FaMinus /> : <FaPlus />}
        </Button>
      </div>

      {/* Liste des utilisateurs */}
      {!AddingUser && (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <ul className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
            {users.map((user) => (
                <li key={user.id} className="p-4 flex justify-between items-center">
                <span>
                    <strong>{user.name}</strong> - {user.role}
                </span>
                <div className="flex space-x-4">
                    <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:underline"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:underline"
                    >
                    Delete
                    </button>
                </div>
                </li>
            ))}
            </ul>
        </div>
      )}

      {/* Formulaire d'ajout/édition d'utilisateur */}
      {AddingUser && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required={!editingUser} // Le mot de passe n'est pas requis lors de l'édition
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
            >
                {editingUser ? 'Update User' : 'Add User'}
            </button>
            </form>
        </div>
      )}
    </div>
  );
}
