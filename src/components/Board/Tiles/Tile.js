import React from 'react';
import './Tile.css';

function Tile (props) {
    return (
        <div className={`piece ${props.piece} tile-${props.posX}${props.posY}`}></div>
    )
}

export default Tile;