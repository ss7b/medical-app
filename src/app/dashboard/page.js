'use client';

import AdminLayout from '../components/layout/AdminLayout';

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">لوحة التحكم</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-blue-700">الحالات</h2>
            <p className="text-3xl font-bold text-blue-900 mt-2">0</p>
            <p className="text-sm text-blue-600 mt-1">إجمالي الحالات</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-green-700">الأعراض</h2>
            <p className="text-3xl font-bold text-green-900 mt-2">0</p>
            <p className="text-sm text-green-600 mt-1">إجمالي الأعراض</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-purple-700">الأمراض</h2>
            <p className="text-3xl font-bold text-purple-900 mt-2">0</p>
            <p className="text-sm text-purple-600 mt-1">إجمالي الأمراض</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-yellow-700">المستخدمين</h2>
            <p className="text-3xl font-bold text-yellow-900 mt-2">0</p>
            <p className="text-sm text-yellow-600 mt-1">إجمالي المستخدمين</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">آخر الحالات</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              <li className="px-6 py-4">
                <p className="text-gray-500 text-sm">لا توجد حالات حالياً</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}