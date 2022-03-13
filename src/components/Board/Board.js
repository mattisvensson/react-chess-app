import React, {useEffect, useRef, useState} from 'react';
import './Board.css';
import Tile from './Tile/Tile';
import Promotion from './Promotion/Promotion'
import Rules from '../Logic/Rules'
import resetBoard from '../Logic/resetBoard';


// TODO

// check
// checkmate
// pins
// stalemate
// capture piece by clicking

// X complete movement of all pieces              
// X capturing pieces                             
//   check for valid moves
// X  -> tile is occupied                         
// X  -> passed tiles are occupied                
// X  -> en passant
// X  -> Pawn promotion
// X  -> Add castling
//    -> add check
//    -> prevent king from moving into checks
//    -> check for pins
//    -> check if king can capture unprotected piece
//   checkmate
//   stalemate
// X add board legend
// X tile highlighting
// X  -> possible Moves                           
// X  -> capturable pieces                        
// X  -> last move
//
//   add sound effects
//   custom board position generator
//   game recording
//    -> able to click thorugh moves/game
//   timer
//   conect to chess api
//    -> play with bots
//    -> get openings
//    -> puzzles

function Board() {

    //Board axis
    const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const verticalAxis = ["8", "7", "6", "5", "4", "3", "2", "1"];

    //Get rules
    const rules = new Rules();

    //initialize the board
    let board = [];

    // Pieces:
    // 1 = Pawn (white)
    // 2 = Knight (white)
    // 3 = Bishop (white)
    // 4 = Rook (white)
    // 5 = Queen (white)
    // 6 = King (white)
    // 11 = Pawn (black)
    // 12 = Knight (black)
    // 13 = Bishop (black)
    // 14 = Rook (black)
    // 15 = Queen (black)
    // 16 = King (black)
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

    //Referencing the board
    const BoardRef = useRef(null);

    //Keep track of active piece
    const [activePiece, setActivePiece] = useState({
        isActive: false,
        piece: null,
        positionX: null,
        positionY: null,
        counter: 0
    });

    //keep track of the last move
    const [lastPiece, setLastPiece] = useState({
        oldPositionX: null,
        oldPositionY: null,
        newPositionX: null,
        newPositionY: null
    })

    //true = white's turn
    //false = black's turn
    const [playerTurn, setPlayerTurn] = useState(true);

    //saves possible Tiles to move to when piece is grabbed
    const [possibleTiles, setPossibleTiles] = useState([]);

    //saves possible piece captures when piece is grabbed
    const [possibleCaptures, setPossibleCaptures] = useState([])

    //keep track of if piece is dragged or not
    const [pieceIsDagged, setPieceIsDragged] = useState(false);

    //saves data about promoting pawn
    const [pawnIsPromoting, setPawnIsPromoting] = useState({
        isPromoting: false,
        color: null,
        posX: null,
        posY: null,
        capturedPiece: null
    });

    //saves data of pawn which can be captured en passant
    const [pawnCanEnPassant, setPawnCanEnPassant] = useState({
        isActive: false,
        posX: null,
        posY: null
    })

    //keep track of castling rights for both sides
    const [castle, setCastle] = useState({
        white: {
            castleLong: true,
            castleShort: true
        },
        black: {
            castleLong: true,
            castleShort: true
        }
    })

    //grabbing the piece
    function grabPiece (e) {

        //get tile on which the piece was standing
        const currentX = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
        const currentY = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);

        exitMove: if (e.target.classList.contains("piece")) {

            //capture piece when clicking on it 
            for (let i = 0; i < possibleCaptures.length; i++) {
                if (JSON.stringify(possibleCaptures[i]) === JSON.stringify([currentY, currentX])) {
                    console.log("drin")
                    executeMove(currentX, currentY)
                    break exitMove;
                }
            }

            //Reset possible Tiles and captures
            setPossibleTiles([]);
            setPossibleCaptures([])
        
            //get coordinates of mouse
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            //get borders of the board
            const BoardMinX = BoardRef.current.offsetLeft;
            const BoardMinY = BoardRef.current.offsetTop;

            //set piece position to mouse position
            e.target.style.position = "absolute";
            e.target.style.left = mouseX - BoardMinX - 50 + "px";
            e.target.style.top = mouseY - BoardMinY - 50 + "px";

            //set active piece
            let samePiece = false;
            (e.target === activePiece.isActive) ? samePiece = true : samePiece = false;

            if (!samePiece) {
                const updatePiece = {
                    ...activePiece,
                    isActive: e.target,
                    piece: position[currentY][currentX],
                    positionX: currentX,
                    positionY: currentY,
                    counter: 0
                }
                setActivePiece(updatePiece)
            } else {
                const updatePiece = {
                    ...activePiece,
                    isActive: e.target,
                    piece: position[currentY][currentX],
                    positionX: currentX,
                    positionY: currentY,
                }
                setActivePiece(updatePiece)
            }

            setPieceIsDragged(true)

        } else if (activePiece.isActive) {
            
            const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
            const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);

            executeMove(x, y)

        }
    }
       

    //Check possible moves
    useEffect(() => {
        if (activePiece.isActive) {
            rules.checkPossibleMoves(activePiece.positionX, activePiece.positionY, activePiece.piece, position, playerTurn, setPossibleTiles, setPossibleCaptures, pawnIsPromoting, setPawnIsPromoting, castle, pawnCanEnPassant, setPawnCanEnPassant);
        }
    }, [activePiece, position])


    //move piece
    function movePiece (e) {
        // console.log("movePiece: " + pieceIsDagged)
        if (pieceIsDagged) {

            //get coordinates of mouse
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            //get borders of the board
            const BoardMinX = BoardRef.current.offsetLeft;
            const BoardMaxX = BoardRef.current.offsetLeft + 800;
            const BoardMinY = BoardRef.current.offsetTop;
            const BoardMaxY = BoardRef.current.offsetTop + 800;
            const BoardWidth = BoardRef.current.offsetWidth;

            if (activePiece.isActive && pieceIsDagged) {

                //set piece position to mouse position
                activePiece.isActive.style.position = "absolute";
                activePiece.isActive.style.left = mouseX - BoardMinX - 50 + "px";
                activePiece.isActive.style.top = mouseY - BoardMinY - 50 + "px";

                //stop piece from following the mouse if mouse is outside of the board
                if (mouseX < BoardMinX) {activePiece.isActive.style.left = -50 + "px";}
                if (mouseX > BoardMaxX) {activePiece.isActive.style.left = BoardWidth - 50 + "px";}
                if (mouseY < BoardMinY) {activePiece.isActive.style.top = -50 + "px";}
                if (mouseY > BoardMaxY) {activePiece.isActive.style.top = BoardWidth - 50 + "px";}
            }
        }
    }


    //drop piece
    function dropPiece (e) {
    
        if (e.target === activePiece.isActive && activePiece.counter > 0) {
    
            const updatePiece = {
                ...activePiece,
                isActive: false,
                piece: null,
                positionX: null,
                positionY: null,
                counter: 0
            }
            setActivePiece(updatePiece)
    
            setPossibleTiles([]);
            setPossibleCaptures([])
        } else {
            const updatePiece = {
                ...activePiece,
                counter: 1
            }
            setActivePiece(updatePiece)
        }
        
        if (activePiece.isActive && BoardRef) {
    
            const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
            const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);
    
            executeMove(x, y);
    
        }
    }


    //execute move
    function executeMove (x, y) {
        
        //check if desired tile is in possible moves
        let match = false;
        for (let i = 0; i < possibleTiles.length; i++) {
            if (JSON.stringify(possibleTiles[i]) === JSON.stringify([y, x])) {
                match = true;
                break;
            }
        }
        //check if desired tile is in possible captures
        for (let i = 0; i < possibleCaptures.length; i++) {
            if (JSON.stringify(possibleCaptures[i]) === JSON.stringify([y, x])) {
                if ((playerTurn && position[y][x] > 8) || (!playerTurn && position[y][x] < 8)) {
                    match = true;
                    break;
                }
            }
        }
        
        //if desired tile is in possible moves/captures...
        if (match) {

            move: if (true) {

                //if pawn is promoting, set coordinates for promotion and display promotion menu
                if (pawnIsPromoting.isPromoting) {
                    const updatePromotion = {
                        ...pawnIsPromoting,
                        posX: x,
                        posY: y,
                        capturedPiece: position[y][x]
                    }
                    setPawnIsPromoting(updatePromotion)
                }

                //en passant
                checkEnPassant(x, y, activePiece.positionY);

                //en passant (with white)
                if (activePiece.piece === 1 && x !== activePiece.positionX) {
                    const updatePosition = [...position];
                    updatePosition[activePiece.positionY][activePiece.positionX] = 0;
                    updatePosition[y + 1][x] = 0;
                    updatePosition[y][x] = 1;
                    break move;
                //en passant (with black)
                } else if (activePiece.piece === 11 && x !== activePiece.positionX){
                    const updatePosition = [...position];
                    updatePosition[activePiece.positionY][activePiece.positionX] = 0;
                    updatePosition[y - 1][x] = 0;
                    updatePosition[y][x] = 11;
                    break move;
                }

                //castle 
                checkCastleMoves(x, y);

                if (activePiece.piece === 6 && castle.white.castleShort && x === 6) {
                    const updatePosition = [...position];
                    updatePosition[7][4] = 0;
                    updatePosition[7][5] = 4;
                    updatePosition[7][6] = 6;
                    updatePosition[7][7] = 0;
                    setPosition(updatePosition)

                    const updateCastle = {
                        ...castle,
                        white: {
                            ...castle.white,
                            castleShort: false,
                        }
                    }
                    setCastle(updateCastle)
                    break move;
                } else if (activePiece.piece === 6 && castle.white.castleLong && x === 2) {
                    const updatePosition = [...position];
                    updatePosition[7][4] = 0;
                    updatePosition[7][3] = 4;
                    updatePosition[7][2] = 6;
                    updatePosition[7][1] = 0;
                    updatePosition[7][0] = 0;
                    setPosition(updatePosition)

                    const updateCastle = {
                        ...castle,
                        white: {
                            ...castle.white,
                            castleShort: false,
                        }
                    }
                    setCastle(updateCastle)
                    break move;
                } else if (activePiece.piece === 16 && castle.black.castleShort && x === 6) {
                    const updatePosition = [...position];
                    updatePosition[0][4] = 0;
                    updatePosition[0][5] = 14;
                    updatePosition[0][6] = 16;
                    updatePosition[0][7] = 0;
                    setPosition(updatePosition)

                    const updateCastle = {
                        ...castle,
                        black: {
                            ...castle.black,
                            castleShort: false,
                        }
                    }
                    setCastle(updateCastle)
                    break move;
                } else if (activePiece.piece === 16 && castle.black.castleLong && x === 2) {
                    const updatePosition = [...position];
                    updatePosition[0][4] = 0;
                    updatePosition[0][3] = 14;
                    updatePosition[0][2] = 16;
                    updatePosition[0][1] = 0;
                    updatePosition[0][0] = 0;
                    setPosition(updatePosition)

                    const updateCastle = {
                        ...castle,
                        black: {
                            ...castle.black,
                            castleShort: false,
                        }
                    }
                    setCastle(updateCastle)
                    break move;
                }

                //normal move
                const newPosition = [...position];
                newPosition[activePiece.positionY][activePiece.positionX] = 0;
                newPosition[y][x] = activePiece.piece;
                setPosition(newPosition);
            
            }
    
            //switch player turn
            setPlayerTurn(prev => !prev)
    
            //Reset possible Tiles
            setPossibleTiles([]);
            setPossibleCaptures([])
    
            //highlight last move
            const updateLastPiece = {
                ...lastPiece, 
                oldPositionX: activePiece.positionX,
                oldPositionY: activePiece.positionY,
                newPositionX: x,
                newPositionY: y
            }
            setLastPiece(updateLastPiece)
    
            //reset active piece
            const updatePiece = {
                ...activePiece,
                isActive: false,
                counter: 0
            }
            setActivePiece(updatePiece)
        }      
    
        activePiece.isActive.style.position = "static";
        activePiece.isActive.style.left = "unset";
        activePiece.isActive.style.top = "unset";
    
        setPieceIsDragged(false)
    }

    function checkEnPassant (x, y, lastY) {
        let tileDifference = Math.abs(y - lastY)
        if ((activePiece.piece === 1 || activePiece.piece === 11) && tileDifference === 2) {
            const updateEnPassant = {
                ...pawnCanEnPassant,
                isActive: true,
                posX: x,
                posY: y
            }
            setPawnCanEnPassant(updateEnPassant)
        } else {
            const updateEnPassant = {
                ...pawnCanEnPassant,
                isActive: false,
                posX: null,
                posY: null
            }
            setPawnCanEnPassant(updateEnPassant)
        }
    }

    function checkCastleMoves (x, y) {
        //check for castle moves
        if (position[7][7] === 0) {
            const updateCastle = {
                ...castle,
                white: {
                    ...castle.white,
                    castleShort: false,
                }
            }
            setCastle(updateCastle)
        }
        if (position[7][0] === 0) {
            const updateCastle = {
                ...castle,
                white: {
                    ...castle.white,
                    castleLong: false,
                }
            }
            setCastle(updateCastle)
        }
        if (position[0][0] === 0) {
            const updateCastle = {
                ...castle,
                black: {
                    ...castle.black,
                    castleLong: false,
                }
            }
            setCastle(updateCastle)
        }
        if (position[0][7] === 0) {
            const updateCastle = {
                ...castle,
                black: {
                    ...castle.black,
                    castleShort: false,
                }
            }
            setCastle(updateCastle)
        }
        if (activePiece.piece === 6 && (x !== 2 && x !== 6)) {
            const updateCastle = {
                ...castle,
                white: {
                    ...castle.white,
                    castleShort: false,
                    castleLong: false,
                }
            }
            setCastle(updateCastle)
        }
        if (activePiece.piece === 16 && (x !== 2 && x !== 6)) {
            const updateCastle = {
                ...castle,
                black: {
                    ...castle.black,
                    castleShort: false,
                    castleLong: false,
                }
            }
            setCastle(updateCastle)
        }
    }

    //execute pawn promotionm(executed from Promotion.js)
    function executePromotion (piece) {

        let pieceId;

        switch (piece) {
            case "queen": pieceId = 5; break;
            case "rook": pieceId = 4; break;
            case "bishop": pieceId = 3; break;
            case "knight": pieceId = 2; break;
            case "cancel": pieceId = 99; break;
            default: break;
        }

        if (pawnIsPromoting.color === "black") {
            pieceId += 10;
        }

        if (pieceId >= 99) {
            const newPosition = [...position];
            newPosition[lastPiece.oldPositionY][lastPiece.oldPositionX] = pawnIsPromoting.color === "black" ? 11 : 1;
            newPosition[pawnIsPromoting.posY][pawnIsPromoting.posX] = pawnIsPromoting.capturedPiece;
            setPosition(newPosition);

            setPlayerTurn(prev => !prev)
        } else {
            const newPosition = [...position];
            newPosition[pawnIsPromoting.posY][pawnIsPromoting.posX] = pieceId;
            setPosition(newPosition);
        }
        
        const updatePromotion = {
            ...pawnIsPromoting,
            isPromoting: false,
            color: null,
            posX: null,
            posY: null,
            capturedPiece: null
        }
        setPawnIsPromoting(updatePromotion)
    }

    //renders if pawn is promoting
    if(pawnIsPromoting.isPromoting && pawnIsPromoting.posX !== null) {
        board.push(<Promotion key="promotion" pawnIsPromoting={pawnIsPromoting} executePromotion={executePromotion}/>)
    }


    for (let j = 0; j < verticalAxis.length; j++) {
        for (let i = 0; i < horizontalAxis.length; i++){
            const checkColor = j + i + 2;
            let image = undefined;
            let color = undefined;
            let isPossibleMove = false;
            let isPossibleCapture = false;
            let isHighlighted = false;
            let posX = false;
            let posY = false;

            //highlight possible Tiles
            for (let x = 0; x < possibleTiles.length; x++) {
                if (JSON.stringify(possibleTiles[x]) === JSON.stringify([j, i])) {
                    isPossibleMove = true;
                }
            }

            //highlight pieces which can be captured
            for (let x = 0; x < possibleCaptures.length; x++) {
                if (JSON.stringify(possibleCaptures[x]) === JSON.stringify([j, i])) {
                    if ((playerTurn && position[j][i] > 8) || (!playerTurn && position[j][i] < 8)) {
                        isPossibleCapture = true;
                    }
                }
            }

            //highlight active piece and last move
            if ((activePiece.positionX === i && activePiece.positionY === j) || (lastPiece.oldPositionX === i && lastPiece.oldPositionY === j) || (lastPiece.newPositionX === i && lastPiece.newPositionY === j)) {
                isHighlighted = true;
            }

            switch (position[j][i]) {
                case 1: image = "p_w"; color = "white"; break;
                case 11: image = "p_b"; color = "black"; break;
                case 2: image = "n_w"; color = "white"; break;
                case 12: image = "n_b"; color = "black"; break;
                case 3: image = "b_w"; color = "white"; break;
                case 13: image = "b_b"; color = "black"; break;
                case 4: image = "r_w"; color = "white"; break;
                case 14: image = "r_b"; color = "black"; break;
                case 5: image = "q_w"; color = "white"; break;
                case 15: image = "q_b"; color = "black"; break;
                case 6: image = "k_w"; color = "white"; break;
                case 16: image = "k_b"; color = "black"; break;
                default: image = undefined; break;
            }

            board.push(<Tile key={`${j}, ${i}`} posX={posX} posY={posY} image={`../../assets/images/pieces/${image}.png`} isPossibleMove={isPossibleMove} isPossibleCapture={isPossibleCapture} isHighlighted={isHighlighted} checkColor={checkColor} color={color}/>)
        }
    }

    return (
        <>
            <div id="Board" ref={BoardRef} onMouseDown={e => grabPiece(e)} onMouseMove={e => movePiece(e)} onMouseUp={e => dropPiece(e)} style={{backgroundImage: `url(../../assets/images/chessboard_white.svg)`}}>{board}</div>
            <button onClick={e => resetBoard(setPosition, activePiece, setActivePiece, lastPiece, setLastPiece, setPossibleTiles, setPossibleCaptures, setPlayerTurn, setCastle)}>Reset Board</button>
        </>
    );
}

export default Board;