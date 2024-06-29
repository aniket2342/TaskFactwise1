import React, { useState, useEffect } from 'react';
import myrequest from '../component/celebrities.json'
function ListView() {
  const [users, setUsers] = useState([]);
  const [showForms, setShowForms] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const usersWithAge = myrequest.map((user) => ({
      ...user,
      age: calculateAge(new Date(user.dob)),
    }));
    setUsers(usersWithAge);


  }, []);

  const calculateAge = (dob) => {
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const toggleFormsVisibility = () => {
    setShowForms(!showForms);
  };

  const [editMode, setEditMode] = useState({});
const [editedUser, setEditedUser] = useState({});

const toggleEditMode = (userId) => {
  if (users.find(user => user.id === userId).age < 18) {
    alert("Only adults can be edited.");
    return;
  }
  setEditMode(prev => ({ ...prev, [userId]: !prev[userId] }));
  setEditedUser(users.find(user => user.id === userId));
};

const handleEdit = (field, value) => {
  setEditedUser(prev => ({ ...prev, [field]: value }));
};

const saveEdit = (userId) => {
  if (window.confirm("Save Done")) {
  setUsers(users.map(user => user.id === userId ? editedUser : user));
  setEditMode(prev => ({ ...prev, [userId]: false }));}
};

const cancelEdit = (userId) => {
  setEditMode(prev => ({ ...prev, [userId]: false }));
};

const deleteUser = (userId) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    setUsers(users.filter(user => user.id !== userId));
  }
};

const isEditChanged = (userId) => {
  const originalUser = users.find(user => user.id === userId);
  return JSON.stringify(originalUser) !== JSON.stringify(editedUser);
};

useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 300);

  return () => {
    clearTimeout(handler);
  };
}, [searchTerm]);

const filteredUsers = users.filter((user) =>
  `${user.first} ${user.last}`.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
);

  return (
    <>
      <form className="flex items-center max-w-sm mx-auto mt-10" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search User"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
        </div>
      </form>

      <div className=" p-4 flex flex-col items-center">
      {filteredUsers.map((user) => (
          <div key={user.id} className="p-4 mb-4 border rounded-lg w-1/2 ">
            <div className="flex items-center mb-4">
              <img src={user.picture} alt={user.first} className="w-16 h-16 rounded-full mr-4" />
              <div>
                <h2 className="text-xl font-bold">
                  {user.first} {user.last}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <button className='ml-auto' onClick={() => toggleFormsVisibility(user.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
                </svg>


              </button>
              
            </div>
            {showForms && (
              <div className="mt-4">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="text"
                    value={user.age}
                    readOnly
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={editMode[user.id] ? editedUser.gender : user.gender}
                    onChange={(e) => handleEdit('gender', e.target.value)}
                    disabled={!editMode[user.id]}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="transgender">Transgender</option>
                    <option value="rather not say">Rather not say</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={editMode[user.id] ? editedUser.country : user.country}
                    onChange={(e) => handleEdit('country', e.target.value)}
                    disabled={!editMode[user.id]}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                    required
                    pattern="[A-Za-z\s]+"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editMode[user.id] ? editedUser.description : user.description}
                    onChange={(e) => handleEdit('description', e.target.value)}
                    disabled={!editMode[user.id]}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className='mb-4 flex justify-end gap-4'>
                  {!editMode[user.id] ? (
                    <>
                      <button onClick={() => toggleEditMode(user.id)} disabled={user.age < 18}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>
                      </button>
                      <button onClick={() => deleteUser(user.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => cancelEdit(user.id)}>Cancel</button>
                      <button onClick={() => saveEdit(user.id)} disabled={!isEditChanged(user.id)}>Save</button>
                    </>
                  )}
                </div>
              </form>
            </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default ListView;
