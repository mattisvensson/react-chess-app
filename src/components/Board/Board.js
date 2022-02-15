import React, {useRef, useState} from 'react';
import './Board.css';
import Tile from '../Tile/Tile';

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];


function Board() {

    const [position, setPosition] = useState([
        [14,12,13,15,16,13,12,14],
        [11,11,11,11,11,11,11,11],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1],
        [4,2,3,5,6,3,2,4],
    ])
    // let copy = [...position];
    // copy[1][1] = 1;
    // setPosition(copy);


    const BoardRef = useRef(null);


    let activePiece = null;

    function grabPiece (e) {
        if (e.target.classList.contains("piece")) {
            console.log(e.target)

            const x = e.clientX - 40;
            const y = e.clientY - 40;

            e.target.style.position = "absolute";
            e.target.style.left = x + "px";
            e.target.style.top = y + "px";

            activePiece = e.target;
        }
    }

    function movePiece (e) {

        const mouseX = e.clientX - 40;
        const mouseY = e.clientY - 40;
        
        const minX = BoardRef.current.offsetLeft;
        const maxX = BoardRef.current.offsetLeft + 740;
        const minY = BoardRef.current.offsetTop;
        const maxY = BoardRef.current.offsetTop + 730;

        if (activePiece) {
            console.log(e.target)

            activePiece.style.position = "absolute";
            activePiece.style.left = mouseX + "px";
            activePiece.style.top = mouseY + "px";

            if (mouseX < minX) {activePiece.style.left = minX - 20 + "px";}
            if (mouseX > maxX) {activePiece.style.left = maxX + "px";}
            if (mouseY < minY) {activePiece.style.top = minY - 10 + "px";}
            if (mouseY > maxY) {activePiece.style.top = maxY + "px";}
        }

    }

    function dropPiece (e) {
        if (activePiece) {
            activePiece = null;
        }
    }



    let board = [];

    for (let j = 0 ; j < verticalAxis.length; j++) {
        for (let i = 0; i < horizontalAxis.length; i++){
            const number = j + i + 2;
            let currentPosition = position[j][i];
            let image = undefined;

            switch (currentPosition) {
                case 1: image = "p_w"; break;
                case 11: image = "p_b"; break;
                case 2: image = "n_w"; break;
                case 12: image = "n_b"; break;
                case 3: image = "b_w"; break;
                case 13: image = "b_b"; break;
                case 4: image = "r_w"; break;
                case 14: image = "r_b"; break;
                case 5: image = "q_w"; break;
                case 15: image = "q_b"; break;
                case 6: image = "k_w"; break;
                case 16: image = "k_b"; break;
            }

            board.push(<Tile key={`${j}, ${i}`} image={`../../assets/images/${image}.png`} number={number}/>)
        }
    }

    return ( 
        <div id="Board" ref={BoardRef} onMouseDown={e => grabPiece(e)} onMouseMove={e => movePiece(e)} onMouseUp={e => dropPiece(e)}>{board}</div>
    );
}

export default Board;
