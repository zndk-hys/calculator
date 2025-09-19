import { useEffect, useReducer, useRef } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import { calcReducer, initialState } from '../reducer';
import { actions } from '../actions';
import { states } from '../states';

export default function Calc({length}) {
    const [state, dispatch] = useReducer(calcReducer, {
        ...initialState,
        length,
    });
    const tickTimerId = useRef();

    useEffect(() => {
        if ( state.state === states.INV_POINT ) {
            const timerId = setTimeout(() => {
                dispatch({type: actions.INV_PLAY});
            }, 1500);

            return () => {
                if (timerId) clearTimeout(timerId);
            }
        }
    }, [state.state]);

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
    }, [state.state]);

    useEffect(() => {
        if ( state.state === states.INV_OVER ) {
            const timerId = setTimeout(() => {
                dispatch({type: actions.INV_END});
            }, 1000);

            return () => {
                if (timerId) clearTimeout(timerId);
            }
        }
    }, [state.state]);
    
    return (
        <div>
            <Display state={state} />
            <Keypad
                onNum={e => dispatch({type: actions.NUM, payload: {kind: e.target.value}})}
                onClear={e => dispatch({type: actions.CLEAR})}
                onAllClear={e => dispatch({type: actions.All_CLEAR})}
                onDot={e => dispatch({type: actions.DOT})}
                onOperator={e => dispatch({type: actions.OP, payload: {kind: e.target.value}})}
                onMemory={e => dispatch({type: actions.MEM, payload: {kind: e.target.value}})}
                onMemoryRecall={e => dispatch({type: actions.MEM_RECALL})}
                onMemoryClear={e => dispatch({type: actions.MEM_CLEAR})}
                onEqual={e => dispatch({type: actions.EQUAL})}
                onStartInvader={e => dispatch({type: actions.INV_START})}
            />
            <div>
                state: {state.state}<br />
                operandLeft: {state.operandLeft}<br />
                operandRight: {state.operandRight}<br />
                operator: {state.operator}<br />
                memory: {state.memory}<br />
                point: {state.point}
            </div>
        </div>
    );
}