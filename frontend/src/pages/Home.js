import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [welcomeMessage, setWelcomeMessage] = useState({ title: '', subtitle: '' });

  // Array of welcome messages for variety
  const welcomeMessages = [
    {
      title: "Delicious Food\nDelivered Fast",
      subtitle: "Experience the finest meals crafted with premium ingredients and delivered straight to your door. Your next favorite dish is just a click away."
    },
    {
      title: "Savor Every\nMoment",
      subtitle: "Indulge in culinary excellence with our handpicked selection of gourmet dishes. From comfort food to exotic flavors, we bring the world to your table."
    },
    {
      title: "Fresh Flavors\nAwait You",
      subtitle: "Discover a symphony of tastes prepared by our expert chefs using the freshest ingredients. Every bite tells a story of passion and quality."
    },
    {
      title: "Your Culinary\nAdventure Starts Here",
      subtitle: "Embark on a gastronomic journey with our diverse menu featuring local favorites and international cuisines. Satisfaction guaranteed with every order."
    },
    {
      title: "Taste the\nDifference",
      subtitle: "Where quality meets convenience. Our commitment to excellence ensures that every meal is a memorable experience delivered right to your doorstep."
    }
  ];

  // Personalized messages for logged-in users
  const personalizedMessages = [
    {
      subtitle: "Welcome back! Ready to explore new flavors or order your usual favorites? We've got something special waiting for you."
    },
    {
      subtitle: "Great to see you again! Your taste buds are in for a treat with our latest additions and chef's recommendations."
    },
    {
      subtitle: "We've missed you! Discover what's new on our menu or revisit those dishes that made you smile before."
    },
    {
      subtitle: "Ready for another delicious adventure? Our kitchen is buzzing with fresh ingredients just for you."
    },
    {
      subtitle: "Your next amazing meal is just a few clicks away. Let's make today deliciously memorable!"
    }
  ];

  useEffect(() => {
    if (user) {
      // For logged-in users, show personalized greeting
      const randomPersonalized = personalizedMessages[Math.floor(Math.random() * personalizedMessages.length)];
      setWelcomeMessage({
        title: `Hello ${user.name}!`,
        subtitle: randomPersonalized.subtitle
      });
    } else {
      // For non-logged-in users, show random welcome message
      const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      setWelcomeMessage(randomWelcome);
    }
  }, [user]);

  // Get time-based greeting for logged-in users
  const getTimeBasedGreeting = () => {
    const now = new Date();
    const malaysiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
    const hour = malaysiaTime.getHours();
    
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  };
  return (
    <div className="home">
      <div className="hero">
        {/* Decorative shapes */}
        <div className="shape shape-circle-1"></div>
        <div className="shape shape-square-1"></div>
        <div className="shape shape-triangle-1"></div>
        <div className="shape shape-circle-2"></div>
        <div className="shape shape-square-4"></div>
        <div className="shape shape-circle-5"></div>
        <div className="shape shape-triangle-2"></div>
        <div className="shape shape-square-5"></div>
        
        <div className="hero-content">
          <h1>
            {user ? (
              <>
                <span className="greeting-time">{getTimeBasedGreeting()},</span>
                <br />
                <span className="user-name">{user.name}!</span>
              </>
            ) : (
              welcomeMessage.title.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < welcomeMessage.title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))
            )}
          </h1>
          <p>{welcomeMessage.subtitle}</p>
          <div className="hero-actions">
            <Link to="/menu" className="btn-primary">
              {user ? "Explore Menu" : "Browse Menu"}
            </Link>
            {!user && <Link to="/register" className="btn-secondary">Get Started</Link>}
            {user && <Link to="/orders" className="btn-secondary">My Orders</Link>}
          </div>
        </div>
      </div>
      
      <div className="features">
        {/* Decorative shapes for features section */}
        <div className="shape shape-square-2"></div>
        <div className="shape shape-circle-3"></div>
        <div className="shape shape-triangle-3"></div>
        <div className="shape shape-circle-6"></div>
        <div className="shape shape-square-6"></div>
        
        <div className="feature">
          <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>Fresh Food</h3>
          <p>Made with the finest ingredients</p>
        </div>
        <div className="feature">
          <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>Fast Delivery</h3>
          <p>Quick and reliable service</p>
        </div>
        <div className="feature">
          <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 10h20" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>Easy Payment</h3>
          <p>Secure checkout process</p>
        </div>
      </div>

      <div className="cta-section">
        {/* Decorative shapes for CTA section */}
        <div className="shape shape-triangle-4"></div>
        <div className="shape shape-square-3"></div>
        <div className="shape shape-circle-4"></div>
        <div className="shape shape-square-7"></div>
        <div className="shape shape-circle-7"></div>
        <div className="shape shape-triangle-5"></div>
        
        <h2>{user ? "Craving something delicious?" : "Ready to order?"}</h2>
        <p>
          {user 
            ? "Your favorite dishes are waiting for you. Order now and satisfy those cravings!"
            : "Join thousands of satisfied customers enjoying delicious meals every day"
          }
        </p>
        <Link to="/menu" className="btn-primary">
          {user ? "Order Now" : "View Our Menu"}
        </Link>
      </div>
    </div>
  );
};

export default Home;
