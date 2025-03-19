
import { useParams, useNavigate } from 'react-router-dom';
import { SDSForm } from '../components/forms/SDSForm';
import { Navbar } from '../components/Navbar';

export default function SDSSubmission() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleComplete = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <SDSForm 
            requestId={requestId} 
            onBack={handleBack}
            onComplete={handleComplete}
          />
        </div>
      </main>
    </div>
  );
}
