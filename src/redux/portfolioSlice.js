import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";


export const fetchAvailableStocks = createAsyncThunk(
    "portfolio/fetchAvailableStocks",
    async function (_, { dispatch, rejectWithValue }) {
        try {
            const nameResponse = await fetch("https://api.binance.com/api/v3/ticker/24hr")
            const stocksNames = await nameResponse.json()
            let tradingsSocks = stocksNames.filter((symbol) => (symbol.openPrice > '0.01' && symbol.symbol.slice(3) === 'USDT')).splice(0, 150)
            const finalStockNames = tradingsSocks.map((symbol) => {
                return {
                    symbol: symbol.symbol.slice(0, 3),
                    price: symbol.lastPrice.slice(0, 8),
                    priceChangePercent: symbol.priceChangePercent.slice(0, 4)
                }
            })
            dispatch(openStockList())
            return finalStockNames
        }
        catch (error) {
            return rejectWithValue(error.message)
        }

    }
)

const getStockDataFromLS = () => {
    try {
        const isData = localStorage.getItem("stockData")
        if (!isData) {
            return { stockData: [], isStockChosen: false };
        }
        const transferredData = JSON.parse(isData);

        if (!Array.isArray(transferredData)) {
            localStorage.removeItem("stockData");
            return { stockData: [], isStockChosen: false };
        }
        return {
            stockData: transferredData,
            isStockChosen: transferredData.length > 0 ? true : false,
        };
    } catch (error) {
        localStorage.removeItem("stockData");
        return { stockData: [], isStockChosen: false };
    }
};

let dataFromLS = getStockDataFromLS();

const saveStocksToLS = (state) => {
    localStorage.setItem("stockData", JSON.stringify(state.stockData))
};



const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: {
        isStockListOpen: false,
        isQuantityFieldShown: false,
        isStockChosen: dataFromLS.isStockChosen,
        choosenElement: null,
        quantityToAdd: null,
        objWithQuant: null,
        status: null,
        error: null,
        availableStocks: [],
        stockData: dataFromLS.stockData,
    },
    reducers: {
        openStockList(state, action) {
            state.isStockListOpen = true
        },
        chooseStock(state, action) {
            state.choosenElement = action.payload
            state.isQuantityFieldShown = true
            state.quantityToAdd = null
        },

        addStockToPortfolio(state, action) {
            state.quantityToAdd = action.payload
            state.objWithQuant = JSON.parse(state.choosenElement)
            const objIndex = state.stockData.findIndex((obj) => obj.symbol === state.objWithQuant.symbol)
            if (objIndex === -1) {
                state.objWithQuant.quantityToAdd = state.quantityToAdd
                state.stockData = [...state.stockData, state.objWithQuant]
            }
            else {
                state.stockData[objIndex].quantityToAdd = +state.stockData[objIndex].quantityToAdd + +state.quantityToAdd
            }
            state.isQuantityFieldShown = false
            state.isStockChosen = true
            state.isStockListOpen = false
            saveStocksToLS(state);
        },
        closePopUpList(state) {
            state.isStockListOpen = false
            state.isQuantityFieldShown = false
            state.quantityToAdd = null
        },

        updateStockData(state, action) {
            const symbol = action.payload.symbol.slice(0, 3)
            const price = action.payload.price
            const priceChangePercent = action.payload.priceChangePercent
            let stock = state.stockData.find((obj) => obj.symbol === symbol)
            if (stock) {
                stock.price = price
                stock.priceChangePercent = priceChangePercent
                saveStocksToLS(state);
            }
        },

        deleteStockElement(state, action) {
            const stocks = state.stockData;
            const indOfEl = stocks.findIndex((obj) => { return obj.symbol === action.payload.symbol })
            if (indOfEl !== -1) {
                const newStockData = [
                    ...stocks.slice(0, indOfEl),
                    ...stocks.slice(indOfEl + 1)
                ]
                state.stockData = newStockData;
                if (state.stockData.length === 0) {
                    state.isStockChosen = false
                }
                saveStocksToLS(state);
            }
        }

    },
    extraReducers: (builder) => {
        builder.addCase(fetchAvailableStocks.pending, (state) => {
            state.status = "loading";
            state.error = null;
        }),
            builder.addCase(fetchAvailableStocks.fulfilled, (state, action) => {
                state.status = null;
                state.availableStocks = action.payload
            })
        builder.addCase(fetchAvailableStocks.rejected, (state, action) => {
            state.status = null;
            state.error = action.payload;
        })
    }
})

export const { openStockList, chooseStock, closePopUpList, addStockToPortfolio, updateStockData, deleteStockElement } = portfolioSlice.actions;

export default portfolioSlice.reducer;