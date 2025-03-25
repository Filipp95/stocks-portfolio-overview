import EmptyPortfolio from '../../widgets/EmptyPortfolio/EmptyPortfolio';
import PopUpList from '../../widgets/PopUpList/PopUpList';
import PortfolioList from '../../widgets/PortfolioList/PortfolioList';

import s from './PortfolioSection.module.scss'

const PortfolioSection = () => {
    return (
        <div className={s.portfolio_section_container}>
            <EmptyPortfolio/>
            <PopUpList/>
            <PortfolioList/>
        </div>
    )
}

export default PortfolioSection