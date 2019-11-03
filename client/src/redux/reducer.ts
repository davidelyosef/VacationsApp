import { AppState } from "./appState";
import { AnyAction } from "redux";
import { ActionType } from "./actionType";

export function reducer(oldAppState: AppState | undefined, action: AnyAction): AppState {

    if (!oldAppState) {
        return new AppState();
    }

    const newAppState = { ...oldAppState };

    switch (action.type) {
        // bring all the vacations from the server
        case ActionType.getAllVacations:
            newAppState.vacations = action.payload;
            break;
        // adding new vacation
        case ActionType.addVacation:
            newAppState.vacations.push(action.payload);
            break;
        // unshift new vacation
        case ActionType.unshiftVacation:
            newAppState.vacations.unshift(action.payload);
            break;
        // update a vacation
        case ActionType.updateVacation:
            for (let i = 0; i < newAppState.vacations.length; i++) {
                if (newAppState.vacations[i].vacationID === action.payload.vacationID) {
                    newAppState.vacations[i] = action.payload;
                    break;
                }
            }
            break;
        // delete a vacation
        case ActionType.deleteVacation:
            for (let i = 0; i < newAppState.vacations.length; i++) {
                if (newAppState.vacations[i].vacationID === action.payload) {
                    newAppState.vacations.splice(i, 1);
                    break;
                }
            }
            break;


        // bring the username who logged in
        case ActionType.getUser:
            newAppState.logged = action.payload;
            break;
        // adding new user
        case ActionType.addUser:
            newAppState.users.push(action.payload);
            break;
        // bring all the users from the server
        case ActionType.getAllUsers:
            newAppState.users = action.payload;
            break;
    }
    return newAppState;
}