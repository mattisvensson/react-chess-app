import React from 'react';
import './Tile.css';

function Tile (props) {
    return (
        <div className={`tile ${props.checkColor % 2 === 0 ? "light" : "dark"} ${props.isPossibleCapture ? "capture" : ""} ${props.isHighlighted ? "highlight" : ""} ${props.isCheck ? "check" : ""}`}>
            {props.image.indexOf("undefined") > -1 ? null : <div className="piece" style={{backgroundImage: `url(${props.image})`, width: `${props.width / 8}px`, height: `${props.width / 8}px`}}></div>}
            {props.isPossibleMove ? <div className='possibleTile' style={{backgroundImage: `url(./assets/images/possibleTile.png)`}}></div> : null}
        </div>
    )
}

export default Tile;