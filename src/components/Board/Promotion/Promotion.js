import React from 'react';
import './Promotion.css'

function Promotion (props) {

    return (
        <div className="promotion" style={{left: props.posX * 100 + 50 + "px"}}>
            <div className="pomotionPiece" onMouseUp={e => props.executePromotion("queen")} style={{backgroundImage: `url(../../../assets/images/pieces/q_w.png)`}}></div>
            <div className="pomotionPiece" onMouseUp={e => props.executePromotion("rook")} style={{backgroundImage: `url(../../../assets/images/pieces/r_w.png)`}}></div>
            <div className="pomotionPiece" onMouseUp={e => props.executePromotion("bishop")} style={{backgroundImage: `url(../../../assets/images/pieces/b_w.png)`}}></div>
            <div className="pomotionPiece" onMouseUp={e => props.executePromotion("knight")} style={{backgroundImage: `url(../../../assets/images/pieces/n_w.png)`}}></div>
            <div className="cancelMove" onMouseUp={e => props.executePromotion("cancel")}>&times;</div>
        </div>
    )
}

export default Promotion;