import './GameOver.css'

function GameOver (props) {

    return (
        <div id="GameOver">
            <h2>Game Over</h2>
            <p>{props.winner && props.winner}</p>
            <p>{props.reason}</p>
        </div>
    )
}

export default GameOver;