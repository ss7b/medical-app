'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Menu, MenuItem, IconButton, Checkbox, FormControlLabel, Autocomplete } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import url from '@/conf';

const DiseasesPage = () => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', causes: '', treatments: '', affected_countries: [], symptoms: [] });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [token, setToken] = useState('');
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [availableSymptoms, setAvailableSymptoms] = useState([]);
    const [availableCountries, setAvailableCountries] = useState([]); // New state for countries

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token') || '');
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchData();
            fetchSymptoms();
            fetchCountries(); // Fetch countries
        }
    }, [token]);

    const link = `${url}diseases`;

    const fetchData = async () => {
        try {
            const response = await axios.get(link, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            toast.error("خطأ في جلب البيانات.");
        }
    };

    const fetchSymptoms = async () => {
        try {
            const response = await axios.get(`${url}symptoms`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAvailableSymptoms(response.data);
        } catch (error) {
            toast.error("خطأ في جلب الأعراض.");
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all'); // External API for countries
            const countries = response.data.map(country => ({
                name: country.name.common,
                code: country.cca2
            }));
            setAvailableCountries(countries);
        } catch (error) {
            toast.error("خطأ في جلب الدول.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData); // Debugging line
        try {
            if (isEditing) {
                await axios.put(`${link}/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("تم تعديل البيانات بنجاح.");
            } else {
                await axios.post(link, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("تمت إضافة البيانات بنجاح.");
            }
            setFormData({ name: '', description: '', causes: '', treatments: '', affected_countries: [], symptoms: [] });
            setIsEditing(false);
            setEditId(null);
            fetchData();
            handleClose();
        } catch (error) {
            console.error("Error:", error); // Debugging line
            toast.error("خطأ أثناء حفظ البيانات.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${link}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("تم الحذف بنجاح.");
            fetchData();
        } catch (error) {
            toast.error("خطأ أثناء الحذف.");
        }
    };

    const handleEdit = (item) => {
        setFormData(item);
        setIsEditing(true);
        setEditId(item.id);
        setOpen(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSymptomChange = (symptomId, points) => {
        const updatedSymptoms = formData.symptoms.map(symptom => 
            symptom.id === symptomId ? { ...symptom, points } : symptom
        );
        setFormData({ ...formData, symptoms: updatedSymptoms });
    };

    const handleSymptomToggle = (symptomId) => {
        const exists = formData.symptoms.some(symptom => symptom.id === symptomId);
        const updatedSymptoms = exists 
            ? formData.symptoms.filter(symptom => symptom.id !== symptomId)
            : [...formData.symptoms, { id: symptomId, points: 0 }];
        setFormData({ ...formData, symptoms: updatedSymptoms });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClickOpen = () => {
        setFormData({ name: '', description: '', causes: '', treatments: '', affected_countries: [], symptoms: [] });
        setIsEditing(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const filteredData = data.filter(item =>
        ['name', 'description', 'causes', 'treatments', 'affected_countries'].some(col => item[col].toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout>
            <Toaster />
            <Button onClick={handleClickOpen}>إضافة مرض</Button>
            <TextField
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="بحث..."
                fullWidth
                margin="normal"
            />
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['name', 'description', 'causes', 'treatments', 'affected_countries'].map(col => <TableCell key={col}>{col}</TableCell>)}
                            <TableCell>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
                            <TableRow key={item.id}>
                                {['name', 'description', 'causes', 'treatments'].map(col => (
                                    <TableCell key={col}>{item[col]}</TableCell>
                                ))}
                                <TableCell>
                                    {item.affected_countries.map(country => country.name).join(', ')}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={handleMenuOpen}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => { handleEdit(item); handleMenuClose(); }}>تعديل</MenuItem>
                                        <MenuItem onClick={() => { handleDelete(item.id); handleMenuClose(); }}>حذف</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? 'تعديل البيانات' : 'إضافة بيانات جديدة'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        {['name', 'description', 'causes', 'treatments'].map((col) => (
                            <TextField
                                key={col}
                                name={col}
                                label={col}
                                value={formData[col] || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                multiline={col === 'description' || col === 'causes' || col === 'treatments'}
                                rows={col === 'description' || col === 'causes' || col === 'treatments' ? 4 : 1}
                            />
                        ))}
                        <Autocomplete
                            multiple
                            options={availableCountries}
                            getOptionLabel={(option) => option.name}
                            value={formData.affected_countries}
                            onChange={(event, newValue) => {
                                setFormData({ ...formData, affected_countries: newValue });
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="الدول المتأثرة" placeholder="اختر الدول" margin="dense" />
                            )}
                        />
                        <div>
                            <h3>الأعراض</h3>
                            {availableSymptoms.map(symptom => (
                                <div key={symptom.id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.symptoms.some(s => s.id === symptom.id)}
                                                onChange={() => handleSymptomToggle(symptom.id)}
                                            />
                                        }
                                        label={symptom.name}
                                    />
                                    {formData.symptoms.some(s => s.id === symptom.id) && (
                                        <TextField
                                            type="number"
                                            label="النقاط"
                                            value={formData.symptoms.find(s => s.id === symptom.id).points}
                                            onChange={(e) => handleSymptomChange(symptom.id, e.target.value)}
                                            margin="dense"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <DialogActions>
                            <Button onClick={handleClose}>إغلاق</Button>
                            <Button type="submit">{isEditing ? 'تعديل' : 'إضافة'}</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default DiseasesPage;
