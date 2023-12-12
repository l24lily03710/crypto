import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/ProfilePage.css';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';  

const Dropdown = ({ options, selectedItems, setSelectedItems, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <div className="dropdown">
      <label>{label}:</label>
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedItems.length > 0 ? selectedItems.join(', ') : 'Select...'}
      </div>
      {isOpen && (
        <div className="dropdown-list">
          {options.map(option => (
            <div key={option} className="dropdown-item">
            <input 
              type="checkbox" 
              checked={selectedItems.includes(option)} 
              onChange={() => handleItemClick(option)} 
            />
            <label onClick={() => handleItemClick(option)}>{option}</label>
          </div>
        ))}
      </div>
    )}
  </div>
  );
};

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    nickname: '',
    email: '',
    defaultCurrency: 'EUR',
    cryptoList: [],
    keywords: [],
  });

  const cryptoOptions = ['Bitcoin', 'Ethereum', 'Litecoin', 'Ripple'];
  const keywordOptions = ['blockchain', 'mining', 'crypto', 'ledger'];
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        let userId;
        if (decoded.user_id) { // For Google login structure
          userId = decoded.user_id;
        } else if (decoded.user && decoded.user._id) { // For traditional login structure
          userId = decoded.user._id;
        } else {
          throw new Error('Invalid token payload');
        }
        setUserId(userId);
        fetchProfileData(userId, token);
      } catch (error) {
        console.error('Token decoding error:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
   
  const fetchProfileData = async (userId, token) => {
    if (!userId) {
      setErrorMessage('User ID is undefined.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/users/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userData = response.data;
      setProfile({
        nickname: userData.username,
        email: userData.mail,
        defaultCurrency: 'EUR', 
        cryptoList: userData.cryptos,
        keywords: [] 
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage('Failed to load profile data. Error: ' + error.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!userId) {
      setErrorMessage('User ID is undefined.');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/users/profile/${userId}`, {
        username: profile.nickname,
        mail: profile.email, 
        cryptos: profile.cryptoList,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Profile updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update profile. Error: ' + error.message);
    }
  };
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <Header />
      <div className="profile-container">
        <h2>Profile Page</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleUpdateProfile} className="profile-form">
          <div className="field-group">
            <label>Nickname:</label>
            <input
              type="text"
              name="nickname"
              value={profile.nickname}
              onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
            />
          </div>
          <div className="field-group">
           <label>Email:</label>
           <input
             type="email"
             name="email"
             value={profile.email}
             onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div className="field-group">
            <label>Default Currency:</label>
            <input
              type="text"
              name="defaultCurrency"
              value={profile.defaultCurrency}
              readOnly // La devise est fixe et non modifiable
            />
          </div>

          <Dropdown 
            label="Crypto List"
            options={cryptoOptions} 
            selectedItems={profile.cryptoList} 
            setSelectedItems={(items) => setProfile({ ...profile, cryptoList: items })}
          />

          <Dropdown 
            label="Keywords for Press Review"
            options={keywordOptions} 
            selectedItems={profile.keywords} 
            setSelectedItems={(items) => setProfile({ ...profile, keywords: items })}
          />

          <button type="submit">Update Profile</button>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;