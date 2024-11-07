import React, { useState, useContext, useEffect } from 'react';
import { TonConnectUiContext } from '../utils/Context';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toUserFriendlyAddress } from '@tonconnect/sdk';
import { Address } from "@ton/ton";
import { useCloudStorage } from '@telegram-apps/sdk-react';

function Tele_Header() {
    const cloudStorage = useCloudStorage();
    const { tonConnectUi, tonConnectedWallet, tonClient } = useContext(TonConnectUiContext);    
    const [isSticky, setIsSticky] = useState(false);
    const [isWalletConnect, setIsWalletConnect] = useState(false);

    let statusUnsubscribe = null;

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        iconColor: 'white',
        customClass: {
          popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
    })

    useEffect(() => {

        const handleScroll = () => {
          if (window.scrollY > 100) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }
        };
    
        window.addEventListener('scroll', handleScroll);
            
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    useEffect(() => {
        
        const run = async () => {

            if (window.Telegram) {
                let lastWallet = await cloudStorage.get('last-wallet');
                console.log(`[Tele_Header][useEffect][tonConnectedWallet] Last Wallet:`, lastWallet);    
            }

            console.log(`[Tele_Header][useEffect][tonConnectedWallet] walletInfo:`, tonConnectedWallet);
            if (tonConnectedWallet !== null) {
                setIsWalletConnect(true);
                console.log(`[Tele_Header][useEffect][tonConnectedWallet] tonConnectUi:`, tonConnectUi);
                console.log(`[Tele_Header][useEffect][tonConnectedWallet] wallet:`, tonConnectUi.wallet);
                console.log(`[Tele_Header][useEffect][tonConnectedWallet] account:`, tonConnectUi.account);
    

                let userFriendlyAddress = ""
                if (tonConnectUi.account.chain == '-239') {
                    userFriendlyAddress = toUserFriendlyAddress(tonConnectUi.account.address);
                } else {
                    userFriendlyAddress = toUserFriendlyAddress(tonConnectUi.account.address, true);
                }
                const addr = Address.parse(userFriendlyAddress);

                if (window.Telegram) {
                    await cloudStorage.set('last-wallet', userFriendlyAddress);
                }
                
                console.log(`[Tele_Header][useEffect][tonConnectedWallet] User Friendly Address:`, userFriendlyAddress);
                console.log(`[Tele_Header][useEffect][tonConnectedWallet] Raw Address:`, addr);
                
                console.log(`[Tele_Header][useEffect][tonConnectedWallet] tonClient:`, tonClient);

                const isWalletDeployed = await tonClient.isContractDeployed(tonConnectUi.account.address);
                console.log(`[Tele_Header][useEffect][tonConnectedWallet] Wallet Deployed:`, isWalletDeployed);
                if (isWalletDeployed) {
                    // const walletContract = tonClient.open(tonConnectUi.account);
                    // console.log(`[Tele_Header][useEffect][tonConnectedWallet] Wallet Contract:`, walletContract);
                    const balance = await tonClient.getBalance(userFriendlyAddress);
                    console.log(`[Tele_Header][useEffect][tonConnectedWallet] Balance:`, balance);
                    console.log(`[Tele_Header][useEffect][tonConnectedWallet] Type of Balance:`, typeof balance);

                    // Call get method
                    let result = await tonClient.runMethod(
                        addr,
                        'seqno'
                    );                                        
                    console.log(`[Tele_Header][useEffect][tonConnectedWallet] SeqNo Result:`, result);
                    let seqno = result.stack.readNumber();
                    console.log(`[Tele_Header][useEffect][tonConnectedWallet] SeqNo:`, seqno);

                    const contractProvider = tonClient.provider(addr);
                    console.log(`[Tele_Header][useEffect][tonConnectedWallet] Contract Provider:`, contractProvider);

                    result = await contractProvider.get('seqno', []);
                    seqno = result.stack.readNumber();
                    console.log(`[Tele_Header][useEffect][tonConnectedWallet] SeqNo 2:`, seqno);                    
                }

            } else {
                setIsWalletConnect(false);
            }
        }

        run();

    }, [tonConnectedWallet]);

    async function handleConnect() {
        console.log(`[Tele_Header][handleConnect] ...`);

        try {

            await tonConnectUi.openModal();

            const currentWallet = tonConnectUi.wallet;
            const currentWalletInfo = tonConnectUi.walletInfo;
            const currentAccount = tonConnectUi.account;
            const currentIsConnectedStatus = tonConnectUi.connected;
            let userFriendlyAddress = ""

            if (tonConnectedWallet != null) {
                if (tonConnectUi.account.chain == '-239') {
                    userFriendlyAddress = toUserFriendlyAddress(currentAccount.address);
                } else {
                    userFriendlyAddress = toUserFriendlyAddress(currentAccount.address, true);
                }
            }            

            console.log(`[Tele_Header][handleConnect] currentWallet:`, currentWallet);
            console.log(`[Tele_Header][handleConnect] currentWalletInfo:`, currentWalletInfo);
            console.log(`[Tele_Header][handleConnect] currentAccount:`, currentAccount);
            console.log(`[Tele_Header][handleConnect] User Friendly Address:`, userFriendlyAddress);
            console.log(`[Tele_Header][handleConnect] currentIsConnectedStatus:`, currentIsConnectedStatus);

        } catch (error) {
            console.log(`[Tele_Header][handleConnect] Error:`, error);
            withReactContent(Swal).fire({
                title: "Error!",
                text: "Fail to connect TON wallet!",
                icon: "error",      
            });
        }
        
        

    }

    async function handleDisconnect() {
        console.log(`[Tele_Header][handleDisconnect] ...`);
        await tonConnectUi.disconnect();
        setIsWalletConnect(false);
    }

    async function handleSign() {
        console.log(`[Tele_Header][handleSign] ...`);

    }
    return (
        <header className={`
            ${isSticky ? 'fixed top-0 bg-[#001D42] shadow-md' : 'absolute'} 
            left-0 right-0 flex items-center p-2 z-50 transition-all duration-300 ease-in-out
        `}>
            <div className="max-w-[1080px] mx-auto flex items-center w-full">
                {
                    isSticky ? (
                        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="w-12 h-12 mr-10" />
                    ) : (
                        <></>
                    )
                }        
                <nav className="flex justify-end w-full font-['Impact'] font-normal text-white text-xl">
                    {
                        isWalletConnect ? (
                            <>

                                <button onClick={handleDisconnect} className="rounded-2xl bg-yellow-500 px-3.5 py-2.5 text-sm font-normal text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500">
                                    Disconnect
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleConnect} className="rounded-2xl bg-yellow-500 px-3.5 py-2.5 text-sm font-normal text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500">
                                    Connect Wallet
                                </button>
                            </>
                        )
                    }
                    
                </nav>
            </div>
        </header>
    );
}
    
export default Tele_Header;