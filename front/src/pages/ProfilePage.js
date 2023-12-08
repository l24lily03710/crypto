import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/ProfilePage.css';

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
    nickname: '',
    defaultCurrency: 'EUR',
    cryptoList: [],
    keywords: [],
  });

  const cryptoOptions = ['Bitcoin', 'Ethereum', 'Litecoin', 'Ripple'];
  const keywordOptions = ['blockchain', 'mining', 'crypto', 'ledger'];

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchProfileData();
    }
  }, [navigate]);

  const fetchProfileData = async () => {
    try {
      setTimeout(() => {
        setProfile({
          nickname: 'User123',
          defaultCurrency: 'EUR',
          cryptoList: ['Bitcoin', 'Ethereum'],
          keywords: ['blockchain', 'mining']
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      setErrorMessage('Failed to load profile data.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      alert('Profile updated successfully!');
      // Here, you would send a PUT request to update the profile
    } catch (error) {
      setErrorMessage('Failed to update profile.');
    }
  };

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
