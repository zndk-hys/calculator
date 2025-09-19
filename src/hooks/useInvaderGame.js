import { useEffect, useRef } from "react";
import { actions } from "../actions";
import { states } from "../states";

export default function useInvaderGame(state, dispatch) {
    const tickTimerId = useRef();

    // INV_POINT になってから一定時間経過後、INV_PLAY をディスパッチ
    useEffect(() => {
        if ( state.state === states.INV_POINT ) {
            const timerId = setTimeout(() => {
                dispatch({type: actions.INV_PLAY});
            }, 1500);

            return () => {
                if (timerId) clearTimeout(timerId);
            }
        }
    }, [state.state, dispatch]);

    // INV_POINT の間 INV_TICK を定期的にディスパッチ
    useEffect(() => {
        if ( state.state === states.INV_PLAY ) {
            const tick = () => {
                dispatch({type: actions.INV_TICK, payload: {newEnemy: String(Math.floor(Math.random() * 10))}});

                tickTimerId.current = setTimeout(tick, 1500);
            }

            tick();
        }

        return () => {
            if (tickTimerId.current) clearTimeout(tickTimerId.current);
        }   
    }, [state.state, dispatch]);

    // INV_OVER になってから一定時間後、INV_END をディスパッチ
    useEffect(() => {
        if ( state.state === states.INV_OVER ) {
            const timerId = setTimeout(() => {
                dispatch({type: actions.INV_END});
            }, 1000);

            return () => {
                if (timerId) clearTimeout(timerId);
            }
        }
    }, [state.state, dispatch]);
}