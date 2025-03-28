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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import url from "@/conf";
import Link from "next/link";
import { Healing} from '@mui/icons-material'; // Import an icon from Material-UI
import BackHandIcon from '@mui/icons-material/BackHand';


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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || '');
      setFormData(JSON.parse(localStorage.getItem("formData")));
      setAnalysisResult(JSON.parse(localStorage.getItem("analysisResult")));
    }
  }, []);

  const getProgressGradient = () => {
    return `linear-gradient(to left, 
      rgba(76, 175, 80, 0.2) 0%,   
      rgba(255, 235, 59, 0.2) 50%, 
      rgba(244, 67, 54, 0.2) 100%  
    )`;
  };
  
  const getActiveGradient = (percentage) => {
    return `linear-gradient(to left, 
      ${percentage >= 0 ? "#4caf50" : "transparent"} 0%,  
      ${percentage >= 50 ? "#ffeb3b" : "transparent"} 50%, 
      ${percentage >= 80 ? "#f44336" : "transparent"} 100% 
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

  const handleOpenDialog = (disease) => {
    setSelectedDisease(disease);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDisease(null);
  };

  const getIsolationColor = (description) => {
      if (description.includes('العزل الهوائي')) {
          return '#007bff'; // Blue
      } else if (description.includes('العزل التلامسي')) {
          return '#4caf50'; // Green
      } else if (description.includes('العزل الرذاذي')) {
          return '#8b4513'; // Brown
      } else {
          return '#f0f0f0'; // Default color
      }
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6">المرض: {result.disease.name}</Typography>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: getIsolationColor(result.disease.description),
                      clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mr: 2
                    }}>
                      <BackHandIcon onClick={() => handleOpenDialog(result.disease)} />
                    </Box>
                  </Box>
                  <Typography>النقاط: {result.total_points}</Typography>
                  <Typography>الاحتمالية: {result.probability}</Typography>

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
                        "&::after": {
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

                    <Box sx={{
                      height: 15,
                      borderRadius: 5,
                      background: getProgressGradient(),
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      <Box
                        sx={{
                          width: `${result.percentage}%`,
                          height: "100%",
                          background: getActiveGradient(result.percentage),
                          transition: "width 0.5s ease-in-out",
                        }}
                      />
                    </Box>

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

      {/* Dialog لعرض تفاصيل المرض */}
      {selectedDisease && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle sx={{ backgroundColor: getIsolationColor(selectedDisease.description), color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BackHandIcon sx={{ mr: 1 }} />
                    تفاصيل المرض: {selectedDisease.name}
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, mb: 2,mt: 2, backgroundColor: '#e3f2fd' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Healing sx={{ mr: 1 }} /> الوصف (العزل):
                    </Typography>
                    <Typography>{selectedDisease.description || "لا يوجد تفاصيل إضافية"}</Typography>
                </Box>
                <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, mb: 2, backgroundColor: '#e8f5e9' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Healing sx={{ mr: 1 }} /> طرق التعامل مع الحالة :
                    </Typography>
                    <Typography>{selectedDisease.causes || "لا يوجد تفاصيل"}</Typography>
                </Box>
                <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, backgroundColor: '#fff3e0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Healing sx={{ mr: 1 }} /> طرق الوقاية (الإحتياطات):
                    </Typography>
                    <Typography>{selectedDisease.treatments || "لا توجد احتياطات محددة"}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} sx={{ fontWeight: 'bold', color: '#007bff' }}>إغلاق</Button>
            </DialogActions>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default ResultPage;
