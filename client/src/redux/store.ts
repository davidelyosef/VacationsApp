import { createStore } from "redux";
import { reducer } from "./reducer";
import { AppState } from "./appState";


export const store = createStore(reducer, new AppState())
