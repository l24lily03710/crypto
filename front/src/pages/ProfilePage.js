import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/ProfilePage.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    nickname: '',
    email: '',
    defaultCurrency: 'EUR',
    cryptoList: [],
    keywords: [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);

        setUserId(decoded.user_id || decoded.user?.id);
        fetchProfileData(decoded.user_id || decoded.user?.id, token);
      } catch (error) {
        console.error('Token decoding error:', error);
        setErrorMessage(error.message);
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
      const response = await axios.get(
        `http://localhost:3000/users/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile({
        ...profile,
        nickname: response.data.username,
        email: response.data.mail,
        cryptoList: response.data.cryptos.join(', '),
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage('Failed to load profile data. Error: ' + error.message);
    }
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!userId) {
      setErrorMessage('User ID is undefined.');
      return;
    }

    try {
      const updatedData = {
        username: profile.nickname,
        mail: profile.email,
        cryptoFavorites: profile.cryptoList
          .split(',')
          .map(crypto => crypto.trim()),
      };

      await axios.put(
        `http://localhost:3000/users/profile/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Profile updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update profile. Error: ' + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  const handleModify = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    fetchProfileData(userId, localStorage.getItem('token'));
  };

  return (
    <>
      <Header />
      <div className="profile-page-container">
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
                onChange={e =>
                  setProfile({ ...profile, nickname: e.target.value })
                }
                disabled={!isEditMode}
              />
            </div>
            <div className="field-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={e =>
                  setProfile({ ...profile, email: e.target.value })
                }
                disabled={!isEditMode}
              />
            </div>
            <div className="field-group">
              <label> Favorite Cryptos:</label>
              <input
                type="text"
                name="cryptoList"
                value={profile.cryptoList}
                onChange={e =>
                  setProfile({ ...profile, cryptoList: e.target.value })
                }
                placeholder="Enter cryptos separated by commas"
                disabled={!isEditMode}
              />
            </div>
            {!isEditMode && (
              <button type="button" onClick={handleModify}>
                Modify
              </button>
            )}
            {isEditMode && (
              <>
                <button type="submit">Update Profile</button>
                <button type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
