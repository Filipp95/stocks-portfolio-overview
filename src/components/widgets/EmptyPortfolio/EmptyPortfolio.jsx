import { useSelector } from 'react-redux';

import s from './EmptyPortfolio.module.scss';

const EmptyPortfolio = () => {
    const isStockListOpen = useSelector(state => state.portfolio.isStockListOpen)    
    const isStockChosen = useSelector(state => state.portfolio.isStockChosen)

    return (
        <div className={s.empty_portfolio_wrapper}>
            <h1 className={isStockChosen ? s.empty_portfolio_warning_message__hided : s.empty_portfolio_warning_message}>
                В портфеле нет активов. Добавьте что-нибудь, чтобы начать!
            </h1>
        </div>
    )
} 

export default EmptyPortfolio