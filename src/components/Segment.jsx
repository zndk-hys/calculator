export default function Segment({id, isActive}) {
    let className = `segment segment--${id}`;
    if (isActive) {
        className += ' isActive';
    }
    return (
        <div className={className} />
    )
}