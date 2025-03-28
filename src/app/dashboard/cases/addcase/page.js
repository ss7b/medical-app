"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/layout/AdminLayout";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import url from "@/conf";

const SubmitCasePage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        patient_name: "",
        symptoms: [],
        identity_type: "",
        nationality: "",
        birth_date: "",
        gender: "",
        visit_type: "",
        location: "",
    });

    const [symptomsList, setSymptomsList] = useState([]);
    const [filteredSymptoms, setFilteredSymptoms] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token") || "");
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
                headers: { Authorization: `Bearer ${token}` },
            });
            setSymptomsList(response.data);
            setFilteredSymptoms(response.data);
        } catch (error) {
            toast.error("خطأ في جلب الأعراض.");
        }
    };

    const handleAnalyzeSymptoms = async () => {
        try {
            const response = await axios.post(
                `${url}analyze-symptoms`,
                { symptoms: formData.symptoms },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const filteredResults = response.data.disease_analysis.filter(result =>
                ["Medium", "High"].includes(result.probability)
            );

            localStorage.setItem("formData", JSON.stringify(formData));
            localStorage.setItem("analysisResult", JSON.stringify(filteredResults));

            router.push("/dashboard/cases/result");
        } catch (error) {
            toast.error("خطأ أثناء تحليل الأعراض.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredSymptoms(symptomsList.filter(symptom => symptom.name.toLowerCase().includes(term)));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedSymptoms = Array.from(filteredSymptoms);
        const [movedItem] = reorderedSymptoms.splice(result.source.index, 1);
        reorderedSymptoms.splice(result.destination.index, 0, movedItem);

        setFilteredSymptoms(reorderedSymptoms);
    };

    const handleSymptomSelect = (symptomId) => {
        setFormData((prevState) => ({
            ...prevState,
            symptoms: prevState.symptoms.includes(symptomId)
                ? prevState.symptoms.filter((id) => id !== symptomId)
                : [...prevState.symptoms, symptomId],
        }));
    };

    return (
        <AdminLayout>
            <Toaster />
            <form>
                <TextField name="patient_name" label="اسم المريض" value={formData.patient_name} onChange={handleChange} fullWidth margin="dense" />
                
                <FormControl fullWidth margin="dense">
                    <InputLabel>نوع الهوية</InputLabel>
                    <Select name="identity_type" value={formData.identity_type} onChange={handleChange}>
                        <MenuItem value="بطاقة">بطاقة</MenuItem>
                        <MenuItem value="اقامة">اقامة</MenuItem>
                        <MenuItem value="جواز">جواز</MenuItem>
                        <MenuItem value="تأشيرة">تأشيرة</MenuItem>
                    </Select>
                </FormControl>

                <TextField name="nationality" label="الجنسية" value={formData.nationality} onChange={handleChange} fullWidth margin="dense" />

                <TextField name="birth_date" label="تاريخ الميلاد" type="date" value={formData.birth_date} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />

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

                <TextField label="بحث عن الأعراض" variant="outlined" fullWidth margin="dense" value={searchTerm} onChange={handleSearch} />

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="symptoms-list">
                        {(provided) => (
                            <Grid container spacing={2} {...provided.droppableProps} ref={provided.innerRef}>
                                {filteredSymptoms.map((symptom, index) => (
                                    <Draggable key={symptom.id} draggableId={symptom.id.toString()} index={index}>
                                        {(provided) => (
                                            <Grid
                                                item
                                                xs={6} sm={6} md={4}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Button
                                                    variant={formData.symptoms.includes(symptom.id) ? "contained" : "outlined"}
                                                    fullWidth
                                                    onClick={() => handleSymptomSelect(symptom.id)}
                                                >
                                                    {symptom.name}
                                                </Button>
                                            </Grid>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Grid>
                        )}
                    </Droppable>
                </DragDropContext>

                <Button variant="contained" color="primary" fullWidth onClick={handleAnalyzeSymptoms} sx={{ marginTop: 2 }}>
                    تحليل الأعراض
                </Button>
            </form>
        </AdminLayout>
    );
};

export default SubmitCasePage;
