"use client";
import React, { useState, useEffect } from 'react';
import AdminLayout from "@/app/components/layout/AdminLayout";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Tooltip,
  Grid,
} from "@mui/material";
import url from "@/conf";
import Link from "next/link";
// import { Hand } from "lucide-react"; // استيراد أيقونة اليد



const ResultPage = () => {
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
    const [analysisResult, setAnalysisResult] = useState([]);
  const [token, setToken] = useState({});
  console.log(formData);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token') || '');
            setFormData(JSON.parse(localStorage.getItem("formData")));
            setAnalysisResult(JSON.parse(localStorage.getItem("analysisResult")));
        }
    }, []);

    const getProgressGradient = () => {
        return `linear-gradient(to left, 
          rgba(76, 175, 80, 0.2) 0%,   /* أخضر فاتح */
          rgba(255, 235, 59, 0.2) 50%, /* أصفر فاتح */
          rgba(244, 67, 54, 0.2) 100%  /* أحمر فاتح */
        )`;
      };
      
      const getActiveGradient = (percentage) => {
        return `linear-gradient(to left, 
          ${percentage >= 0 ? "#4caf50" : "transparent"} 0%,  /* أخضر غامق */
          ${percentage >= 50 ? "#ffeb3b" : "transparent"} 50%, /* أصفر غامق */
          ${percentage >= 80 ? "#f44336" : "transparent"} 100% /* أحمر غامق */
        )`;
      };
      
  const handleSaveCase = async () => {
    try {
      await axios.post(
        `${url}patient-cases`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("تم حفظ الحالة بنجاح.");
      localStorage.removeItem("formData");
      localStorage.removeItem("analysisResult");
      
      router.push("/dashboard/cases/addcase");
    } catch (error) {
      toast.error("خطأ أثناء حفظ الحالة.");
    }
  };

  const handleReturn = () => {
    localStorage.removeItem("formData");
    localStorage.removeItem("analysisResult");
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          نتيجة التحليل
        </Typography>
        <Card sx={{ mb: 3, p: 2 }}>
          <CardContent>
            <Typography variant="h6">معلومات المريض</Typography>
            <Typography>اسم المريض: {formData.patient_name}</Typography>
            <Typography>نوع الهوية: {formData.identity_type}</Typography>
            <Typography>الجنسية: {formData.nationality}</Typography>
            <Typography>تاريخ الميلاد: {formData.birth_date}</Typography>
            <Typography>الجنس: {formData.gender}</Typography>
            <Typography>نوع الزيارة: {formData.visit_type}</Typography>
            <Typography>الموقع: {formData.location}</Typography>
          </CardContent>
        </Card>

        <Typography variant="h5" gutterBottom>
          تحليل الأمراض
        </Typography>
        <Grid container spacing={2}>
            {analysisResult.map((result, index) => (
                <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ position: "relative", p: 2 }}>
                        <CardContent>
                        {/* أيقونة اليد مع خلفية سداسية */}
                        <Box sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            width: 40,
                            height: 40,
                            background: "#f0f0f0",
                            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                          
                        </Box>

                        <Typography variant="h6">المرض: {result.disease.name}</Typography>
                        <Typography>النقاط: {result.total_points}</Typography>
                        <Typography>الاحتمالية: {result.probability}</Typography>

                        {/* النسبة المئوية فوق المؤشر */}
                        <Box sx={{ position: "relative", mt: 2 }}>
                            <Tooltip title={`${result.percentage.toFixed(2)}%`} arrow>
                            <Box sx={{
                                position: "absolute",
                                right: `${result.percentage}%`,
                                transform: "translateX(100%)",
                                top: -30,
                                background: "#333",
                                color: "#fff",
                                padding: "6px 10px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                                "&::after": { // السهم المثلث
                                content: '""',
                                position: "absolute",
                                bottom: -6,
                                left: "50%",
                                transform: "translateX(-50%)",
                                borderLeft: "6px solid transparent",
                                borderRight: "6px solid transparent",
                                borderTop: "6px solid #333",
                                }
                            }}>
                                {result.percentage.toFixed(2)}%
                            </Box>
                            </Tooltip>

                            {/* الشريط الخلفي (الثابت) */}
                            <Box sx={{
                            height: 15,
                            borderRadius: 5,
                            background: getProgressGradient(),
                            position: "relative",
                            overflow: "hidden"
                            }}>
                            {/* الشريط المتحرك (المؤشر الحقيقي) */}
                            <Box
                                sx={{
                                width: `${result.percentage}%`,
                                height: "100%",
                                background: getActiveGradient(result.percentage),
                                transition: "width 0.5s ease-in-out",
                                }}
                            />
                            </Box>

                            {/* تقسيم الشريط إلى 3 أقسام (منخفض - متوسط - مرتفع) */}
                            <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 1,
                            fontSize: "12px",
                            color: "#777"
                            }}>
                            <Typography>منخفض</Typography>
                            <Typography>متوسط</Typography>
                            <Typography>مرتفع</Typography>
                            </Box>
                        </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>



        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSaveCase}>
            حفظ الحالة
          </Button>
          <Button component={Link} href="/dashboard/cases/addcase" color="secondary" onClick={handleReturn}>
            الرجوع
          </Button>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default ResultPage;
