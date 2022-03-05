import React from 'react';
import './Tile.css';

function Tile (props) {

    // const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    // const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

    return (
        <div className={`tile ${props.checkColor % 2 === 0 ? "light" : "dark"} ${props.isPossibleMove ? "possibleMove" : null}`}>
            {/* <span className='index'>{`${props.posX} ${props.posY}`}</span> */}
            {props.image.indexOf("undefined") > -1 ? "" : <div className="piece" style={{backgroundImage: `url(${props.image})`}}></div> }
        </div>
    )
}

export default Tile;