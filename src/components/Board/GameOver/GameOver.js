import './GameOver.css'

function GameOver (props) {

    let winner;
    let reason;
    if (props.winner === "draw") {
        winner = "Draw due to " + props.reason;
        reason = "-/-";
    } else if (props.winner === "white") {
        winner = "White was victorious!"
        if (props.reason === "checkmate") {
            reason = "White won by checkmate!"
        } else if (props.reason === "time") {
            reason = "Black ran out of time!"
        }
    } else {
        winner = "Black was victorious"
        if (props.reason === "checkmate") {
            reason = "Black won by checkmate!"
        } else if (props.reason === "time") {
            reason = "White ran out of time!"
        }
    }

    return (
        <div id="GameOver">
            <h2>Game Over</h2>
            <p>{winner}</p>
            <p>{reason}</p>
        </div>
    )
}

export default GameOver;