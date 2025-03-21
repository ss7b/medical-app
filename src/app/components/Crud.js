'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/txa';
import url from '@/conf';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper,
  Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Crud = ({ apiUrl, columns }) => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState('');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token') || '');
    }
  }, []);

  const link = `${url}${apiUrl}`;
  console.log(link);

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
      setFormData({});
      setIsEditing(false);
      setEditId(null);
      fetchData();
      handleClose();
    } catch (error) {
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
    setFormData({});
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const filteredData = data.filter(item =>
    columns.some(col => item[col].toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <Toaster />
      
      <div style={{ marginBottom: '20px' }}>
        <Button onClick={handleClickOpen}>إضافة</Button>
      </div>

      <Input
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="بحث..."
        className="mb-4"
      />

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => <TableCell key={col}>{col}</TableCell>)}
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
              <TableRow key={item.id}>
                {columns.map(col => (
                  <TableCell key={col}>{item[col]}</TableCell>
                ))}
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
            {columns.map((col) => (
              <div key={col}>
                {col === 'description' ? (
                  <Textarea
                    name={col}
                    value={formData[col] || ''}
                    onChange={handleChange}
                    placeholder={`أدخل ${col}`}
                  />
                ) : (
                  <Input
                    name={col}
                    value={formData[col] || ''}
                    onChange={handleChange}
                    placeholder={`أدخل ${col}`}
                  />
                )}
              </div>
            ))}
            <DialogActions>
              <Button onClick={handleClose}>إغلاق</Button>
              <Button type="submit">{isEditing ? 'تعديل' : 'إضافة'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Crud;
