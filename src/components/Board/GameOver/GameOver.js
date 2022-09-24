import './GameOver.css'

function GameOver (props) {

    let winner;
    if (props.winner === "draw") {
        winner = "Draw due to " + props.reason
    } else if (props.winner === "white") {
        winner = "White won by checkmate!"
    } else {
        winner = "Black won by checkmate!"
    }

    return (
        <div id="GameOver">
            <h2>Game Over</h2>
            <p>{winner}</p>
        </div>
    )
}

export default GameOver;