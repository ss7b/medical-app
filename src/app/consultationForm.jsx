"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import Select from 'react-select';

const symptomsList = [
    { value: 'حمى', label: 'حمى' },
    { value: 'صداع', label: 'صداع' },
    { value: 'ألم في البطن', label: 'ألم في البطن' },
    { value: 'سعال', label: 'سعال' },
    { value: 'دوار', label: 'دوار' },
];

const genderOptions = [
    { value: 'ذكر', label: 'ذكر' },
    { value: 'أنثى', label: 'أنثى' },
];

const diseasesData = {
    'حمى التيفوئيد': ['حمى', 'ألم في البطن'],
    'نزلة برد': ['حمى', 'سعال', 'صداع'],
    'التهاب المعدة': ['ألم في البطن', 'دوار'],
};

export default function ConsultationForm() {
    const [userData, setUserData] = useState({ name: '', age: '', gender: null });
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleGenderChange = (selectedOption) => {
        setUserData({ ...userData, gender: selectedOption });
    };

    const handleSubmit = () => {
        const selectedSymptomsValues = selectedSymptoms.map(symptom => symptom.value);
        const matchedDiseases = Object.entries(diseasesData).filter(([, symptoms]) =>
            selectedSymptomsValues.every((symptom) => symptoms.includes(symptom))
        ).map(([disease]) => disease);
        setResult(matchedDiseases);
    };

    return (
        <div className="p-6">
            <Card className="p-4 mb-6">
                <CardContent>
                    <h2 className="text-xl mb-4">إدخال بيانات المستخدم</h2>
                    <input name="name" placeholder="الاسم" value={userData.name} onChange={handleInputChange} className="border p-2 mb-2 w-full" />
                    <input name="age" placeholder="العمر" value={userData.age} onChange={handleInputChange} className="border p-2 mb-2 w-full" />
                    <Select
                        options={genderOptions}
                        onChange={handleGenderChange}
                        placeholder="اختر الجنس..."
                        isClearable
                        className="mb-4"
                    />
                </CardContent>
            </Card>

            <Card className="p-4 mb-6">
                <CardContent>
                    <h2 className="text-xl mb-4">اختيار الأعراض</h2>
                    <Select
                        isMulti
                        options={symptomsList}
                        onChange={setSelectedSymptoms}
                        placeholder="ابحث واختر الأعراض..."
                        className="mb-4"
                    />
                </CardContent>
            </Card>

            <Button onClick={handleSubmit} className="mb-6">عرض النتيجة</Button>

            {result && (
                <Card className="p-4">
                    <CardContent>
                        <h2 className="text-xl mb-4">النتيجة:</h2>
                        {result.length > 0 ? (
                            <ul>
                                {result.map((disease) => (
                                    <li key={disease}>{disease}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>لم يتم العثور على مرض مطابق للأعراض.</p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
