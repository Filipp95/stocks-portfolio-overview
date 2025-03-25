import PortfolioLayout from './components/layouts/PortfolioLayout/PortfolioLayout';

import loader from './assets/loader/loading.gif'

import './App.css';
import { useSelector } from 'react-redux';

function App() {
  const {status} = useSelector(state => state.portfolio)
  return (
    <>
      {status && (
        <div style={{ textAlign: 'center' }}>
          <img src={loader} alt="Loading..." /> 
          
        </div>
      )}
      <PortfolioLayout />
    </>
  )
}

export default App
  