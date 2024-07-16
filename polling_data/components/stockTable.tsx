import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const StockTable = () => {
  const { data } = useSelector((state: RootState) => state.stocks);

  return (
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {data.slice(-20).map((entry, index) => (
          <tr key={index}>
            <td>{new Date(entry.timestamp).toLocaleString()}</td>
            <td>{entry.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StockTable;
