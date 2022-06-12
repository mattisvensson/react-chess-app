import React from 'react'

function CheckedTile (props) {
    return (
        <div className={`checkTile tile-${props.posX}${props.posY}`}></div>
    )
}

export default CheckedTile;