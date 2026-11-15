# 📈 Tradify

A full-stack stock trading platform built with the **MERN stack**. Tradify pairs a public marketing website with a trading dashboard for watchlists, orders, holdings and positions, powered by a layered Express API, MongoDB and a WebSocket server for real-time updates.
> Built to understand how real-world brokerage platforms are structured end to end: landing site, trading dashboard, real-time layer and backend API.

---

## ✨ Features

- **Landing website** with product, pricing, support and signup pages
- **Trading dashboard** with watchlist, holdings, positions, orders and funds views
- **Buy / Sell orders** placed from the dashboard and stored in MongoDB
- **Live market data** streamed from the **Upstox API** over WebSockets, with the backend subscribed to an initial set of stocks and relaying ticks to the dashboard in real time
- **Stock search**: search for stocks and add them to the watchlist
- **Watchlist-driven subscriptions**: adding a stock to the watchlist automatically subscribes it to the live feed
- **Layered backend architecture**: routes → controllers → services → models, with middlewares for request handling
- **Database seeding** script to preload stock data
- **Environment-based config** via `.env.example` templates

## 🛠️ Tech Stack

| Layer      | Technologies                                    |
| ---------- | ----------------------------------------------- |
| Frontend   | React.js, React Router, CSS                     |
| Dashboard  | React.js, Axios, charting library               |
| Backend    | Node.js, Express.js, WebSocket                  |
| Market Data| Upstox API (live feed)                          |
| Database   | MongoDB, Mongoose                               |
| Config     | dotenv                                          |
| Tools      | Git, GitHub, Postman                            |

## 📁 Project Structure

```
Tradify/
├── frontend/                 # Public marketing website (React)
│   ├── public/
│   └── src/
├── dashboard/                # Trading dashboard (React)
│   ├── public/
│   ├── src/
│   └── .env.example
├── backend/
│   ├── Controllers/          # Request handlers
│   ├── Middlewares/          # Express middlewares
│   ├── model/                # Mongoose models
│   ├── schemas/              # Schema definitions
│   ├── Routes/               # API route definitions
│   ├── Services/             # Business logic layer
│   ├── util/                 # Helper utilities
│   ├── Websocket/            # WebSocket server + Upstox live feed handling
│   ├── index.cjs             # App entry point
│   ├── seedStocks.js         # Seeds initial stock data
│   ├── Dockerfile
│   └── .env.example
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or above
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/PoojaBansal2405/Tradify.git
cd Tradify
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env     # then fill in your values (MongoDB URL, port, etc.)
node seedStocks.js       # optional: seed stock data
node index.cjs
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

### 4. Dashboard

```bash
cd dashboard
npm install
cp .env.example .env
npm start
```

> Run backend, frontend and dashboard in separate terminals.

## 🔐 Environment Variables

Each service ships with a `.env.example`. Copy it to `.env` and fill in the values (MongoDB URL, port, Upstox API credentials and access token, etc.). Never commit your real `.env` file.

> **Note:** Upstox access tokens are short-lived, so you will need to refresh the token before starting the backend for live data to work.

## 📡 How Live Data Works

1. The backend authenticates with the Upstox API and opens its market data WebSocket feed.
2. It subscribes to an initial, limited set of stocks (seeded via `seedStocks.js`).
3. Incoming ticks are processed and broadcast to connected dashboard clients through the app's own WebSocket server.
4. The dashboard updates watchlist prices in real time.
5. Users can search for any stock and add it to their watchlist. When a stock is added, a subscribe function is triggered and the stock is added to the live Upstox feed, so its price starts streaming automatically.

## 🧠 What I Learned

- Structuring a multi-app MERN project (website, dashboard, API)
- Building a layered backend with controllers, services and middlewares
- Integrating a third-party market data API (Upstox) and streaming it to clients via WebSockets
- Managing live subscriptions dynamically, tied to user watchlist actions
- Seeding and modelling data in MongoDB

## 🔮 Future Improvements

- [ ] Automatic Upstox token refresh
- [ ] Portfolio P&L analytics
- [ ] Unit and integration tests
- [ ] Complete the Docker setup, CI/CD pipeline and cloud deployment

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Fork the repo, create a branch and open a pull request.

## 👩‍💻 Author

**Pooja Bansal**
GitHub: [@PoojaBansal2405](https://github.com/PoojaBansal2405)

---

⭐ If you found this project useful, consider giving it a star!
