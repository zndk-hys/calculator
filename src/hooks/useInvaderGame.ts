import { useEffect, useRef } from "react";
import { actions } from "../actions";
import { contexts } from "../contexts";
import { AppAction, State } from "../types";

export default function useInvaderGame(state: State, dispatch: React.ActionDispatch<[AppAction]>): void {
    const tickTimerId = useRef<number>(null);

    // INV_POINT になってから一定時間経過後、INV_PLAY をディスパッチ
    useEffect(() => {
        if ( state.context === contexts.INV_POINT ) {
            const timerId = setTimeout(() => {
                dispatch({type: actions.INV_PLAY});
            }, 1500);

            return () => {
                if (timerId) clearTimeout(timerId);
            }
        }
    }, [state.context, dispatch]);

    // INV_POINT の間 INV_TICK を定期的にディスパッチ
    useEffect(() => {
        if ( state.context === contexts.INV_PLAY ) {
            const tick = () => {
                dispatch({type: actions.INV_TICK, payload: {newEnemy: String(Math.floor(Math.random() * 10))}});

                tickTimerId.current = setTimeout(tick, 1500);
            }

            tick();
        }

        return () => {
            if (tickTimerId.current) clearTimeout(tickTimerId.current);
        }   
    }, [state.context, dispatch]);

    // INV_OVER になってから一定時間後、INV_END をディスパッチ
    useEffect(() => {
        if ( state.context === contexts.INV_OVER ) {
            const timerId = setTimeout(() => {
                dispatch({type: actions.INV_END});
            }, 1000);

            return () => {
                if (timerId) clearTimeout(timerId);
            }
        }
    }, [state.context, dispatch]);
}