import ButtonElement from '../../elements/ButtonElement/ButtonElement';

import { useSelector, useDispatch } from 'react-redux';
import { chooseStock, closePopUpList, addStockToPortfolio, setWSConnection  } from './../../../redux/portfolioSlice'
import { useRef, memo, useEffect } from 'react';

import s from './PopUpList.module.scss'

const PopUpList = memo(() => {
    const popUpRef = useRef(null);
    const quantityRef = useRef('');
    const dispatch = useDispatch();
    const isStockListOpen = useSelector(state => state.portfolio.isStockListOpen);
    const isQuantityFieldShown = useSelector(state => state.portfolio.isQuantityFieldShown);
    const availableStocks = useSelector(state => state.portfolio.availableStocks)
    const stockData = useSelector(state => state.portfolio.stockData);
    const isWSConnected = useSelector (state => state.portfolio.isWSConnected)

    useEffect(() => {
        if (stockData && stockData.length > 0 && !isWSConnected) {
            dispatch({ type: "CONNECT_TO_SERVER" });
            dispatch(setWSConnection(true));
        } else if ((!stockData || stockData.length === 0) && isWSConnected) {
            dispatch({ type: "DISCONNECT" });
            dispatch(setWSConnection(false));
        }
    }, [stockData, isWSConnected, dispatch]);


    useEffect(() => {
        if (isStockListOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isStockListOpen]);


    const handleClickOutside = (event) => {
        if (!popUpRef.current.contains(event.target)) {
            dispatch(closePopUpList());
        }
    };

    const handleChoose = (el) => {
        let clickedStock = el.target.closest('div').dataset.obj
        dispatch(chooseStock(clickedStock))
    }

    const handleAdd = () => {
        let quantityToAdd = quantityRef.current.value
        dispatch(addStockToPortfolio(quantityToAdd))
        dispatch({ type: "CONNECT_TO_SERVER" })
    }

    const handleCancel = () => {
        dispatch(closePopUpList())
    }

    const AddCurrency = () => {
        return (
            <form className={isQuantityFieldShown ? s.quantity_field : s.quantity_field__hided} onSubmit={handleAdd}>
                <input className={s.input_quantity} ref={quantityRef} type='number' name="quantity" min="1" max="1000" placeholder="Введите количество"
                    required />
                <ButtonElement type={'submit'}>Добавить</ButtonElement>
                <ButtonElement type={'submit'} func={handleCancel}>Отмена</ButtonElement>
            </form>
        )
    }

    return (
        <div ref={popUpRef} className={isStockListOpen ? s.pop_up_list_container : s.pop_up_list_container__hided}>
            <form className={s.currencies_list}>
                {availableStocks.map((obj, id) => {
                    return (
                        <div key={id} className={s.available_stock_item} data-obj={JSON.stringify(obj)} onClick={handleChoose}>
                            <span className={s.stock_name}>{obj.symbol}</span>
                            <span className={s.stock_price}>{`$${obj.price}`}</span>
                            <span className={obj.priceChangePercent > 0 ? s.stock_price_increase : s.stock_price_decrease}>
                                {obj.priceChangePercent > 0 ? `+${obj.priceChangePercent}%` : `${obj.priceChangePercent}%`}
                            </span>
                        </div>
                    )
                })}
            </form>
            <AddCurrency />
        </div>
    )
})

export default PopUpList