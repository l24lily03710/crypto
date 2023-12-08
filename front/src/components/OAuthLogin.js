import React from 'react';

const OAuthLogin = () => {
  const handleOAuthLogin = (provider) => {
    // Redirect to OAuth provider login page
  };

  return (
    <div>
      <button onClick={() => handleOAuthLogin('google')}>Login with Google</button>
      <button onClick={() => handleOAuthLogin('facebook')}>Login with Facebook</button>
      {/* Add other providers as needed */}
    </div>
  );
};

export default OAuthLogin;
