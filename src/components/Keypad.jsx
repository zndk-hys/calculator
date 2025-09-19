export default function Keypad({onNum, onClear, onAllClear, onDot, onOperator, onEqual, onMemory, onMemoryRecall, onMemoryClear, onStartInvader}) {
    return (
        <div>
            <input type="button" value="0" onClick={onNum} />
            <input type="button" value="1" onClick={onNum} />
            <input type="button" value="2" onClick={onNum} />
            <input type="button" value="3" onClick={onNum} />
            <input type="button" value="4" onClick={onNum} />
            <input type="button" value="5" onClick={onNum} />
            <input type="button" value="6" onClick={onNum} />
            <input type="button" value="7" onClick={onNum} />
            <input type="button" value="8" onClick={onNum} />
            <input type="button" value="9" onClick={onNum} />
            <input type="button" value="C" onClick={onClear} />
            <input type="button" value="AC" onClick={onAllClear} /><br />
            <input type="button" value="." onClick={onDot} /><br />
            <input type="button" value="+" onClick={onOperator} />
            <input type="button" value="-" onClick={onOperator} />
            <input type="button" value="*" onClick={onOperator} />
            <input type="button" value="/" onClick={onOperator} /><br />
            <input type="button" value="M+" onClick={onMemory} />
            <input type="button" value="M-" onClick={onMemory} />
            <input type="button" value="MR" onClick={onMemoryRecall} />
            <input type="button" value="MC" onClick={onMemoryClear} /><br />
            <input type="button" value="=" onClick={onEqual} /><br />
            <input type="button" value="invader" onClick={onStartInvader} />
        </div>
    )
}