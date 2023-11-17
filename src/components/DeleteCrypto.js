import React from 'react';

const DeleteCrypto = ({ cmid }) => {
  const handleDelete = () => {
    // Send DELETE request to the API
  };

  return <button onClick={handleDelete}>Delete Crypto</button>;
};

export default DeleteCrypto;
