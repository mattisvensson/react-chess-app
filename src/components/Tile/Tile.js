import React from 'react';
import './Tile.css';

function Tile (props) {
    return (
        <div className={`tile ${props.number % 2 === 0 ? "light" : "dark"}`}>
            {props.image.indexOf("undefined") > -1 ? "" : <div className="piece" style={{backgroundImage: `url(${props.image})`}}></div> }
        </div>
    )
}

export default Tile;