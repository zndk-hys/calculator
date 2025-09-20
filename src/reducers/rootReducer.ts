import { isCalculatorContext, isInvaderContext } from "../contexts";
import { AppAction, State } from "../types";
import calcuratorReducer from "./calcuratorReducer";
import invaderReducer from "./invaderReducer";

export default function rootReducer(state: State, action: AppAction): State {
    const calcurator = calcuratorReducer(state, action);
    const invader = invaderReducer(state, action);

    // contextの変更を管理
    // 電卓モードの場合はcalcuratorReducer、インベーダーゲームモードの場合はinvaderReducerのcontxtOfferに従う
    let context = state.context;
    if ( isCalculatorContext(state) && calcurator.calcurator.contextOffer) {
        context = calcurator.calcurator.contextOffer;
    } else if ( isInvaderContext(state) && invader.invader.contextOffer) {
        context = invader.invader.contextOffer;
    }

    return {
        ...state,
        context,
        calcurator: calcurator.calcurator,
        invader: invader.invader,
    }
}