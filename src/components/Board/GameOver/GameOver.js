import './GameOver.css'

function GameOver (props) {

    return (
        <div id="GameOver">
            <h2>Game Over</h2>
            {props.winner && <p>{props.winner}</p>}
            <p>{props.reason}</p>
        </div>
    )
}

export default GameOver;