import './GameOver.css'

function GameOver (props) {

    return (
        <div id="GameOver">
            <p>Game Over</p>
            <p>Winner: {props.winner}</p>
            <p>Reason: {props.reason}</p>
        </div>
    )
}

export default GameOver;