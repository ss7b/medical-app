'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/txa';
import url from '@/conf';

const Crud = ({ apiUrl, columns }) => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const link = `${url}${apiUrl}`;
    console.log(link)
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
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Toaster />
            <form onSubmit={handleSubmit} className="mb-4">
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
                <Button type="submit">{isEditing ? 'تعديل' : 'إضافة'}</Button>
            </form>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        {columns.map(col => <th key={col}>{col}</th>)}
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            {columns.map(col => (
                                <td key={col}>{item[col]}</td>
                            ))}
                            <td>
                                <Button onClick={() => handleEdit(item)}>تعديل</Button>
                                <Button onClick={() => handleDelete(item.id)}>حذف</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Crud;
