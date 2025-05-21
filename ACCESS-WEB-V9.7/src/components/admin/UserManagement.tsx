import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
  isAdmin: boolean;
  status: 'active' | 'suspended' | 'pending';
  subscription: string | null;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/admin/users');
        // const data = await response.json();
        
        // For now, we'll simulate some data
        setTimeout(() => {
          const mockUsers: User[] = [
            { 
              id: 1, 
              email: 'john.doe@example.com', 
              name: 'John Doe', 
              createdAt: '2025-04-10T10:30:00Z',
              isAdmin: false,
              status: 'active',
              subscription: 'Professional Plan'
            },
            { 
              id: 2, 
              email: 'jane.smith@example.com', 
              name: 'Jane Smith', 
              createdAt: '2025-04-15T14:20:00Z',
              isAdmin: false,
              status: 'active',
              subscription: 'Basic Plan'
            },
            { 
              id: 3, 
              email: 'admin@accessweb.com', 
              name: 'Admin User', 
              createdAt: '2025-01-05T09:45:00Z',
              isAdmin: true,
              status: 'active',
              subscription: null
            },
            { 
              id: 4, 
              email: 'sarah.wilson@example.com', 
              name: 'Sarah Wilson', 
              createdAt: '2025-05-02T11:10:00Z',
              isAdmin: false,
              status: 'pending',
              subscription: null
            },
            { 
              id: 5, 
              email: 'mike.johnson@example.com', 
              name: 'Mike Johnson', 
              createdAt: '2025-03-22T16:35:00Z',
              isAdmin: false,
              status: 'suspended',
              subscription: 'Enterprise Plan'
            },
            { 
              id: 6, 
              email: 'lisa.brown@example.com', 
              name: 'Lisa Brown', 
              createdAt: '2025-04-30T13:25:00Z',
              isAdmin: false,
              status: 'active',
              subscription: 'Basic Plan'
            },
            { 
              id: 7, 
              email: 'david.miller@example.com', 
              name: 'David Miller', 
              createdAt: '2025-05-05T10:15:00Z',
              isAdmin: false,
              status: 'active',
              subscription: 'Professional Plan'
            }
          ];
          
          setUsers(mockUsers);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      (user.name && user.name.toLowerCase().includes(searchLower))
    );
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const saveUserChanges = () => {
    if (!selectedUser) return;
    
    // In a real implementation, this would be an API call
    // await fetch(`/api/admin/users/${selectedUser.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(selectedUser)
    // });
    
    // Update the users array with the edited user
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    );
    
    setUsers(updatedUsers);
    closeModal();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-10 h-10 border-4 border-[#0fae96] border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <button 
          className="px-4 py-2 bg-[#0fae96] text-white rounded-full hover:bg-[#0d9a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:ring-offset-2"
        >
          Add New User
        </button>
      </div>
      
      {/* Search and filter */}
      <div className="mb-6">
        <div className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-gray-300 dark:border-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="ml-2 w-full bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Users table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Plan</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Joined</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#0fae96] flex items-center justify-center text-white mr-3">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {user.isAdmin ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          User
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {user.status === 'active' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                      )}
                      {user.status === 'pending' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Pending
                        </span>
                      )}
                      {user.status === 'suspended' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Suspended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {user.subscription || 'No Plan'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="px-2 py-1 text-xs font-medium text-[#0fae96] hover:text-[#0d9a85] transition-colors focus:outline-none"
                      >
                        Edit
                      </button>
                      <button 
                        className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No users found matching your search.
          </div>
        )}
      </div>
      
      {/* Edit user modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Edit User
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={selectedUser.name || ''}
                onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value || null})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={selectedUser.isAdmin ? 'admin' : 'user'}
                onChange={(e) => setSelectedUser({...selectedUser, isAdmin: e.target.value === 'admin'})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={selectedUser.status}
                onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value as 'active' | 'suspended' | 'pending'})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subscription Plan
              </label>
              <select
                value={selectedUser.subscription || ''}
                onChange={(e) => setSelectedUser({...selectedUser, subscription: e.target.value || null})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              >
                <option value="">No Plan</option>
                <option value="Basic Plan">Basic Plan</option>
                <option value="Professional Plan">Professional Plan</option>
                <option value="Enterprise Plan">Enterprise Plan</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={saveUserChanges}
                className="px-4 py-2 bg-[#0fae96] text-white rounded-full hover:bg-[#0d9a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;