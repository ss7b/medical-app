import AdminLayout from '@/app/components/layout/AdminLayout';
import Crud from '@/app/components/Crud';

export default function DiseasesPage() {
  return (
    <AdminLayout>
      <Crud
          apiUrl="diseases" 
          columns={[
            'name',
             'description',
              'causes', 
              'treatments',
               'affected_countries',
               'symptoms',
               'reference',
               ]}
      />
    </AdminLayout>
  );
}
