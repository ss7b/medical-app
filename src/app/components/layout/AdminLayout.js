'use client';
import { useState } from 'react';
import Link from 'next/link';
import Notifications from '../Notifications';

export default function AdminLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-row-reverse bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 p-4 bg-blue-600 text-white text-xl font-bold">
            <Link href="/dashboard">لوحة التحكم الطبية</Link>
          </div>
          <div className="flex flex-col py-4">
            <Link href="/dashboard/symptoms" className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md text-lg">
              الأعراض
            </Link>
            <Link href="/dashboard/diseases" className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md text-lg">
              الأمراض
            </Link>
            <Link href="/dashboard/cases" className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md text-lg">
              الحالات
            </Link>
            <Link href="/dashboard/users" className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md text-lg">
              المستخدمين
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Notifications and User menu */}
              <div className="flex items-center space-x-4">
                <Notifications />
                <div className="ml-3 relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none"
                  >
                    <span className="sr-only">فتح قائمة المستخدم</span>
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                  </button>
                  {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        ملفي الشخصي
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        الإعدادات
                      </Link>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Section */}
        <main className=" py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
