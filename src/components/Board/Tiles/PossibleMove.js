import React from 'react'

function PossibleMove (props) {
    return (
        <div className={`possibleTile tile-${props.posX}${props.posY}`}></div>
    )
}

export default PossibleMove;