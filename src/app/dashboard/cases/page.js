'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import url from '@/conf';
import Link from 'next/link';

const CasesPage = () => {
    const [data, setData] = useState([]);
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
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [token, setToken] = useState('');
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token') || '');
        }
    }, []);

    const link = `${url}patient-cases`;

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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            setFormData({
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
            setIsEditing(false);
            setEditId(null);
            fetchData();
            handleClose();
        } catch (error) {
            toast.error("خطأ أثناء حفظ البيانات.");
        }
    };

    const handleEdit = async (item) => {
        try {
            const response = await axios.get(`${link}/${item.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData(response.data);
            setIsEditing(true);
            setEditId(item.id);
            setOpen(true);
        } catch (error) {
            toast.error("خطأ في جلب البيانات للتعديل.");
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setFormData({
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
        setIsEditing(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMenuOpen = (event, item) => {
        setAnchorEl(event.currentTarget);
        setEditId(item.id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const filteredData = data.filter(item =>
        ['patient_name', 'identity_type', 'nationality', 'gender', 'visit_type', 'location'].some(col => {
            const value = item[col];
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
    );

    return (
        <AdminLayout>
            <Toaster />
            {/* <Button onClick={handleClickOpen}>إضافة حالة</Button> */}

            <Link href="cases/addcase" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            تسجيل حالة جديدة
          </Link>
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
                            <TableCell>اسم المريض</TableCell>
                            <TableCell>نوع الهوية</TableCell>
                            <TableCell>الجنسية</TableCell>
                            <TableCell>تاريخ الميلاد</TableCell>
                            <TableCell>الجنس</TableCell>
                            <TableCell>نوع الزيارة</TableCell>
                            <TableCell>الموقع</TableCell>
                            <TableCell>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{item.patient_name}</TableCell>
                                <TableCell>{item.identity_type}</TableCell>
                                <TableCell>{item.nationality}</TableCell>
                                <TableCell>{item.birth_date}</TableCell>
                                <TableCell>{item.gender}</TableCell>
                                <TableCell>{item.visit_type}</TableCell>
                                <TableCell>{item.location}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(event) => handleMenuOpen(event, item)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && editId === item.id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => { handleEdit(item); handleMenuClose(); }}>تعديل</MenuItem>
                                        <MenuItem onClick={() => { handleDelete(item.id); handleMenuClose(); }}>حذف </MenuItem>
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
                        {['patient_name', 'identity_type', 'nationality', 'birth_date', 'gender', 'visit_type', 'location'].map((col) => (
                            <TextField
                                key={col}
                                name={col}
                                label={col}
                                value={formData[col] || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                            />
                        ))}
                        <DialogActions>
                            <Button onClick={handleClose}>إغلاق</Button>
                            <Button
                                type="submit"
                            >
                                {isEditing ? 'تعديل' : 'إضافة'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default CasesPage;