import NavBar from '../components/layout/NavBar';
import landingImage from '../assets/Landing.png';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      <NavBar />
      <div
        className="min-h-screen w-full bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${landingImage})` }}
      >
        <div className>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-8">
                DHO - Dashboard
                <span className="block text-2xl sm:text-3xl md:text-4xl mt-4 text-blue-400">
                  Real-Time KPI Tracking for Small Businesses
                </span>
              </h1>

              <div className="bg-white bg-opacity-95 rounded-lg p-8 mt-12 shadow-xl">
                <p className="text-gray-800 text-lg md:text-xl leading-relaxed mb-6">
                  This interactive web app is designed to help small businesses take control 
                  of their data and make smarter decisions. With real-time KPI tracking, 
                  business owners can instantly monitor performance metrics, track progress, 
                  and respond quickly to changes in sales trends.
                </p>
                
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
                  Powered by the Vite and React framework, the web app ensures fast performance, 
                  seamless interactivity, and scalable architecture. As a Progressive Web App (PWA), 
                  it delivers accessibility across devices — from desktops to smartphones.
                </p>

                <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                  The platform is built to make analytics simple, interactive, and actionable, 
                  helping small businesses turn raw data into meaningful strategies for growth 
                  and success.
                </p>

                <div className="mt-8">
                  <Link
                    to="/register"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;