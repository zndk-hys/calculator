import '../SegmentsDisplay.css';
import Segments from "./Segments";

function convertSegmentValues(value, length) {
    const values = value.replaceAll('.', '').split('').map(v => {return {val: v, hasDot: false}});
    if (value.indexOf('.') > 0) {
        values[value.indexOf('.') - 1].hasDot = true;
    }

    for( let i = values.length; i < length; i++ ) {
        values.unshift({
            val: '',
            hasDot: false,
        });
    }
    
    return values;
}

export default function SegmentsDisplay({value, length}) {
    const values = convertSegmentValues(value, length);

    const segments = values.map((val, i) => {
        return (
            <Segments key={i} value={val.val} hasDot={val.hasDot} />
        );
    });

    return (
        <div className="segmentDisplayContainer">
            <div className="segmentDisplay">
                {segments}
            </div>
        </div>
    );
}