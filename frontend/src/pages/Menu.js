import { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { API_URL } from '../config';
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/menu`);
      // Ensure price is a number
      const items = response.data.map(item => ({
        ...item,
        price: parseFloat(item.price) || 0
      }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems
    .filter(item => filter === 'all' || item.category === filter)
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closeOverlay = () => {
    const overlay = document.querySelector('.food-overlay');
    const content = document.querySelector('.food-overlay-content');
    if (overlay && content) {
      overlay.classList.add('overlay-exit');
      content.classList.add('content-exit');
      setTimeout(() => {
        setSelectedItem(null);
        document.body.style.overflow = '';
      }, 400);
    } else {
      setSelectedItem(null);
      document.body.style.overflow = '';
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    showToast(`${item.name} added to cart!`, 'success');
    closeOverlay();
  };

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    addToCart(item);
    showToast(`${item.name} added to cart!`, 'success');
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (loading) return <div className="loading">Loading menu...</div>;

  return (
    <>
      <div className="menu-container">
        <h1>Our Menu</h1>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {!searchQuery && (
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="filter-buttons">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
          <button onClick={() => setFilter('appetizer')} className={filter === 'appetizer' ? 'active' : ''}>Appetizers</button>
          <button onClick={() => setFilter('main')} className={filter === 'main' ? 'active' : ''}>Main Course</button>
          <button onClick={() => setFilter('dessert')} className={filter === 'dessert' ? 'active' : ''}>Desserts</button>
          <button onClick={() => setFilter('beverage')} className={filter === 'beverage' ? 'active' : ''}>Beverages</button>
        </div>

        <div className="menu-grid">
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <div 
                key={item.id || item._id} 
                className="menu-item" 
                onClick={() => handleItemClick(item)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="item-footer">
                  <span className="price">RM{(parseFloat(item.price) || 0).toFixed(2)}</span>
                  {user && user.role === 'customer' && (
                    <button 
                      onClick={(e) => handleQuickAdd(e, item)} 
                      className="btn-add"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No dishes found matching your search.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {selectedItem && createPortal(
        <div className="food-overlay" onClick={closeOverlay}>
          <div className="food-overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeOverlay}>×</button>
            <div className="overlay-image">
              <img src={selectedItem.image} alt={selectedItem.name} />
            </div>
            <div className="overlay-details">
              <h2>{selectedItem.name}</h2>
              <p className="overlay-category">{selectedItem.category}</p>
              <p className="overlay-description">{selectedItem.description}</p>
              <div className="overlay-footer">
                <span className="overlay-price">RM{(parseFloat(selectedItem.price) || 0).toFixed(2)}</span>
                {user && user.role === 'customer' && (
                  <button onClick={() => handleAddToCart(selectedItem)} className="btn-add-overlay">
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Menu;
