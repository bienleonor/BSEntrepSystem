import { useState } from "react";
import { getUserId } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import landingImage from '../../assets/landing.png';


export default function AccessCode() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || code.trim() === "") {
      toast.error('Please enter the business code.');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      toast.error('You must be logged in to join a business.');
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post('/access-code/enter', {
        user_id: userId,
        code: code.trim()
      });

      const result = res.data;
      if (result && result.success) {
        // store selected business id so other pages know the context
        if (result.business_id) {
          localStorage.setItem('selectedBusinessId', result.business_id);
        }

        toast.success(result.message || 'Joined business successfully!');
        setCode('');
        setTimeout(() => navigate('/inventory'), 700);
      } else {
        toast.error(result.message || 'Failed to join business');
      }
    } catch (err) {
      console.error('Enter access code error:', err);
      const msg = err?.response?.data?.message || 'Server error';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <div
        className="min-h-screen w-full bg-cover bg-center bg-fixed flex flex-col items-center justify-center px-6"
        style={{ backgroundImage: `url(${landingImage})` }}
      >
        <div className="bg-bronze p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-lg">
          <h2 className="text-4xl font-bold mb-4 text-center text-white">Enter Business Code</h2>
          <p className="text-sm text-white/90 mb-6">Have your employer's business code? Enter it below to join as an employee.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-white">Business Code</label>
              <input
                id="accessCode"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. 2425-4AGR1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Join Business'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}