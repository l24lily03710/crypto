import React from 'react';
import './AccessLevelinfo.css'; 

const AccessLevelinfo = () => {
    return (
        <section className="access-level-info">
            <h2>Access Levels</h2>
            <div className="access-description">
                <h3>Anonymous</h3>
                <p>
                    Basic access with limited features. Includes access to the most popular 
                    cryptocurrency courses and their trends.
                </p>
            </div>
            <div className="access-description">
                <h3>User</h3>
                <p>
                    Full access to standard features. Users can customize their list of 
                    cryptocurrencies and refine news articles with keywords.
                </p>
            </div>
            <div className="access-description">
                <h3>Admin</h3>
                <p>
                    Exclusive access to the admin panel. Administrators can manage global 
                    application preferences, lists of cryptocurrencies, and user roles.
                </p>
            </div>
        </section>
    );
};

export default AccessLevelinfo;
