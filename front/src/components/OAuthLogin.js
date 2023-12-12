// OAuthLogin.js

import React from 'react';

const OAuthLogin = () => {
  const googleClientId = "33402681899-mc2qmmb3hr4lpifl3jr1rasl9ascr5mq.apps.googleusercontent.com";
  const redirectUri = 'http://localhost:3000/users/google-callback'; 

  const handleGoogleLogin = () => {
    const scope = encodeURIComponent('email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=online&prompt=consent`;
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleGoogleLogin}>Login with Google</button>
  );
};

export default OAuthLogin;
