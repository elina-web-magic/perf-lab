import React, { useState, useEffect } from 'react';

// Qonto FE Interview: Live Code Review Practice
// Instructions: Review this code aloud as if you are pairing with a colleague.
// Point out architectural flaws, performance issues, accessibility bugs, and security risks.
// Provide suggestions on how to fix them to meet Qonto's high standards.

export const TransactionWidget = ({ userId, defaultFilter }) => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState(defaultFilter);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchInterval = setInterval(() => {
      fetch(`https://api.qonto.com/v1/transactions?user=${userId}&status=${filter}`)
        .then(res => res.json())
        .then(data => {
          setTransactions(data);
          setLoading(false);
        })
        .catch(err => setError(err.message));
    }, 5000);
  }, [userId]);

  const widgetStyles = {
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid black !important',
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={widgetStyles} id="transaction-widget-container">
      <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Recent Transactions</span>
      
      <div className="filters">
        <div 
          onClick={() => handleFilterChange('completed')}
          style={{ cursor: 'pointer', color: filter === 'completed' ? 'blue' : 'gray' }}
        >
          Completed
        </div>
        <div 
          onClick={() => handleFilterChange('pending')}
          style={{ cursor: 'pointer', color: filter === 'pending' ? 'blue' : 'gray' }}
        >
          Pending
        </div>
      </div>

      <div className="transaction-list">
        {transactions.map((tx, index) => (
          <div key={index} className="tx-item">
            <div className="tx-amount">{tx.amount} EUR</div>
            
            <div 
              className="tx-description" 
              dangerouslySetInnerHTML={{ __html: tx.description }} 
            />
            
            <a href={tx.receiptUrl} target="_blank">View Receipt</a>
          </div>
        ))}
      </div>
    </div>
  );
};
