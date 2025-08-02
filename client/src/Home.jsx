import React, { useEffect, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Home() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState(null);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });

  const [editUser, setEditUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);

      if (parsed.role === 'admin') {
        fetchUsers();
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchUsers = async () => {
    const res = await fetch('https://user-management-system-1m4h.onrender.com/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await fetch(`https://user-management-system-1m4h.onrender.com/api/users/${id}`, { method: 'DELETE' });
    toast.success('User deleted');
    setUsers(users.filter(u => u._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    const res = await fetch('https://user-management-system-1m4h.onrender.com/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('✅ User created successfully');
      setNewUser({ username: '', email: '', password: '', role: 'user' });
      setShowAddUser(false);
      fetchUsers();
    } else {
      toast.error('❌ ' + (data.message || 'Error creating user'));
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    const res = await fetch(`https://user-management-system-1m4h.onrender.com/api/users/${editUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUser)
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('✅ User updated successfully');
      setEditUser(null);
      fetchUsers();
    } else {
      toast.error('❌ ' + (data.message || 'Error updating user'));
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        const valA = a[sortConfig.key].toString().toLowerCase();
        const valB = b[sortConfig.key].toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter(u => {
    const matchesText =
      u.username.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase());

    const matchesRole =
      roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesText && matchesRole;
  });

  const clearFilters = () => {
    setFilter('');
    setRoleFilter('all');
  };

  const getSortArrow = (key) => {
    if (!sortConfig || sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="home-bg">
      <div className="navbar">
        <h3>Welcome, {user.username}</h3>
        <div className="nav-actions">
          {user.role === 'admin' && !editUser && (
            <button className="add-user-btn" onClick={() => setShowAddUser(!showAddUser)}>
              {showAddUser ? 'Back to Users' : 'Add User'}
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="home-card">
        {user.role === 'admin' && showAddUser ? (
          <form className="add-user-form" onSubmit={handleAddUser}>
            <h3>Create New User</h3>
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="save-btn">Create User</button>
          </form>
        ) : user.role === 'admin' && editUser ? (
          <form className="add-user-form" onSubmit={handleEditUser}>
            <h3>Edit User</h3>
            <input
              type="text"
              placeholder="Username"
              value={editUser.username}
              onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              required
            />
            <select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="save-btn">Update User</button>
            <button type="button" className="clear-btn" onClick={() => setEditUser(null)}>Cancel</button>
          </form>
        ) : user.role === 'admin' ? (
          <div>
            <h3 className="user-list-title">All Users</h3>

            <div className="filter-bar">
              <input
                className="search-input"
                type="text"
                placeholder="Search by username or email"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />

              <select
                className="role-dropdown"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>

              <button className="clear-btn" onClick={clearFilters}>Clear Filters</button>
            </div>

            {filteredUsers.length > 0 ? (
              <table className="user-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort('username')}>
                      Username {getSortArrow('username')}
                    </th>
                    <th onClick={() => requestSort('email')}>
                      Email {getSortArrow('email')}
                    </th>
                    <th onClick={() => requestSort('role')}>
                      Role {getSortArrow('role')}
                    </th>
                    <th onClick={() => requestSort('_id')}>
                      User_ID {getSortArrow('_id')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u._id}</td>
                      <td>
                        <button className="edit-btn" onClick={() => setEditUser(u)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No users found</p>
            )}
          </div>
          ) : (
            <div className="user-profile-container">
              <div className="profile-table">
                <div className="profile-header">
                  <div className="header-cell">Field</div>
                  <div className="header-cell">Value</div>
                </div>

                <div className="profile-row">
                  <div className="profile-cell label">Username</div>
                  <div className="profile-cell value">{user.username}</div>
                </div>

                <div className="profile-row">
                  <div className="profile-cell label">Email</div>
                  <div className="profile-cell value">{user.email}</div>
                </div>

                <div className="profile-row">
                  <div className="profile-cell label">Role</div>
                  <div className="profile-cell value">{user.role}</div>
                </div>

                <div className="profile-row">
                  <div className="profile-cell label">User ID</div>
                  <div className="profile-cell value">{user._id}</div>
                </div>
              </div>
            </div>
          )}
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default Home;
