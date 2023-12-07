import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/ProfilePage.css';


const Dropdown = ({ options, selectedItems = [], setSelectedItems, label }) => {
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
            <div key={option} className="dropdown-item" onClick={() => handleItemClick(option)}>
              <input type="checkbox" checked={selectedItems.includes(option)} readOnly />
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: '',
    mail: '',       
    defaultCurrency: 'EUR',
    cryptoList: [],
    keywords: [],
  });

  const [cryptoOptions, setCryptoOptions] = useState([]);

  const keywordOptions = ['blockchain', 'mining', 'crypto', 'ledger'];

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userID');
    if (!token || !userId) {
      navigate('/login');
    } else {
      fetchProfileData(userId);
      fetchCryptoOptions();
    }
  }, [navigate]);

  const fetchProfileData = async (userId) => {
    const token = localStorage.getItem('token'); 
    try {
      const response = await fetch(`http://localhost:3000/users/profile/${userId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.status === 200) {
        setProfile({
          username: data.username,
          mail: data.mail,     
        });
      } else {
        setErrorMessage(data.error || 'Failed to load profile data.');
      }
    } catch (error) {
      setErrorMessage('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCryptoOptions = async () => {
    const token = localStorage.getItem('token'); 
    try {
      const response = await fetch('http://localhost:3000/cryptos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.status === 200) {
        setCryptoOptions(data.map(crypto => crypto.crypto_name));
      } else {
        console.error('Failed to fetch crypto options');
      }
    } catch (error) {
      console.error('Error fetching crypto options:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userID');
    if (!userId) {
      setErrorMessage('User ID not found.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/user/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: profile.username, // Use the state variable for username
          mail: profile.mail,         // Use the state variable for email
   
        })
      });
      const data = await response.json();
      if (response.status === 200) {
        alert('Profile updated successfully!');
      } else {
        setErrorMessage(data.error || 'Failed to update profile.');
      }
    } catch (error) {
      setErrorMessage('Failed to update profile.');
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <h2>Profile Page</h2>
        {loading && <p>Loading...</p>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleUpdateProfile} className="profile-form">
          <div className="field-group">
           <label>Username:</label>
           <input
              type="text"
              name="username"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
          </div>
          <div className="field-group">
            <label>Email:</label>
            <input
              type="email"
              name="mail"
              value={profile.mail}
              onChange={(e) => setProfile({ ...profile, mail: e.target.value })}
            />
          </div>
          
          <div className="field-group">
            <label>Default Currency:</label>
            <input
              type="text"
              name="defaultCurrency"
              value={profile.defaultCurrency}
              onChange={(e) => setProfile({ ...profile, defaultCurrency: e.target.value })}
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
