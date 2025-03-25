import { updateStockData } from "./portfolioSlice";

const WsMiddleware = (store) => (next) => (action) => {
    const { dispatch, getState } = store;

    let socket = null;

    if (action.type === 'CONNECT_TO_SERVER') {
        if (socket) {
            socket.close();
        }
        let state = getState().portfolio
        const streamNameArr = []
        state.stockData.map((obj) => { streamNameArr.push((obj.symbol + 'USDT@ticker').toLowerCase()) })
        let streamName = streamNameArr.join("/")
        socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamName}`)

        socket.onopen = open => console.log('Connected')
        
        socket.onmessage = (response) => {
            let data = JSON.parse(response.data)
            const { s: symbol, c: price, P: priceChangePercent } = data.data
            dispatch(updateStockData({ symbol, price, priceChangePercent }))
        }

        socket.onerror = error => console.log('Error:', error)
        socket.onclose = () => console.log('Connection lost');
    }
    else if (action.type === 'DISCONNECT') {
        if (socket) {
            socket.close();
            socket = null;
        }
    }

    return next(action)
}

export default WsMiddleware