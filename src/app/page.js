'use client';

import AdminLayout from './components/layout/AdminLayout';

export default function Home() {
  return (
    <AdminLayout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">مرحباً بك في نظام التشخيص الطبي</h1>
        <p className="text-lg text-gray-600 mb-8">نظام متكامل لإدارة الحالات الطبية والتشخيص المبدئي</p>
        <div className="flex justify-center space-x-4">
          <a href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            الدخول إلى لوحة التحكم
          </a>
          <a href="/consultationForm" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            تسجيل حالة جديدة
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
