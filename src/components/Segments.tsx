import Segment from "./Segment";

type SegmentsProps = {
    value: string;
    hasDot: boolean;
}

export default function Segments({value, hasDot}: SegmentsProps) {
    let signals = [false, false, false, false, false, false, false, false];

    switch(value) {
        case '0': signals = [ true,  true,  true, false,  true,  true,  true, hasDot]; break;
        case '1': signals = [false, false,  true, false, false,  true, false, hasDot]; break;
        case '2': signals = [ true, false,  true,  true,  true, false,  true, hasDot]; break;
        case '3': signals = [ true, false,  true,  true, false,  true,  true, hasDot]; break;
        case '4': signals = [false,  true,  true,  true, false,  true, false, hasDot]; break;
        case '5': signals = [ true,  true, false,  true, false,  true,  true, hasDot]; break;
        case '6': signals = [ true,  true, false,  true,  true,  true,  true, hasDot]; break;
        case '7': signals = [ true, false,  true, false, false,  true, false, hasDot]; break;
        case '8': signals = [ true,  true,  true,  true,  true,  true,  true, hasDot]; break;
        case '9': signals = [ true,  true,  true,  true, false,  true,  true, hasDot]; break;
        case '-': signals = [false, false, false,  true, false, false, false, hasDot]; break;
        case 'e': signals = [ true,  true, false,  true,  true, false,  true, hasDot]; break;
        case 'r': signals = [false, false, false,  true,  true, false, false, hasDot]; break;
        case 'o': signals = [false, false, false,  true,  true,  true,  true, hasDot]; break;

        //invader
        case ']': signals = [ true, false, false,  true, false, false,  true, hasDot]; break;
        case '>': signals = [false, false, false,  true, false, false,  true, hasDot]; break;
        case 'n': signals = [false, false, false,  true,  true,  true, false, hasDot]; break;
    }

    return (
        <div className="segments">
            <Segment id="a" isActive={signals[0]} />
            <Segment id="b" isActive={signals[1]} />
            <Segment id="c" isActive={signals[2]} />
            <Segment id="d" isActive={signals[3]} />
            <Segment id="e" isActive={signals[4]} />
            <Segment id="f" isActive={signals[5]} />
            <Segment id="g" isActive={signals[6]} />
            <Segment id="h" isActive={signals[7]} />
        </div>
    )
}