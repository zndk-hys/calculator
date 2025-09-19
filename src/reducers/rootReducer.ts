import { isCalculatorContext, isInvaderContext } from "../contexts";
import { AppAction, State } from "../types";
import calcuratorReducer from "./calcuratorReducer";
import invaderReducer from "./invaderReducer";

export default function rootReducer(state: State, action: AppAction): State {
    if (isCalculatorContext(state)) {
        return calcuratorReducer(state, action);
    }

    if (isInvaderContext(state)) {
        return invaderReducer(state, action);
    }

    return state;
}