import React from 'react'

function PossibleCapture (props) {
    return (
        <div className={`possibleCapture tile-${props.posX}${props.posY}`}></div>
    )
}

export default PossibleCapture;