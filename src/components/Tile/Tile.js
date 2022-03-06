import React from 'react';
import './Tile.css';

function Tile (props) {

    // const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    // const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

    
    // <span className='index'>{`${props.posX} ${props.posY}`}</span>

    // if (props.image.indexOf("undefined") > 0 && props.isPossibleMove) {
    //     console.log("first")
    //     return (
    //         <div className={`tile capture ${props.checkColor % 2 === 0 ? "light" : "dark"}`}>
    //             {props.image.indexOf("undefined") > -1 ? "" : <div className="piece" style={{backgroundImage: `url(${props.image})`}}></div>}
    //         </div>
    //     )
    // }

    return (
        <div className={`tile ${props.checkColor % 2 === 0 ? "light" : "dark"} ${props.isPossibleCapture ? "capture" : ""}`}>
            {props.image.indexOf("undefined") > -1 ? null : <div className="piece" style={{backgroundImage: `url(${props.image})`}}></div>}
            {props.isPossibleMove ? <div className='possibleTile' style={{backgroundImage: `url(../../assets/images/possibleTile.png)`}}></div> : null}
        </div>
    )
}

export default Tile;