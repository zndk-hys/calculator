import { isCalculatorContext, isInvaderContext } from "../contexts";
import calcuratorReducer from "./calcuratorReducer";
import invaderReducer from "./invaderReducer";

export default function rootReducer(state, action) {
    if (isCalculatorContext(state)) {
        return calcuratorReducer(state, action);
    }

    if (isInvaderContext(state)) {
        return invaderReducer(state, action);
    }

    return state;
}