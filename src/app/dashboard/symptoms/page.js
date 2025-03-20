'use client';
import Crud from '@/app/components/Crud';
import AdminLayout from '@/app/components/layout/AdminLayout';

const SymptomPage = () => {
   
    return (
        <AdminLayout>
            <Crud
                apiUrl="symptoms" 
                columns={['name', 'description', 'severity']}
            />
        </AdminLayout>
    );
};

export default SymptomPage;

