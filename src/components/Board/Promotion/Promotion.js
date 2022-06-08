import React from 'react';
import './Promotion.css'

function Promotion (props) {

    let color;
    props.pawnIsPromoting.color === "black" ? color = "b" : color = "w";

    return (
        <div className={`promotion ${props.pawnIsPromoting.color === "black" ? "reversed" : ""}`} style={{left: props.pawnIsPromoting.posX * props.pieceWidth + "px"}}>
            <div className="pomotionPiece" onMouseDown={e => props.executePromotion(5)} style={{backgroundImage: `url(./assets/images/pieces/q_${color}.png)`, width: props.pieceWidth + "px", height: props.pieceWidth + "px"}}></div>
            <div className="pomotionPiece" onMouseDown={e => props.executePromotion(4)} style={{backgroundImage: `url(./assets/images/pieces/r_${color}.png)`, width: props.pieceWidth + "px", height: props.pieceWidth + "px"}}></div>
            <div className="pomotionPiece" onMouseDown={e => props.executePromotion(3)} style={{backgroundImage: `url(./assets/images/pieces/b_${color}.png)`, width: props.pieceWidth + "px", height: props.pieceWidth + "px"}}></div>
            <div className="pomotionPiece" onMouseDown={e => props.executePromotion(2)} style={{backgroundImage: `url(./assets/images/pieces/n_${color}.png)`, width: props.pieceWidth + "px", height: props.pieceWidth + "px"}}></div>
            <div className="cancelMove" onMouseDown={e => props.executePromotion(99)}>&times;</div>
        </div>
    )
}

export default Promotion;