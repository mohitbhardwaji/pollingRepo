import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setStockData, setCurrentStock } from '../store/stockSlice';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { data, currentStock } = useSelector((state: RootState) => state.stocks);
  const [selectedStock, setSelectedStock] = useState(currentStock || 'bitcoin'); 

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:3000/api/data?stock=${selectedStock}`);
      dispatch(setStockData(response.data));
    };

    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [dispatch, selectedStock]);

  const handleStockChange = (newStock: string) => {
    setSelectedStock(newStock);
    dispatch(setCurrentStock(newStock));
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ float: 'right', fontSize: '20px',fontWeight:700, textAlign: 'right', marginRight: '20px', marginBottom: '10px' ,color:'#A79277'}}>
        <p>Created by: Mohit Bhardwaj</p>
        <p>Email: <a href="mailto:mohitbha098@gmail.com">mohitbha098@gmail.com</a></p>
        <p>Contact: <a href="tel:+917400620695">7400620695</a></p>
      </div>
      <h1 style={{ textAlign: 'center',color:'#A79277' }}>Real-Time Coins Data</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', borderRadius:'10px',}}>
        <button style={{ padding: '10px', fontSize: '16px',borderRadius:'20px',border:"none",backgroundColor:"#A79277" }}>
          Change Stock
          <select
            value={selectedStock}
            onChange={(e) => handleStockChange(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', fontSize: '16px',backgroundColor:"#D1BB9E",borderRadius:'20px' }}
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="ripple">Ripple</option>
            <option value="litecoin">Litecoin</option>
            <option value="cardano">Cardano</option>
          </select>
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#D1BB9E' }}>Timestamp</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#D1BB9E' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(-20).map((entry, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#EAD8C0' : '#FFF2E1' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(entry.timestamp).toLocaleString()}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Rs {entry.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
