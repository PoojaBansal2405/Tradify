import { useEffect, useState } from 'react'
import axios from 'axios'

const Summary = () => {
    const [holdings, setHoldings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        axios.get('http://localhost:3002/allHoldings', { withCredentials: true })
            .then(({ data }) => setHoldings(data))
            .catch(() => setError('Unable to load your holdings. Please try again later.'))
            .finally(() => setLoading(false))
    }, [])

    const totalInvestment = holdings.reduce(
        (total, stock) => total + stock.avg * stock.qty,
        0
    )
    const currentValue = holdings.reduce(
        (total, stock) => total + stock.price * stock.qty,
        0
    )
    const profitLoss = currentValue - totalInvestment
    const profitLossPercent = totalInvestment === 0
        ? 0
        : (profitLoss / totalInvestment) * 100

    return (
        <>
            <div className="username">
                <h6>Hi, User!</h6>
                <hr className="divider" />
            </div>

            <div className="section">
                <span>
                    <p>Holdings ({holdings.length})</p>
                </span>

                {loading ? (
                    <p>Loading your holdings...</p>
                ) : error ? (
                    <p role="alert">{error}</p>
                ) : holdings.length === 0 ? (
                    <p>You don't have any holdings yet.</p>
                ) : (
                    <>
                        <div className="data">
                            <div className="first">
                                <h3 className={profitLoss >= 0 ? 'profit' : 'loss'}>
                                    {profitLoss.toFixed(2)} <small>{profitLossPercent.toFixed(2)}%</small>
                                </h3>
                                <p>P&amp;L</p>
                            </div>
                            <hr />
                            <div className="second">
                                <p>Current Value <span>{currentValue.toFixed(2)}</span></p>
                                <p>Investment <span>{totalInvestment.toFixed(2)}</span></p>
                            </div>
                        </div>

                        <div className="order-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Instrument</th>
                                        <th>Qty.</th>
                                        <th>Avg. cost</th>
                                        <th>LTP</th>
                                        <th>Cur. val</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {holdings.map((stock) => (
                                        <tr key={stock.instrumentKey}>
                                            <td>{stock.name}</td>
                                            <td>{stock.qty}</td>
                                            <td>{Number(stock.avg).toFixed(2)}</td>
                                            <td>{Number(stock.price).toFixed(2)}</td>
                                            <td>{(stock.price * stock.qty).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                <hr className="divider" />
            </div>
        </>
    )
}

export default Summary
