"use client";
import React, { useState, useEffect, JSX } from 'react'

// Qonto FE Interview: Live Code Review Practice
// Instructions: Review this code aloud as if you are pairing with a colleague.
// Point out architectural flaws, performance issues, accessibility bugs, and security risks.
// Provide suggestions on how to fix them to meet Qonto's high standards.

type Transaction = {
  amount: number
  description: string
  receiptUrl: string
}

export const TransactionWidget = ({ userId, defaultFilter }: {userId: number, defaultFilter: string}): JSX.Element => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>(defaultFilter)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

    useEffect(() => {
    let isMounted = true; 

    const fetchData = async () => {
      if (isMounted) setLoading(true)
      
      try {
        const res = await fetch(`https://api.qonto.com/v1/transactions?user=${userId}&status=${filter}`);
        const data = await res.json();
        
        if (isMounted) {
          setTransactions(data);
          setError(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Робимо перший запит миттєво
    fetchData();

    // Запускаємо інтервал для наступних
    const fetchInterval = setInterval(fetchData, 5000);

    // Функція очищення (cleanup), яка спрацює при розмонтуванні
    // або перед наступним запуском ефекту (при зміні userId чи filter)
    return () => {
      isMounted = false;
      clearInterval(fetchInterval);
    };
  }, [userId, filter]); // <- додали filter в залежності


  const widgetStyles = {
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid black !important',
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
  }

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
        {transactions.map((tx: Transaction, index: number) => (
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
