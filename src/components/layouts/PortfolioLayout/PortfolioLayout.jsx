import { useSelector } from 'react-redux';

import Header from '../../modules/Header/Header'
import PortfolioSection from '../../modules/PortfolioSection/PortfolioSection';

import s from './PortfolioLayout.module.scss'

const PortfolioLayout = () => {
  const isStockListOpen = useSelector(state => state.portfolio.isStockListOpen)

    return (
        <div className = {isStockListOpen ? s.portfolio_layout_wrapper__blacked : s.portfolio_layout_wrapper}> 
          <Header/>
          <PortfolioSection />
        </div>
      )
}


export default PortfolioLayout