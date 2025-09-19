type SegmentProps = {
    id: string;
    isActive: boolean;
}

export default function Segment({id, isActive}: SegmentProps) {
    let className = `segment segment--${id}`;
    if (isActive) {
        className += ' isActive';
    }
    return (
        <div className={className} />
    )
}