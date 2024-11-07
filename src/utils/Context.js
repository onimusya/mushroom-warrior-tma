import { createContext } from 'react';

export const UrlHashContext = createContext(null);
export const TelegramTaskContext = createContext(null);
export const TasksStatusContext = createContext([0, 0, 0]);
export const TasksListContext = createContext([]);
export const TonConnectUiContext = createContext(null);

