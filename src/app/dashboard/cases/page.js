'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cases', {
        credentials: 'include'
      });
      const data = await response.json();
      setCases(data);
    } catch (error) {
      setError('حدث خطأ في جلب البيانات');
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (caseId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/cases/${caseId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (response.ok) {
        fetchCases();
      }
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">إدارة الحالات المرضية</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المريض</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العمر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجنس</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأعراض</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.map((case_) => (
                <tr key={case_.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{case_.patient_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{case_.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {case_.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      {case_.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom.name}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      case_.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      case_.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      case_.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {case_.status === 'pending' ? 'قيد الانتظار' :
                       case_.status === 'in_progress' ? 'قيد المعالجة' :
                       case_.status === 'completed' ? 'مكتمل' : 'غير معروف'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={case_.status}
                      onChange={(e) => handleStatusUpdate(case_.id, e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="in_progress">قيد المعالجة</option>
                      <option value="completed">مكتمل</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}