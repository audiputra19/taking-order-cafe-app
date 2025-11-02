import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiProduct } from "../services/apiProduct";
import { apiOrder } from "../services/apiOrder";
import authSlice from './authSlice'
import darkMode from './darkModeSlice'
import { apiAuth } from "../services/apiAuth";
import { apiUser } from "../services/apiUser";
import { apiDashboard } from "../services/apiDashboard";
import { apiProfile } from "../services/apiProfile";
import { apiVoucher } from "../services/apiVoucher";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'darkMode']
}

const rootReducer = combineReducers({
    auth: authSlice,
    darkMode: darkMode,
    [apiProduct.reducerPath]: apiProduct.reducer,
    [apiOrder.reducerPath]: apiOrder.reducer,
    [apiAuth.reducerPath]: apiAuth.reducer,
    [apiUser.reducerPath]: apiUser.reducer,
    [apiDashboard.reducerPath]: apiDashboard.reducer,
    [apiProfile.reducerPath]: apiProfile.reducer,
    [apiVoucher.reducerPath]: apiVoucher.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(
            apiProduct.middleware,
            apiOrder.middleware,
            apiAuth.middleware,
            apiUser.middleware,
            apiDashboard.middleware,
            apiProfile.middleware,
            apiVoucher.middleware,
        )
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;