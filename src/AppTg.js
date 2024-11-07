import { useIntegration } from '@telegram-apps/react-router-integration';
import {
    bindMiniAppCSSVars,
    bindThemeParamsCSSVars,
    bindViewportCSSVars,
    initNavigator, useLaunchParams, useInitData,
    useMiniApp,
    useThemeParams,
    useViewport,
} from '@telegram-apps/sdk-react';

import { AppRoot } from '@telegram-apps/telegram-ui';
import { UrlHashContext } from './utils/Context';
import { useEffect, useMemo } from 'react';
import {
    Navigate,
    Route,
    Router,
    Routes,
} from 'react-router-dom';

import Tele_Game from './Pages/Tele-Game';
import Tele_Home from './Pages/Tele-Home';
import Tele_Rank from './Pages/Tele-Rank';
import Tele_Earn from './Pages/Tele-Earn';
import Tele_Invite from './Pages/Tele-Invite';

let routes = [
    { path: '/', Component: Tele_Game },
    { path: '/tele_home', Component: Tele_Home, title: 'Home' },
    { path: '/tele_rank', Component: Tele_Rank, title: 'Rank' },
    { path: '/tele_earn', Component: Tele_Earn, title: 'Earn' },
    { path: '/tele_invite', Component: Tele_Invite, title: 'Earn' },
    { path: '/tele_game', Component: Tele_Game, title: 'Game' },
];

function AppTg() {
    const lp = useLaunchParams();
    const miniApp = useMiniApp();
    const themeParams = useThemeParams();
    const viewport = useViewport();

    const initData = useInitData();

    console.log(`[AppTg] before routes:`, routes);
    let p = sessionStorage.getItem('____path');
    if (p == "tele_earn") {
        routes[0] = { path: '/', Component: Tele_Earn }
    } else if (p == "tele_rank") {
        routes[0] = { path: '/', Component: Tele_Rank }
    } else if (p == "tele_invite") {
        routes[0] = { path: '/', Component: Tele_Invite }
    }
    console.log(`[AppTg] after routes:`, routes);
    console.log(`[AppTg] lp:`, lp);
    console.log(`[AppTg] key: ${process.env.REACT_APP_API_KEY}`);
    console.log(`[AppTg] iv: ${process.env.REACT_APP_API_IV}`);
    console.log(`[AppTg] api url: ${process.env.REACT_APP_API_URL}`);
    console.log(`[AppTg] public url: ${process.env.PUBLIC_URL}`);
    console.log(`[AppTg] initData: `, initData);

    let hash = window.location.hash.slice(1);
    console.log(`[AppTg] hash: `, hash);
    console.log(`[AppTg] location:`, window.location.toString());
    
    // Detect whether is telegram launch param
    if (hash.search('tgWebAppData') >= 0) {
        console.log(`[AppTg] Store url hash into session storage.`);
        sessionStorage.setItem('____tghash', hash);

    } else {
        hash = sessionStorage.getItem('____tghash');
        console.log(`[AppTg] Load url hash:`, hash);
    }

    useEffect(() => {
        return bindMiniAppCSSVars(miniApp, themeParams);
    }, [miniApp, themeParams]);

    useEffect(() => {
        return bindThemeParamsCSSVars(themeParams);
    }, [themeParams]);

    useEffect(() => {
        return viewport && bindViewportCSSVars(viewport);
    }, [viewport]);

    // Create a new application navigator and attach it to the browser history, so it could modify
    // it and listen to its changes.
    const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
    const [location, reactNavigator] = useIntegration(navigator);

    console.log(`[AppTg] location:`, location);
    console.log(`[AppTg] reactNavigator:`, reactNavigator);

    // Don't forget to attach the navigator to allow it to control the BackButton state as well
    // as browser history.
    useEffect(() => {
        navigator.attach();
        return () => navigator.detach();
    }, [navigator]);
    
    /*
    useEffect(() => {
        let p = sessionStorage.getItem('____path');
        let r = "";
        let h = "";

        if (hash.substr(0,1) == "?") {
            h = hash
        } else {
            h = "?" + hash;
        }

        console.log(`[AppTg] session path:`, p);
        switch (p) {
            case "tele_earn":                
                //r = "https://" + window.location.hostname + "/#" + p + h;
                r = "#" + p;
                console.log(`[AppTg] 2. Navigate to tele_earn:`, r);
                window.location.hash = r;
                break;

            case "tele_invite":                
                //r = "https://" + window.location.hostname + "/#" + p + h;
                r = "#" + p;
                console.log(`[AppTg] 2. Navigate to tele_invite:`, r);
                window.location.hash = r;
                break;

            case "tele_rank":
                //r = "https://" + window.location.hostname + "/#" + p + h;
                r = "#" + p;
                console.log(`[AppTg] 2. Navigate to tele_rank:`, r);
                window.location.hash = r;
                break;
        }
    }, []);
    */

    return (
        <AppRoot
            appearance={miniApp.isDark ? 'dark' : 'light'}
            platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
        >
            <UrlHashContext.Provider value={hash}>
            
            <Router location={location} navigator={reactNavigator}>
                <Routes>
                    {routes.map((route) => <Route key={route.path} {...route} />)}
                    <Route path='*' element={<Navigate to='/'/>}/>
                </Routes>
            </Router>

            </UrlHashContext.Provider>
        </AppRoot>
    );

    /*
                    <Route path="/" element={<Tele_Home />} />
                    <Route path="/tele_home" element={<Tele_Home />} />
                    <Route path="/tele_rank" element={<Tele_Rank />} />
                    <Route path="/tele_earn" element={<Tele_Earn />} />
                    <Route path="/tele_invite" element={<Tele_Invite />} />
                    <Route path="/home" element={<Home />} />

    */
}


export default AppTg;
