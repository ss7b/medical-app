"use client"
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import url from '@/conf';

const SubmitCasePage = () => {
    const [formData, setFormData] = useState({
        patient_name: '',
        symptoms: [],
        identity_type: '',
        nationality: '',
        birth_date: '',
        gender: '',
        visit_type: '',
        location: '',
        doctor_id: ''
    });
    const [symptomsList, setSymptomsList] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [resultDialogOpen, setResultDialogOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [token, setToken] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token') || '');
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchSymptoms();
        }
    }, [token]);

    const fetchSymptoms = async () => {
        try {
            const response = await axios.get(`${url}symptoms`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSymptomsList(response.data);
        } catch (error) {
            toast.error("خطأ في جلب الأعراض.");
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get(`${url}users?role=doctor`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctorsList(response.data);
        } catch (error) {
            toast.error("خطأ في جلب الأطباء.");
        }
    };

    const handleAnalyzeSymptoms = async () => {
        try {
            const response = await axios.post(`${url}analyze-symptoms`, { symptoms: formData.symptoms }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalysisResult(response.data.disease_analysis);
            setResultDialogOpen(true);
            fetchDoctors();
        } catch (error) {
            toast.error("خطأ أثناء تحليل الأعراض.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${url}patient-cases`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("تم حفظ الحالة بنجاح.");
        } catch (error) {
            toast.error("خطأ أثناء حفظ الحالة.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSymptomChange = (e) => {
        const { value, checked } = e.target;
        const symptomId = parseInt(value);

        setFormData((prevState) => ({
            ...prevState,
            symptoms: checked
                ? [...prevState.symptoms, symptomId]
                : prevState.symptoms.filter((symptom) => symptom !== symptomId)
        }));
    };

    const handleDialogClose = () => {
        setResultDialogOpen(false);
    };

    return (
        <AdminLayout>
            <Toaster />
            <form onSubmit={handleSubmit}>
                <TextField
                    name="patient_name"
                    label="اسم المريض"
                    value={formData.patient_name}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>نوع الهوية</InputLabel>
                    <Select name="identity_type" value={formData.identity_type} onChange={handleChange}>
                        <MenuItem value="بطاقة">بطاقة</MenuItem>
                        <MenuItem value="اقامة">اقامة</MenuItem>
                        <MenuItem value="جواز">جواز</MenuItem>
                        <MenuItem value="تأشيرة">تأشيرة</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    name="nationality"
                    label="الجنسية"
                    value={formData.nationality}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="birth_date"
                    label="تاريخ الميلاد"
                    type="date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>الجنس</InputLabel>
                    <Select name="gender" value={formData.gender} onChange={handleChange}>
                        <MenuItem value="ذكر">ذكر</MenuItem>
                        <MenuItem value="انثى">انثى</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel>نوع الزيارة</InputLabel>
                    <Select name="visit_type" value={formData.visit_type} onChange={handleChange}>
                        <MenuItem value="مسافر">مسافر</MenuItem>
                        <MenuItem value="حاج">حاج</MenuItem>
                        <MenuItem value="معتمر">معتمر</MenuItem>
                        <MenuItem value="ترانزيت">ترانزيت</MenuItem>
                        <MenuItem value="عامل موسمي">عامل موسمي</MenuItem>
                        <MenuItem value="مقيم">مقيم</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel>الموقع</InputLabel>
                    <Select name="location" value={formData.location} onChange={handleChange}>
                        <MenuItem value="صالة A">صالة A</MenuItem>
                        <MenuItem value="صالة E">صالة E</MenuItem>
                        <MenuItem value="الصالة الشمالية">الصالة الشمالية</MenuItem>
                        <MenuItem value="صالة الحج والعمرة">صالة الحج والعمرة</MenuItem>
                    </Select>
                </FormControl>

                

                <FormGroup>
                    {symptomsList.map((symptom) => (
                        <FormControlLabel
                            key={symptom.id}
                            control={
                                <Checkbox
                                    value={symptom.id}
                                    checked={formData.symptoms.includes(symptom.id)}
                                    onChange={handleSymptomChange}
                                />
                            }
                            label={symptom.name}
                        />
                    ))}
                </FormGroup>

                <Button onClick={handleAnalyzeSymptoms}>تحليل الأعراض</Button>
            </form>
            <Dialog open={resultDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>نتيجة التحليل</DialogTitle>
                <DialogContent>
                    {analysisResult && analysisResult.map((result, index) => (
                        <div key={index}>
                            <p>المرض: {result.disease.name}</p>
                            <p>النقاط: {result.total_points}</p>
                            <p>الاحتمالية: {result.probability}</p>
                        </div>
                    ))}
                    <FormControl fullWidth margin="dense">
                    <InputLabel>اختر الطبيب</InputLabel>
                    <Select name="doctor_id" value={formData.doctor_id} onChange={handleChange}>
                        {doctorsList.map((doctor) => (
                            <MenuItem key={doctor.id} value={doctor.id}>{doctor.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>إغلاق</Button>
                    <Button type="submit">حفظ الحالة</Button>

                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
};

export default SubmitCasePage;
