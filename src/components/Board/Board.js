import React, {useEffect, useRef, useState} from 'react';
import './Board.css';
import Tile from './Tile/Tile';
import Promotion from './Promotion/Promotion'
import Rules from '../Logic/Rules'
import Check from '../Logic/Check'
import resetBoard from '../Logic/resetBoard';
import checkCastleMoves from '../Logic/checkCastleMoves';
import checkEnPassant from '../Logic/checkEnPassant';
import GameOver from '../Board/GameOver/GameOver';


//Ablauf
//Piece wird ausgewählt
//Mögliche Tiles werden berechnet
//Wenn das Zielfeld mit den möglichen Tiles übereinstimmt, wird der Zug ausgeführt
//Wenn nicht, wird die Figur zurück auf das ursprüngliche Feld gesetzt


// TODO

// check
// checkmate
// pins
// stalemate

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


let width = window.innerHeight / 1.2;
let pieceWidth = width / 8;

function Board() {

    //Get rules and checks
    const rules = new Rules();
    const check = new Check();

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
        [14,12,13,0,16,0,12,14],
        [11,11,11,11,11,11,11,11],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [1,1,1,1,5,1,1,1],
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

    //true = white's turn
    //false = black's turn
    const [playerTurn, setPlayerTurn] = useState(true);

    //saves possible Tiles to move to when piece is grabbed
    const [possibleTiles, setPossibleTiles] = useState([]);

    //keep track of if piece is dragged or not
    const [pieceIsDragged, setPieceIsDragged] = useState(false);

    //player is in check
    const [playerIsInCheck, setPlayerIsInCheck] = useState(false);

    //true = game is over
    const [gameOver, setGameOver] = useState(false);

    //save all possible moves
    const [simulatedTilesWhite, setSimulatedTilesWhite] = useState([])
    const [simulatedTilesBlack, setSimulatedTilesBlack] = useState([])
    const [simulatedTilesKing, setSimulatedTilesKing] = useState([])

    //save all possible moves when player is in check
    const [possibleMovesAfterCheck, setPossibleMovesAfterCheck] = useState([])
    const [possibleKingMovesAfterCheck, setPossibleKingMovesAfterCheck] = useState([])


    //-------------------------------------------------------------------------------------

    //grabbing the piece
    function grabPiece (e) {

        //get tile on which the piece was standing
        const currentX = Math.floor((e.clientX - BoardRef.current.offsetLeft) / pieceWidth);
        const currentY = Math.floor((e.clientY - BoardRef.current.offsetTop) / pieceWidth);

        exitMove: if (e.target.classList.contains("piece")) {
            if (playerIsInCheck) {
                console.log("checking moves")
                checkMoves()
            }

            //capture piece when clicking on it 
            for (let i = 0; i < possibleTiles.length; i++) {
                if (JSON.stringify(possibleTiles[i]) === JSON.stringify([currentY, currentX])) {
                    let string = JSON.stringify(possibleTiles[i])
                    let y = string.charAt(1)
                    let x = string.charAt(3)
                    if ((playerTurn && position[y][x] > 8) || (!playerTurn && position[y][x] < 8 && position[y][x] > 0)) {
                        executeMove(currentX, currentY)
                        break exitMove;
                    }
                }
            }

            //Reset possible Tiles and captures
            setPossibleTiles([]);
        
            //get coordinates of mouse
            const mouseX = e.clientX;
            const mouseY = e.clientY;            

            //get borders of the board
            const BoardMinX = BoardRef.current.offsetLeft;
            const BoardMinY = BoardRef.current.offsetTop;

            //set piece position to mouse position
            e.target.style.position = "absolute";
            e.target.style.left = mouseX - BoardMinX - (pieceWidth / 2) + "px";
            e.target.style.top = mouseY - BoardMinY - (pieceWidth / 2) + "px";

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
            
            const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / pieceWidth);
            const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / pieceWidth);

            executeMove(x, y)
        }
    }
    

    //move piece
    function movePiece (e) {  

        if (pieceIsDragged) {

            //get coordinates of mouse
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            //get borders of the board
            const BoardMinX = BoardRef.current.offsetLeft;
            const BoardMaxX = BoardRef.current.offsetLeft + width;
            const BoardMinY = BoardRef.current.offsetTop;
            const BoardMaxY = BoardRef.current.offsetTop + width;
            const BoardWidth = BoardRef.current.offsetWidth;

            if (activePiece.isActive) {

                //set piece position to mouse position
                activePiece.isActive.style.position = "absolute";
                activePiece.isActive.style.left = mouseX - BoardMinX - (pieceWidth / 2) + "px";
                activePiece.isActive.style.top = mouseY - BoardMinY -(pieceWidth / 2) + "px";

                //stop piece from following the mouse if mouse is outside of the board
                if (mouseX < BoardMinX) {activePiece.isActive.style.left = -(pieceWidth / 2) + "px";}
                if (mouseX > BoardMaxX) {activePiece.isActive.style.left = BoardWidth - (pieceWidth / 2) + "px";}
                if (mouseY < BoardMinY) {activePiece.isActive.style.top = -(pieceWidth / 2) + "px";}
                if (mouseY > BoardMaxY) {activePiece.isActive.style.top = BoardWidth - (pieceWidth / 2) + "px";}
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
        } else {
            const updatePiece = {
                ...activePiece,
                counter: 1
            }
            setActivePiece(updatePiece)
        }
        
        if (activePiece.isActive && BoardRef) {
    
            const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / pieceWidth);
            const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / pieceWidth);

            executeMove(x, y);
        }
    }


    //check possible moves
    useEffect(() => {
        if (activePiece.isActive) {
            rules.checkPossibleMoves(activePiece.positionX, activePiece.positionY, activePiece.piece, position, playerTurn, setPossibleTiles, castle, pawnCanEnPassant);
        }
    }, [activePiece.piece, activePiece.positionX, activePiece.positionY])

    //check for checks
    useEffect(() => {
        setSimulatedTilesBlack([])
        setSimulatedTilesWhite([])
        setSimulatedTilesKing([])
        setPossibleMovesAfterCheck([])
        setPossibleKingMovesAfterCheck([])
        
        check.checkForCheck(position, setSimulatedTilesWhite, setSimulatedTilesBlack, setPlayerIsInCheck, castle, pawnCanEnPassant)
        check.checkForKingMoves(position, setSimulatedTilesKing, simulatedTilesWhite, simulatedTilesBlack, castle, playerTurn)
        // console.log(simulatedTilesKing)
        // console.log(possibleMovesAfterCheck)
    }, [playerTurn])
    
    //check for checkmate
    // useEffect(() => {
    //     if (playerIsInCheck && possibleMovesAfterCheck.length === 0 && possibleKingMovesAfterCheck.length === 0) {
    //         setGameOver(true)
    //     }
    // }, [possibleMovesAfterCheck])


    //check possible moves when player is in check
    function checkMoves () {
        //load possible moves for white or black
        let possibleMoves;
        let king;
        let kingPosition;

        if (playerIsInCheck === "white") {
            possibleMoves = simulatedTilesWhite;
            king = 6;
        } else if (playerIsInCheck === "black") {
            possibleMoves = simulatedTilesBlack;
            king = 16;
        }

        //find position of king
        for (let posX =  0; posX < 8; posX++) {
            for (let posY = 0; posY < 8; posY++) {
                if (position[posY][posX] === king) {
                    kingPosition = [posY, posX];
                }
            }
        }

        for (let i = 0; i < possibleMoves.length; i++) {

            //create copy of current position
            let positionCopy = [];
            for (let i = 0; i < position.length; i++) {
                positionCopy[i] = position[i].slice();
            }
            
            let string = JSON.stringify(possibleMoves[i])
            let ynum = string.charAt(1)
            let xnum = string.charAt(3)
            let y = parseInt(ynum)
            let x = parseInt(xnum)


            //blocking the move
            //place a not existing piece on current possible tile
            positionCopy[y][x] = 10;

            //check if new simulated position is still check
            const stillCheck = check.checkForCheck(positionCopy, setSimulatedTilesWhite, setSimulatedTilesBlack, setPlayerIsInCheck, castle, pawnCanEnPassant, pawnIsPromoting, setPawnIsPromoting)

            if (stillCheck === "no check") {
                setPossibleMovesAfterCheck(oldArray => [...oldArray, [y, x]])
            }
        }

        
        //escaping with the king
        for (let i = 0; i < simulatedTilesKing.length; i++) {

            //create copy of current position
            let positionCopy = [];
            for (let i = 0; i < position.length; i++) {
                positionCopy[i] = position[i].slice();
            }

            let piece;
            playerTurn ? piece = 6 : piece = 16

            let string = JSON.stringify(simulatedTilesKing[i])
            let ynum = string.charAt(1)
            let xnum = string.charAt(3)
            let y = parseInt(ynum)
            let x = parseInt(xnum)


            let kstring = JSON.stringify(kingPosition)
            let kynum = kstring.charAt(1)
            let kxnum = kstring.charAt(3)
            let ky = parseInt(kynum)
            let kx = parseInt(kxnum)

            //place a not existing piece on current possible tile
            positionCopy[ky][kx] = 0;
            positionCopy[y][x] = king;

            //check if new simulated position is still check
            const stillCheck = check.checkForKingMoves(positionCopy, setSimulatedTilesKing, simulatedTilesWhite, simulatedTilesBlack, castle, playerTurn)
            // console.log(stillCheck)
            
            if (stillCheck === "no check") {
                setPossibleKingMovesAfterCheck(oldArray => [...oldArray, [y, x]])
            }
        }
    }


    //execute move
    function executeMove (x, y) {

        //promotion
        let savePromotion = {};
        if (activePiece.piece === 1 && y === 0) {
            savePromotion = {
                isPromoting: true,
                color: "white"
            }
        } else if (activePiece.piece === 11 && y === 7) {
            savePromotion = {
                isPromoting: true,
                color: "black"
            }
        }

        //check if desired tile is in possible moves
        let match = false;

        if (playerIsInCheck) {
            if ((playerTurn && activePiece.piece === 6) || (!playerTurn && activePiece.piece === 16)) {
                for (let i = 0; i < possibleKingMovesAfterCheck.length; i++) {
                    if (JSON.stringify(possibleKingMovesAfterCheck[i]) === JSON.stringify([y, x])) {
                        match = true;
                        break;
                    }
                }
            } else {
                for (let i = 0; i < possibleMovesAfterCheck.length; i++) {
                    if (JSON.stringify(possibleMovesAfterCheck[i]) === JSON.stringify([y, x])) {
                        match = true;
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < possibleTiles.length; i++) {
                if (JSON.stringify(possibleTiles[i]) === JSON.stringify([y, x])) {
                    match = true;
                    break;
                }
            }
        }
        
        //if desired tile is in possible moves/captures...
        if (match) {

            //if pawn is promoting, set coordinates for promotion and display promotion menu
            if (savePromotion.isPromoting) {
                const updatePromotion = {
                    isPromoting: true,
                    color: savePromotion.color,
                    posX: x,
                    posY: y,
                    capturedPiece: position[y][x]
                }
                setPawnIsPromoting(updatePromotion)
            }

            //en passant
            checkEnPassant(x, y, activePiece, position, pawnCanEnPassant, setPawnCanEnPassant);

            //castle 
            checkCastleMoves(x, position, castle, setCastle, activePiece, setPosition);

            //normal move
            const newPosition = [...position];
            newPosition[activePiece.positionY][activePiece.positionX] = 0;
            newPosition[y][x] = activePiece.piece;
            setPosition(newPosition);
    
            //switch player turn
            setPlayerTurn(prev => !prev)
    
            //reset possible Tiles
            setPossibleTiles([]);
    
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
            setPlayerIsInCheck(false)
        }      
    
        //drop dragged piece
        activePiece.isActive.style.position = "relative";
        activePiece.isActive.style.left = "unset";
        activePiece.isActive.style.top = "unset";
        setPieceIsDragged(false)
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

    //renders if game is over
    if (gameOver) {
        board.push(<GameOver key="gameover"/>)           
    }

    //renders if pawn is promoting
    if(pawnIsPromoting.isPromoting && pawnIsPromoting.posX !== null) {
        board.push(<Promotion key="promotion" pawnIsPromoting={pawnIsPromoting} executePromotion={executePromotion} pieceWidth={pieceWidth}/>)
    }

    //render board
    for (let j = 0; j < 8; j++) { //y
        for (let i = 0; i < 8; i++){ //x
            const checkColor = j + i + 2;
            let image = undefined;
            let color = undefined;
            let isPossibleMove = false;
            let isPossibleCapture = false;
            let isHighlighted = false;
            let isCheck = false;
            let posX = false;
            let posY = false;


            //highlight possible Tiles
            for (let x = 0; x < possibleTiles.length; x++) {
                if (playerIsInCheck.length > 0) {
                    if (activePiece.piece === 6 || activePiece.piece === 16) {
                        for (let c = 0; c < possibleKingMovesAfterCheck.length; c++) {
                            if ((JSON.stringify(possibleTiles[x]) === JSON.stringify([j, i])) && (JSON.stringify(possibleKingMovesAfterCheck[c]) === JSON.stringify([j, i]))) {
                                if ((playerTurn && position[j][i] > 8) || (!playerTurn && position[j][i] < 8 && position[j][i] > 0)) {
                                    isPossibleCapture = true;
                                } else if (position[j][i] === 0) {
                                    isPossibleMove = true;
                                }
                            }
                        }
                    } else {
                        for (let c = 0; c < possibleMovesAfterCheck.length; c++) {
                            if ((JSON.stringify(possibleTiles[x]) === JSON.stringify([j, i])) && (JSON.stringify(possibleMovesAfterCheck[c]) === JSON.stringify([j, i]))) {
                                if ((playerTurn && position[j][i] > 8) || (!playerTurn && position[j][i] < 8 && position[j][i] > 0)) {
                                    isPossibleCapture = true;
                                } else if (position[j][i] === 0) {
                                    isPossibleMove = true;
                                }
                            }
                        }
                    }
                } else {
                    if (JSON.stringify(possibleTiles[x]) === JSON.stringify([j, i])) {
                        if ((playerTurn && position[j][i] > 8) || (!playerTurn && position[j][i] < 8 && position[j][i] > 0)) {
                            isPossibleCapture = true;
                        } else if (position[j][i] === 0) {
                            isPossibleMove = true;
                        }
                    }
                }
            }
    

            //highlight active piece and last move
            if ((activePiece.positionX === i && activePiece.positionY === j) || (lastPiece.oldPositionX === i && lastPiece.oldPositionY === j) || (lastPiece.newPositionX === i && lastPiece.newPositionY === j)) {
                isHighlighted = true;
            }

            //highlight if king is in check
            if ((playerIsInCheck === "white" && position[j][i] === 6) || (playerIsInCheck === "black" && position[j][i] === 16)) {
                isCheck = true;
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

            board.push(<Tile key={`${j}, ${i}`} posX={posX} posY={posY} image={`../../assets/images/pieces/${image}.png`} isPossibleMove={isPossibleMove} isPossibleCapture={isPossibleCapture} isHighlighted={isHighlighted} isCheck={isCheck} checkColor={checkColor} color={color} width={width}/>)
        }
    }

    return (
        <>
            <div id="Board" ref={BoardRef} onMouseDown={e => grabPiece(e)} onMouseMove={e => movePiece(e)} onMouseUp={e => dropPiece(e)} style={{backgroundImage: `url(../../assets/images/chessboard_white.svg)`, gridTemplateColumns: `repeat(8, ${width / 8}px`, gridTemplateRows: `repeat(8, ${width/ 8}px`}}>{board}</div>
            <button onClick={e => resetBoard(setPosition, activePiece, setActivePiece, lastPiece, setLastPiece, setPossibleTiles, setPlayerTurn, setCastle, setPlayerIsInCheck)}>Reset Board</button>
        </>
    );
}

export default Board;