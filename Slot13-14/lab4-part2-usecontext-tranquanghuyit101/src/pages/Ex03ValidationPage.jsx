import { FormProvider } from '../context/FormContext';
import RegistrationForm from '../components/form/RegistrationForm';

export default function Ex03ValidationPage() {
  return (
    <FormProvider>
      <div style={{ padding: '2rem' }}>
        <h2>Đăng ký</h2>
        <RegistrationForm />
      </div>
    </FormProvider>
  );
}
