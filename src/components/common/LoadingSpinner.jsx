// src/components/common/LoadingSpinner.jsx
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center bg-gray-900 h-screen">
      <div className="mt-[-350px]" data-testid="loading-spinner">
        <ClipLoader color={'#3949AB'} loading={loading} size={50} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
