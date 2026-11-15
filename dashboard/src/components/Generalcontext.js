import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
    openBuyWindow: (uid, price, instrumentKey) => { },
    closeBuyWindow: () => { },
    openSellWindow: (uid, price, instrumentKey) => { },
    closeSellWindow: () => { },
});

export const GeneralContextProvider = (props) => {

    const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
    const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);

    const [selectedStockUid, setSelectedStockUid] = useState("");
    const [selectedStockPrice, setSelectedStockPrice] = useState(0.0);
    const [selectedInstrumentKey, setSelectedInstrumentKey] = useState("");

    const handleOpenBuyWindow = (uid, price, instrumentKey) => {

        setIsBuyWindowOpen(true);
        setIsSellWindowOpen(false);

        setSelectedStockUid(uid);
        setSelectedStockPrice(price);
        setSelectedInstrumentKey(instrumentKey);
    };

    const handleOpenSellWindow = (uid, price, instrumentKey) => {

        setIsSellWindowOpen(true);
        setIsBuyWindowOpen(false);

        setSelectedStockUid(uid);
        setSelectedStockPrice(price);
        setSelectedInstrumentKey(instrumentKey);
    };

    const handleCloseBuyWindow = () => {
        setIsBuyWindowOpen(false);
        setSelectedStockUid("");
        setSelectedInstrumentKey("");
    };

    const handleCloseSellWindow = () => {
        setIsSellWindowOpen(false);
        setSelectedStockUid("");
        setSelectedInstrumentKey("");
    };

    return (
        <GeneralContext.Provider
            value={{
                openBuyWindow: handleOpenBuyWindow,
                closeBuyWindow: handleCloseBuyWindow,
                openSellWindow: handleOpenSellWindow,
                closeSellWindow: handleCloseSellWindow,
            }}
        >
            {props.children}

            {isBuyWindowOpen && (
                <BuyActionWindow
                    uid={selectedStockUid}
                    price={selectedStockPrice}
                    instrumentKey={selectedInstrumentKey}
                />
            )}

            {isSellWindowOpen && (
                <SellActionWindow
                    uid={selectedStockUid}
                    price={selectedStockPrice}
                    instrumentKey={selectedInstrumentKey}
                />
            )}
        </GeneralContext.Provider>
    );
};

export default GeneralContext;