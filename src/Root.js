import { SDKProvider, useLaunchParams } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Router } from 'react-router-dom';

import App  from './App';
import AppTg from './AppTg';
import Tele_Error from './Pages/Tele-Error';

import { TonConnectUiContext } from './utils/Context';
import { TonConnectUI } from '@tonconnect/ui';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

export function Root() {
    const [tonConnectUi, setTonConnectUi] = useState(null);
    const [tonConnectedWallet, setTonConnectedWallet] = useState(null);
    const [tonClient, setTonClient] = useState(null);
    
    const debug = useLaunchParams().startParam === 'debug';

    async function tonStatusChange (walletInfo) {
        console.log(`[Root][tonStatusChange] walletInfo: `, walletInfo);
        
        let endpoint = "";
    
        if (walletInfo) {
            if (walletInfo.account.chain == '-239') {
                // Main net
                endpoint = await getHttpEndpoint( { network: 'mainnet' });
            } else {
                // Test net
                endpoint = await getHttpEndpoint( { network: 'testnet' });
            }
            console.log(`[Root][tonStatusChange] Network Endpoint: `, endpoint);
            const client = new TonClient( { endpoint });
            setTonClient(client);
        }
    
        setTonConnectedWallet(walletInfo);
    }
    
    function tonConnectionStarted(event) {
        console.log(`[Root][tonConnectionStarted] Event:`, event);
    }
    
    function tonConnectionCompleted(event) {
        console.log(`[Root][tonConnectionCompleted] Event:`, event);
    }
    
    function tonConnectionError(event) {
        console.log(`[Root][tonConnectionError] Event:`, event);
    }  
    
    function tonConnectionRestoringStarted(event) {
        console.log(`[Root][tonConnectionRestoringStarted] Event:`, event);
    }
    
    function tonDisconnection(event) {
        console.log(`[Root][tonDisconnection] Event:`, event);
    }   

    useEffect(() => {

                
        let tonStatusUnsubscribe = null;
        const tcUi = new TonConnectUI({
            manifestUrl: 'https://mw-app.connesis.com/tonconnect-manifest.json',
            buttonRootId: null
        });    
    
        console.log(`[Root][useEffect] tonConnectUI:`, tcUi);
    
        tonStatusUnsubscribe = tcUi.onStatusChange(tonStatusChange);
    
        setTonConnectUi(tcUi);
    
        window.addEventListener("ton-connect-connection-started", tonConnectionStarted);
        window.addEventListener("ton-connect-connection-completed", tonConnectionCompleted);
        window.addEventListener("ton-connect-connection-error", tonConnectionError);
        window.addEventListener("ton-connect-connection-restoring-started", tonConnectionRestoringStarted);
        window.addEventListener("ton-connect-disconnection", tonDisconnection);
    
        return () => {
            tonStatusUnsubscribe();
            window.removeEventListener("ton-connect-connection-started", tonConnectionStarted);
            window.removeEventListener("ton-connect-connection-completed", tonConnectionCompleted);
            window.removeEventListener("ton-connect-connection-error", tonConnectionError);
            window.removeEventListener("ton-connect-connection-restoring-started", tonConnectionRestoringStarted);
            window.removeEventListener("ton-connect-disconnection", tonDisconnection);
        }
    }, []);    
    let hash = window.location.hash.slice(1);
    console.log(`[Root] hash:`, hash);
    console.log(`[Root] location:`, window.location.toString());
    
    switch (hash) {
        case "tele_earn":
        case "tele_invite":
        case "tele_rank":
            sessionStorage.removeItem('app-navigation-state');
            sessionStorage.setItem('____path', hash);
            break;

        /*    
        default:
            let p = sessionStorage.getItem('____path');
            sessionStorage.setItem('____path', "");
            console.log(`[Root] path:`, p);

            if (p == "tele_earn" || p == "tele_invite" || p == "tele_rank") {
                let h = "";
                if (hash.substr(0,1) == "?") {
                    h = hash
                } else {
                    h = "?" + hash;
                }
        
                let r = "https://" + window.location.hostname + "/#/" + p + h;
                console.log(`[Root] 4. Redirect again:`, r);      
                
                window.location.hash = p;

            }
            break;
            */
    }
    
    try {
        hash = window.location.hash.slice(1);

        let debug = useLaunchParams().startParam === 'debug';
        
        /*
        const manifestUrl = useMemo(() => {
            return new URL('tonconnect-manifest.json', window.location.href).toString();
        }, []);
        */
    
        // Enable debug mode to see all the methods sent and events received.
       // useEffect(() => {
       //     if (debug) {
        //            import('eruda').then((lib) => lib.default.init());
        //    }
        //}, [debug]);
    
        // Check whether is under mocking or real telegram env
        let shouldMock = !!sessionStorage.getItem('____mocked');
        // let shouldMock = false;
        //if (shouldMock) {
        //    return (
        //        <SDKProvider acceptCustomStyles debug={debug}>
        //                <App />
        //        </SDKProvider>
        //    )
        //} else {
            return (
                <SDKProvider acceptCustomStyles debug={debug}>
                    <AppTg />
                </SDKProvider>
            );    
        //}
    
    } catch (error) {
        console.log(`[Root] Error:`, error);
        return (
            <>
                <Tele_Error></Tele_Error>
            </>
        );                
    }
}
