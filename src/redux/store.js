import { applyMiddleware, compose, createStore } from "redux";

import { routerMiddleware } from "react-router-redux";

import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native

import reducer from "./reducer";
import rootSaga from "./sagas";
import { browserHistory } from "react-router";
const router = routerMiddleware(browserHistory);

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

const sagaMiddleware = createSagaMiddleware();



const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware, router)
);

persistStore(store);
sagaMiddleware.run(rootSaga);

export default store;
