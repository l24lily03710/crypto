import React from 'react';
import { GoogleLogin } from 'react-google-login';


const OAuthLogin = () => {

  
  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch('http://localhost:3000/api/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.tokenId }),
      });

      const data = await res.json();
      if (res.status === 200) {
        // Handle successful login
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };
  const googleClientId = "33402681899-mc2qmmb3hr4lpifl3jr1rasl9ascr5mq.apps.googleusercontent.com";
  return (
    <div>
      <GoogleLogin
        clientId={googleClientId}
        buttonText="Login with Google"
        onSuccess={handleGoogleResponse}
        onFailure={handleGoogleResponse}
      />
    </div>
  );
};

export default OAuthLogin;
