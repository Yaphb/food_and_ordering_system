import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [welcomeMessage, setWelcomeMessage] = useState({ title: '', subtitle: '' });
  const [shapeConfig, setShapeConfig] = useState([]);

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

  // Generate random shapes configuration
  const generateRandomShapes = () => {
    const shapeTypes = [
      'circle', 'square', 'triangle', 'diamond', 'hexagon', 'star', 'oval', 'pentagon',
      'heart', 'cross', 'arrow', 'rhombus', 'octagon', 'crescent'
    ];
    const sections = ['hero', 'features', 'cta'];
    const shapes = [];

    sections.forEach(section => {
      // Generate 6-10 shapes per section for more variety
      const shapeCount = Math.floor(Math.random() * 5) + 6;
      
      for (let i = 0; i < shapeCount; i++) {
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const size = Math.floor(Math.random() * 80) + 40; // 40-120px
        const opacity = (Math.random() * 0.3) + 0.1; // 0.1-0.4
        const position = {
          top: Math.random() * 80 + 10, // 10-90%
          left: Math.random() * 80 + 10, // 10-90%
        };
        const rotation = Math.random() * 360;
        const animationDuration = Math.floor(Math.random() * 15) + 10; // 10-25s
        const animationType = [
          'float-slow', 'float-medium', 'rotate-slow', 'pulse-shape',
          'float-diagonal', 'wiggle', 'bounce-gentle', 'spin-wobble',
          'morph-size', 'drift', 'pulse-glow', 'float-slow-alt', 'float-medium-alt',
          'heart-beat', 'cross-spin', 'arrow-move', 'rhombus-stretch', 'octagon-morph', 'crescent-phase'
        ][Math.floor(Math.random() * 18)];

        shapes.push({
          id: `${section}-${shapeType}-${i}`,
          type: shapeType,
          section,
          size,
          opacity,
          position,
          rotation,
          animationDuration,
          animationType
        });
      }
    });

    return shapes;
  };

  useEffect(() => {
    // Generate shapes on component mount
    setShapeConfig(generateRandomShapes());
    
    // Regenerate shapes every 30 seconds for dynamic effect
    const interval = setInterval(() => {
      setShapeConfig(generateRandomShapes());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

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

  // Render dynamic shapes
  const renderShape = (shape) => {
    const baseStyle = {
      position: 'absolute',
      top: `${shape.position.top}%`,
      left: `${shape.position.left}%`,
      transform: `rotate(${shape.rotation}deg)`,
      opacity: shape.opacity,
      animation: `${shape.animationType} ${shape.animationDuration}s ease-in-out infinite`,
      pointerEvents: 'none',
      zIndex: -1,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      userSelect: 'none',
    };

    const borderColor = shape.section === 'cta' 
      ? `rgba(255, 255, 255, ${shape.opacity + 0.2})` 
      : `rgba(0, 0, 0, ${shape.opacity + 0.2})`;
    
    const backgroundColor = shape.section === 'cta'
      ? `rgba(255, 255, 255, ${shape.opacity * 0.5})`
      : `rgba(${shape.section === 'hero' ? '255, 255, 255' : '0, 0, 0'}, ${shape.opacity * 0.6})`;

    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            className="dynamic-shape"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              borderRadius: '50%',
              border: `2px solid ${borderColor}`,
              backgroundColor,
              boxShadow: `0 8px 32px rgba(0, 0, 0, ${shape.opacity * 0.3})`,
            }}
          />
        );
      
      case 'square':
        return (
          <div
            key={shape.id}
            className="dynamic-shape"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              border: `2px solid ${borderColor}`,
              backgroundColor,
              boxShadow: `0 8px 32px rgba(0, 0, 0, ${shape.opacity * 0.3})`,
            }}
          />
        );
      
      case 'triangle':
        return (
          <div
            key={shape.id}
            className="dynamic-shape"
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size * 0.866}px solid ${backgroundColor}`,
              filter: `drop-shadow(0 0 0 2px ${borderColor}) drop-shadow(0 8px 16px rgba(0, 0, 0, ${shape.opacity * 0.2}))`,
            }}
          />
        );
      
      case 'diamond':
        return (
          <div
            key={shape.id}
            className="dynamic-shape"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              border: `2px solid ${borderColor}`,
              backgroundColor,
              transform: `rotate(${shape.rotation + 45}deg)`,
              boxShadow: `0 8px 32px rgba(0, 0, 0, ${shape.opacity * 0.3})`,
            }}
          />
        );
      
      case 'hexagon':
        return (
          <div
            key={shape.id}
            className="dynamic-shape hexagon"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size * 0.866}px`,
              backgroundColor,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
              filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, ${shape.opacity * 0.3}))`,
            }}
          />
        );
      
      case 'star':
        return (
          <div
            key={shape.id}
            className="dynamic-shape star"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              background: backgroundColor,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, ${shape.opacity * 0.3}))`,
            }}
          />
        );
      
      case 'oval':
        return (
          <div
            key={shape.id}
            className="dynamic-shape"
            style={{
              ...baseStyle,
              width: `${shape.size * 1.5}px`,
              height: `${shape.size}px`,
              borderRadius: '50%',
              border: `2px solid ${borderColor}`,
              backgroundColor,
              boxShadow: `0 8px 32px rgba(0, 0, 0, ${shape.opacity * 0.3})`,
            }}
          />
        );
      
      case 'pentagon':
        return (
          <div
            key={shape.id}
            className="dynamic-shape pentagon"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              background: backgroundColor,
              clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
              filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, ${shape.opacity * 0.3}))`,
            }}
          />
        );
      
      case 'heart':
        return (
          <div
            key={shape.id}
            className="dynamic-shape heart"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              background: backgroundColor,
              clipPath: 'path("M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z")',
              transform: `${baseStyle.transform} scale(0.8)`,
              filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, ${shape.opacity * 0.3}))`,
            }}
          />
        );
      
      case 'cross':
        return (
          <div
            key={shape.id}
            className="dynamic-shape cross"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              background: backgroundColor,
              clipPath: 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)',
              filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, ${shape.opacity * 0.3}))`,
            }}
          />
        );
      
      case 'arrow':
        return (
          <div
            key={shape.id}
            className="dynamic-shape arrow"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              background: backgroundColor,
              clipPath: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
              filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, ${shape.opacity * 0.3}))`,
            }}
          />
        );
      
      case 'rhombus':
        return (
          <div
            key={shape.id}
            className="dynamic-shape rhombus"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size * 0.6}px`,
              background: backgroundColor,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, ${shape.opacity * 0.3}))`,
            }}
          />
        );
      
      case 'octagon':
        return (
          <div
            key={shape.id}
            className="dynamic-shape octagon"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              background: backgroundColor,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, ${shape.opacity * 0.3}))`,
            }}
          />
        );
      
      case 'crescent':
        return (
          <div
            key={shape.id}
            className="dynamic-shape crescent"
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              borderRadius: '50%',
              background: backgroundColor,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '20%',
              width: '70%',
              height: '70%',
              borderRadius: '50%',
              backgroundColor: shape.section === 'cta' ? '#000' : '#fff',
              opacity: 0.8,
            }} />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="home">
      <div className="hero">
        {/* Dynamic shapes container */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none', 
          zIndex: -1,
          overflow: 'hidden'
        }}>
          {shapeConfig
            .filter(shape => shape.section === 'hero')
            .map(shape => renderShape(shape))
          }
        </div>
        
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
        {/* Dynamic shapes container for features section */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none', 
          zIndex: -1,
          overflow: 'hidden'
        }}>
          {shapeConfig
            .filter(shape => shape.section === 'features')
            .map(shape => renderShape(shape))
          }
        </div>
        
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
        {/* Dynamic shapes container for CTA section */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none', 
          zIndex: -1,
          overflow: 'hidden'
        }}>
          {shapeConfig
            .filter(shape => shape.section === 'cta')
            .map(shape => renderShape(shape))
          }
        </div>
        
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