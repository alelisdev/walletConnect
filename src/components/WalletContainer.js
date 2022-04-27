import * as React from "react";
import '../css/Header.css';
import { Container, Row, Col } from 'react-grid-system';
import logo from '../images/logo.png';
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import TradeContext from '../context/TradeContext';
import metamaskImage from '../images/metamask.svg';
import walletConnectImage from '../images/walletConnect.png';
import { useWallet } from 'use-wallet';
import WalletConnectProvider from "@walletconnect/web3-provider";

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';

const connectWalletTypes = ['Metamask', 'WalletConnect'];
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
        console.log(value);
        if (value == "Metamask") props.connectMetamask();
        else props.walletConnect();
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Connect to a wallet</DialogTitle>
            <List>
                {connectWalletTypes.map((type) => (
                <ListItem button onClick={() => handleListItemClick(type)} key={type}>
                    <ListItemAvatar>
                        {type == "Metamask" && (
                            <img className="swap-connect-wallet-image" src={metamaskImage} alt="metamaskImage" />
                        )}
                        {type == "WalletConnect" && (
                            <img className="swap-connect-wallet-image" src={walletConnectImage} alt="walletConnectImage" />
                        )}
                    </ListItemAvatar>
                    <ListItemText primary={type} />
                </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

function WalletContainer() {
    const wallet = useWallet();
    const { walletAddress, setWalletAddress, setWeb3Instance, openTransak } = React.useContext(TradeContext);
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(connectWalletTypes[0]);
    
    const handleClickOpen = () => {
        if (walletAddress === "") {
            setOpen(true);
        } else {
            setWalletAddress("");
            setWeb3Instance(null);
        }
    }

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };
    
    const connectMetamask = async () => {
        const currentProvider = await detectEthereumProvider();
        if (currentProvider) {
            let web3InstanceCopy = new Web3(currentProvider);
            setWeb3Instance(web3InstanceCopy);
            
            if (!window.ethereum.selectedAddress) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            }
            await window.ethereum.enable();
            let currentAddress = window.ethereum.selectedAddress;
            setWalletAddress(currentAddress);
            console.log("currentAddress", currentAddress);
        } else {
            console.log('Please install MetaMask!');
        }
    }

    const walletConnect = async () => {
        const currentProvider = new WalletConnectProvider({
            chainId: 56,
            rpc : {
                56 : 'https://bsc-dataseed.binance.org/'
            },
            qrcodeModalOptions: {
                mobileLinks: [
                    "rainbow",
                    "trust",
                    "argent",
                    "metamask",
                    "crypto.com",
                    "pillar",
                    "imtoken",
                    "onto",
                    "tokenpocket",
                    "mathwallet",
                    "bitpay",
                    "ledger"
                ]
            }
        });
        console.log(currentProvider);
        await currentProvider.enable();
        
        if (currentProvider) {
            // Subscribe to accounts change
            currentProvider.on("accountsChanged", async (accounts) => {
                console.log(accounts);
                let web3InstanceCopy = new Web3(currentProvider);
                setWeb3Instance(web3InstanceCopy);
                console.log(web3InstanceCopy);
                let walletAddressCopy = await web3InstanceCopy.eth.getAccounts();
                setWalletAddress(walletAddressCopy);
            });
            
            // Subscribe to chainId change
            currentProvider.on("chainChanged", (chainId) => {
                console.log(chainId);
            });
            
            // Subscribe to session connection
            currentProvider.on("connect", async () => {
                console.log("connect");
                let web3InstanceCopy = new Web3(currentProvider);
                setWeb3Instance(web3InstanceCopy);
                console.log(web3InstanceCopy);
                let walletAddressCopy = await web3InstanceCopy.eth.getAccounts();
                setWalletAddress(walletAddressCopy);
            });
            
            // Subscribe to session disconnection
            currentProvider.on("disconnect", (code, reason) => {
                console.log(code, reason);
                setWeb3Instance(null);
                setWalletAddress("");
            });
            
        }
    }
  
    const getAbbrWalletAddress = (walletAddress) => {
        let abbrWalletAddress = walletAddress.substring(0, 4) + "..." + walletAddress.substring(38, 42);
        return abbrWalletAddress.toUpperCase();
    }

    return (
        <div className="wallet-container">
            <div>
                <SimpleDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                    connectMetamask={connectMetamask}
                    walletConnect={walletConnect}
                />
            </div>
            <Container>
                <Row>
                    <Col sm={3} className="wallet-section wallet-section-none">
                    </Col>
                    <Col xs={12} sm={5} className="wallet-section">
                        {walletAddress === "" && (
                            <button className="wallet-connect-btn" onClick={() => handleClickOpen()}>
                                Connect Wallet
                            </button>
                        )}
                        {walletAddress !== "" && (
                            <button className="wallet-connect-btn" onClick={() => handleClickOpen()}>
                                {getAbbrWalletAddress(walletAddress)}
                            </button>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default WalletContainer;