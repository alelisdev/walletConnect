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
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from './DialogTitle'
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';


const connectWalletTypes = ['Metamask', 'WalletConnect'];

const ColorButton = withStyles((theme) => ({
    root: {
        width: '105px',
        height: '35px',
        color: 'black',
        paddingTop: '2px',
        paddingBottom: '2px',
        marginLeft: '20px',
        borderRadius: 20,
        textTransform: 'none',
        backgroundColor: '#f0b90b !important',
        '&:hover': {
            opacity: '.7',
            backgroundColor: '#ffce31 !important',
            borderColor: '#f4c144 !important',
        },
        '&:active': {
            border: '3px solid #775d08',
        },
    },
}))(Button);

const useStyles = makeStyles({
    dialogPaper: {
        width: 583,
        height: 224,
        ['@media (min-width:1200px)']: { // eslint-disable-line no-useless-computed-key
            width: 583
        },
        ['@media (min-width:900px)']: { // eslint-disable-line no-useless-computed-key
            width: 583
        },
        ['@media (max-width:600px)']: { // eslint-disable-line no-useless-computed-key
            width: '80%'
        }
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
      backgroundColor: blue[100],
      color: blue[600],
    },
    list: {
        width: '100%',
    },
    listItem: {
        height: 40,
        margin: 10,
        padding: '5.5px 20px',
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0b90b !important',
        borderRadius: '12px',
        border: '1px solid #f0b90b',
        '&:hover': {
            border: '1px solid black'
        },
        '& > h4': {
          margin: 0
        },
        cursor: 'pointer'
      }
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
        if (value === "Metamask") props.connectMetamask();
        else props.walletConnect();
    };

    return (
        <Dialog 
            classes={{ paper : classes.dialogPaper}}
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={open}
            maxWidth={false}
        >
            <div>
                <DialogTitle id="simple-dialog-title" onClose={handleClose} children = 'Connect to a wallet'></DialogTitle>
                <div className={classes.list}>
                    {connectWalletTypes.map((type) => (
                    <div className={classes.listItem} onClick={() => handleListItemClick(type)} key={type}>
                        <h4 style ={{position: 'absolute', left: 30}}>{type}</h4>
                        <div style ={{position: 'absolute', right: 30}}className={classes.image}>
                            {type === "Metamask" && (
                                <img className="swap-connect-wallet-image" src={metamaskImage} alt="metamaskImage" />
                            )}
                            {type === "WalletConnect" && (
                                <img className="swap-connect-wallet-image" src={walletConnectImage} alt="walletConnectImage" />
                            )}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            
        </Dialog>
    );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

function Header() {
    const classes = useStyles();
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
        try {
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
        } catch (err) {
            console.log(err.message)
        }
    }

    const walletConnect = async () => {
        try {
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
        } catch (err) {
            console.log(err.message);
        }
    }
  
    const getAbbrWalletAddress = (walletAddress) => {
        let abbrWalletAddress = walletAddress.substring(0, 4) + "..." + walletAddress.substring(38, 42);
        return abbrWalletAddress.toUpperCase();
    }

    return (
        <div className="header">
            <div>
                <SimpleDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                    connectMetamask={connectMetamask}
                    walletConnect={walletConnect}
                />
            </div>
            <div className={classes.header}>
                {/* <Row> */}
                    <div style = {{position: 'absolute', left: '20px'}} className="header-section" style={{color: '#f0b90b'}}>
                        <a className="header-link" href="https://www.klear.finance" style={{ marginRight: "10px" }}>
                            <img src={logo} alt="Logo" width="92px" height="92px" />
                        </a>
                        BUSDHarvest
                    </div>
                    <div style = {{position: 'absolute', right: '20px'}} className="header-section">
                        {walletAddress === "" && (
                            <ColorButton onClick={() => handleClickOpen()}>
                                connect
                            </ColorButton>
                        )}
                        {walletAddress !== "" && (
                            <ColorButton className="header-connect-btn" onClick={() => handleClickOpen()}>
                                {getAbbrWalletAddress(walletAddress)}
                            </ColorButton>
                        )}
                    </div>
                {/* </Row> */}
            </div>
        </div>
    );
}

export default Header;