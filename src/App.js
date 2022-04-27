import * as React from 'react';
import logo from './logo.svg';
import Header from './components/Header';
import { BrowserRouter, Switch, Route,} from 'react-router-dom';
import './App.css';
import TradeContext from './context/TradeContext';
import { UseWalletProvider } from 'use-wallet'
import TransakSDK from "@transak/transak-sdk";

function App() {
    const [walletAddress, setWalletAddress] = React.useState("");
    const [web3Instance, setWeb3Instance] = React.useState(null);
    const settings = {
        apiKey: 'e5736e04-4b3f-429a-919d-28ef20c6f64e',  // Your API Key
        environment: 'STAGING', // STAGING/PRODUCTION
        defaultCryptoCurrency: 'BNB',
        themeColor: '#242222', // App theme color
        hostURL: window.location.origin,
        widgetHeight: "600px",
        widgetWidth: "400px",
    }

    const openTransak = () => {
        const transak = new TransakSDK(settings);
    
        transak.init();
        // To get all the events
        transak.on(transak.ALL_EVENTS, (data) => {
            console.log(data)
        });
    
        // This will trigger when the user marks payment is made.
        transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
            console.log(orderData);
            transak.close();
        });
    }
    return (
        <UseWalletProvider
            chainId={56}
            connectors={{
                walletconnect: { rpcUrl: 'https://bsc-dataseed.binance.org/' },
            }}
        >
            <BrowserRouter basename="">
                <Switch>
                    <TradeContext.Provider value={{ walletAddress, setWalletAddress, web3Instance, setWeb3Instance, openTransak }} >
                        <Route exact path="/">
                            <div className="App">
                                <Header />
                            </div>
                        </Route>    
                    </TradeContext.Provider>
                </Switch>
            </BrowserRouter>
        </UseWalletProvider>
        
    );
}

export default App;
