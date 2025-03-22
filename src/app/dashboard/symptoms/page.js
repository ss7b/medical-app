'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/layout/AdminLayout';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import url from '@/conf';

const SymptomPage = () => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' }); // Removed severity
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

    const link = `${url}symptoms`;

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
            setFormData({ name: '', description: '' }); // Removed severity
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
            setFormData(response.data); // Set formData with the fetched data
            setIsEditing(true);
            setEditId(item.id); // Ensure item.id is defined
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
            fetchData(); // Refresh data after deletion
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
        setFormData({ name: '', description: '', severity: '' });
        setIsEditing(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMenuOpen = (event, item) => {
        setAnchorEl(event.currentTarget);
        setEditId(item.id); // Ensure the current item's id is set for editing
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
        ['name', 'description'].some(col => { // Removed severity
            const value = item[col];
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
    );

    return (
        <AdminLayout>
            <Toaster />
            <Button onClick={handleClickOpen}>إضافة عرض</Button>
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
                            <TableCell>الاسم</TableCell>
                            <TableCell>الوصف</TableCell>
                            <TableCell>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(event) => handleMenuOpen(event, item)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && editId === item.id} // Ensure menu opens for the correct item
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
                        {['name', 'description'].map((col) => ( // Removed severity
                            <TextField
                                key={col}
                                name={col}
                                label={col}
                                value={formData[col] || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                multiline={col === 'description'}
                                rows={col === 'description' ? 4 : 1}
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

export default SymptomPage;
