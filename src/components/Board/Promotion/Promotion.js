import React from 'react';
import './Promotion.css'

function Promotion (props) {

    let color;
    props.pawnIsPromoting.color === "black" ? color = "b" : color = "w";

    return (
        <div className={`promotion ${props.pawnIsPromoting.color === "black" ? "reversed" : ""}`} style={{left: props.pawnIsPromoting.posX * 100 + "px"}}>
            <div className="pomotionPiece" onMouseUp={e => props.executePromotion("queen")} style={{backgroundImage: `url(../../../assets/images/pieces/q_${color}.png)`}}></div>
            <div className="pomotionPiece" onMouseUp={e => props.executePromotion("rook")} style={{backgroundImage: `url(../../../assets/images/pieces/r_${color}.png)`}}></div>
            <div className="pomotionPiece" onMouseUp={e => props.executePromotion("bishop")} style={{backgroundImage: `url(../../../assets/images/pieces/b_${color}.png)`}}></div>
            <div className="pomotionPiece" onMouseUp={e => props.executePromotion("knight")} style={{backgroundImage: `url(../../../assets/images/pieces/n_${color}.png)`}}></div>
            <div className="cancelMove" onMouseUp={e => props.executePromotion("cancel")}>&times;</div>
        </div>
    )
}

export default Promotion;