'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/layout/AdminLayout';

export default function ConsultationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    gender: 'male',
    symptoms: [],
    description: ''
  });
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/symptoms');
      const data = await response.json();
      setAvailableSymptoms(data);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }
  };

  const handleSymptomToggle = (symptomId) => {
    setFormData(prev => {
      const symptoms = prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(id => id !== symptomId)
        : [...prev.symptoms, symptomId];
      return { ...prev, symptoms };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (response.ok) {
        router.push('/dashboard/cases');
      } else {
        const data = await response.json();
        setError(data.message || 'حدث خطأ في إرسال الحالة');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error('Error submitting case:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">تسجيل حالة جديدة</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم المريض</label>
            <input
              type="text"
              value={formData.patient_name}
              onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العمر</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الجنس</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الأعراض</label>
            <div className="border border-gray-300 rounded-md p-4 grid grid-cols-2 gap-4">
              {availableSymptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`symptom-${symptom.id}`}
                    checked={formData.symptoms.includes(symptom.id)}
                    onChange={() => handleSymptomToggle(symptom.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`symptom-${symptom.id}`}
                    className="mr-2 block text-sm text-gray-900"
                  >
                    {symptom.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">وصف الحالة</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              إرسال الحالة
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}