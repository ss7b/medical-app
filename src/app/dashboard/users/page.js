'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/app/components/layout/AdminLayout';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // إذا لم يكن المستخدم مسجلاً دخوله، تحويله لصفحة تسجيل الدخول
    } else {
      fetchUsers(token);
    }
  }, [router]);

  const fetchUsers = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      console.log("#######")
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = isEditing 
        ? `http://localhost:8000/api/users/${editId}`
        : 'http://localhost:8000/api/users';

      const method = isEditing ? 'put' : 'post';

      await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: formData,
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'staff'
      });
      setIsEditing(false);
      setEditId(null);
      fetchUsers(token);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || 'staff',
      password: ''
    });
    setIsEditing(true);
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      const token = localStorage.getItem('token');

      try {
        await axios.delete(`http://localhost:8000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        fetchUsers(token);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">إدارة المستخدمين</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label>الاسم</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label>كلمة المرور</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border rounded"
                  required={!isEditing}
                />
              </div>

              <div>
                <label>الدور</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="admin">مدير</option>
                  <option value="doctor">طبيب</option>
                  <option value="staff">موظف</option>
                </select>
              </div>
              
              <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                {isEditing ? 'تحديث' : 'إضافة'}
              </button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">قائمة المستخدمين</h2>
            <table className="w-full text-right">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الدور</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleEdit(user)} className="text-blue-600 mr-2">تعديل</button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-600">حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
