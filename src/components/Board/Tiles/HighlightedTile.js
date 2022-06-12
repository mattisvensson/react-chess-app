import React from 'react'

function HighlightedTile (props) {
    return (
        <div className={`highlightedTile tile-${props.posX}${props.posY}`}></div>
    )
}

export default HighlightedTile;