import s from './PortfolioList.module.scss'

import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { deleteStockElement } from '../../../redux/portfolioSlice';
import { useEffect } from 'react';

const PortfolioList = () => {
    const isStockChosen = useSelector(state => state.portfolio.isStockChosen)
    const stockData = useSelector(state => state.portfolio.stockData)
    const dispatch = useDispatch()
    
    useEffect(() => {
        if (stockData.length === 0) {
            dispatch({ type: 'DISCONNECT' });
        }
    }, [stockData.length, dispatch]);


    const handleDelete = (el) => {
        const deletedElement = JSON.parse(el.target.closest('div').dataset.delobj);
        dispatch(deleteStockElement(deletedElement))
    }

    let sum = 0;
    for (let i = 0; i < stockData.length; i++) {
        sum += stockData[i].price * stockData[i].quantityToAdd
    }

    const Row = ({ index, style }) => {
        const obj = stockData[index]
        let price = +obj.price
        let fullPrice = obj.price * obj.quantityToAdd

        return (
            <div className={s.portfolio_list_titles} style={style} data-delobj={JSON.stringify(obj)} onClick={handleDelete}>
                <span className={s.portfolio_list_element}>{obj.symbol}</span>
                <span className={s.portfolio_list_element}>{obj.quantityToAdd}</span>
                <span className={s.portfolio_list_element}>{`$${price.toFixed(2)}`}</span>
                <span className={s.portfolio_list_element}>{`$${fullPrice.toFixed(2)}`}</span>
                <span className={obj.priceChangePercent > 0 ? s.portfolio_element_increase : s.portfolio_element_decrease}>
                    {obj.priceChangePercent > 0 ? `+${obj.priceChangePercent}%` : `${obj.priceChangePercent}%`}
                </span>
                <span className={s.portfolio_list_element}>
                    {sum > 0 ? `${(fullPrice*100/ sum).toFixed(2)}%` : '0%'}
                </span>
            </div>
        )
    }

    return (
        <div className={isStockChosen ? s.portfolio_list_wrapper : s.portfolio_list_wrapper__hided}>
            <div className={s.portfolio_list_titles}>
                <span className={s.portfolio_list_element}>Актив</span>
                <span className={s.portfolio_list_element}>Количество</span>
                <span className={s.portfolio_list_element}>Цена</span>
                <span className={s.portfolio_list_element}>Общая стоимость</span>
                <span className={s.portfolio_list_element}>Изм. за 24 ч.</span>
                <span className={s.portfolio_list_element}>% от портфеля</span>
            </div>
            <List
                height={window.innerHeight * 0.6}
                itemCount={stockData.length}
                itemSize={30}
                max-width={1216}
            >
                {Row}
            </List>
        </div>
    )
}

export default PortfolioList