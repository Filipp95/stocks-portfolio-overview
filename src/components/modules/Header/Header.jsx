import ButtonElement from '../../elements/ButtonElement/ButtonElement';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchAvailableStocks } from './../../../redux/portfolioSlice'

import s from './Header.module.scss';

const Header = () => {
    const isStockListOpen = useSelector(state => state.portfolio.isStockListOpen)
    const dispatch = useDispatch();

    const showAllStocks = () => {
        dispatch(fetchAvailableStocks())
    }

    return (
        <div className={s.header_wrapper}>
            <span className={s.header_logo}> Portfolio Overview </span>
            <ButtonElement func={showAllStocks} >Добавить</ButtonElement>
        </div>
    )
}

export default Header