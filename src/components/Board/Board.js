import React, {useEffect, useRef, useState} from 'react';
import './Board.css';
import Tile from './Tile/Tile';
import Promotion from './Promotion/Promotion'
import Rules from '../Logic/Rules'
import resetBoard from '../Logic/resetBoard';
import checkCastleMoves from '../Logic/checkCastleMoves';
import checkEnPassant from '../Logic/checkEnPassant';
import GameOver from '../Board/GameOver/GameOver';

// TODO

// checkmate
// stalemate
// castle when king moves through check

// X complete movement of all pieces              
// X capturing pieces                             
// X check for valid moves
// X  -> tile is occupied                         
// X  -> passed tiles are occupied                
// X  -> en passant
// X  -> Pawn promotion
// X  -> Add castling
// X  -> add check
// X  -> prevent king from moving into checks
// X  -> check for pins
// X  -> check if king can capture unprotected piece
//   checkmate
//    -> 
//   stalemate
//    -> 50 move rule
//    -> threefold repition
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

//responsive board size
let width = window.innerHeight / 1.2;
let pieceWidth = width / 8;

function Board() {

    //Get rules of piece movement
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

    // [14,12,13,15,16,13,12,14],
    // [11,11,11,11,11,11,11,11],
    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0],
    // [1,1,1,1,1,1,1,1],
    // [4,2,3,5,6,3,2,4],

    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,11],
    // [16,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0],
    // [0,4,0,0,0,0,0,1],
    // [0,0,4,0,6,0,0,0],

    // [14,12,13,15,16,13,12,14],
    // [11,11,11,11,11,11,11,11],
    // [0,0,0,15,0,15,0,0],
    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0],
    // [1,1,1,0,1,0,1,1],
    // [4,0,0,0,6,0,0,4],


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

    //saves possible Tiles for active piece
    const [possibleTiles, setPossibleTiles] = useState([]);

    //save all possible moves when player is in check
    const [possibleTilesAfterCheck, setPossibleTilesAfterCheck] = useState([])
    const [possibleKingTilesAfterCheck, setPossibleKingTilesAfterCheck] = useState([])

    //keep track of if piece is dragged or not
    const [pieceIsDragged, setPieceIsDragged] = useState(false);

    //player is in check
    const [playerIsInCheck, setPlayerIsInCheck] = useState(false);

    //true = game is over
    const [gameOver, setGameOver] = useState(false);

    //-------------------------------------------------------------------------------------

    //grabbing the piece
    function grabPiece (e) {

        //get tile on which the piece was standing
        const currentX = Math.floor((e.clientX - BoardRef.current.offsetLeft) / pieceWidth);
        const currentY = Math.floor((e.clientY - BoardRef.current.offsetTop) / pieceWidth);

        exitMove: if (e.target.classList.contains("piece")) {
            if (playerIsInCheck) {
                console.log("checking moves")
                getPossibleTilesAfterCheck()
            }

            //move piece by clicking clicking (not dragging)
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
            if ((!(e.target === activePiece.piece) && activePiece.counter === 0) || activePiece.positionX !== currentX || activePiece.positionY !== currentY) {
                const updatePiece = {
                    isActive: e.target,
                    piece: position[currentY][currentX],
                    positionX: currentX,
                    positionY: currentY,
                    counter: 0
                }
                setActivePiece(updatePiece)
            }

            setPieceIsDragged(true)

        } else if (activePiece.isActive) {
            executeMove(currentX, currentY)
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

        const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / pieceWidth);
        const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / pieceWidth);

        if (x === activePiece.positionX && y === activePiece.positionY && activePiece.counter === 1) {
            const updatePiece = {
                ...activePiece,
                isActive: false,
                piece: null,
                positionX: null,
                positionY: null,
                counter: 0
            }
            setActivePiece(updatePiece)
        } else {
            const updatePiece = {
                ...activePiece,
                counter: 1
            }
            setActivePiece(updatePiece)
        }
        
        if (activePiece.isActive && BoardRef) {
            executeMove(x, y);
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
                for (let i = 0; i < possibleKingTilesAfterCheck.length; i++) {
                    if (JSON.stringify(possibleKingTilesAfterCheck[i]) === JSON.stringify([y, x])) {
                        match = true;
                        break;
                    }
                }
            } else if ((playerTurn && activePiece.piece < 8) || (!playerTurn && activePiece.piece > 8)){
                for (let i = 0; i < possibleTilesAfterCheck.length; i++) {
                    if (JSON.stringify(possibleTilesAfterCheck[i]) === JSON.stringify([y, x])) {
                        match = true;
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < possibleTiles.length; i++) {
                if ((playerTurn && (position[y][x] > 8 || position[y][x] === 0)) || (!playerTurn && position[y][x] < 8)) {
                    if (JSON.stringify(possibleTiles[i]) === JSON.stringify([y, x])) {
                        match = true;
                        break;
                    }
                }
            }
        }
        
        //if desired tile is a possible moves
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
    
            //highlight last move
            const updateLastPiece = {
                ...lastPiece, 
                oldPositionX: activePiece.positionX,
                oldPositionY: activePiece.positionY,
                newPositionX: x,
                newPositionY: y
            }
            setLastPiece(updateLastPiece)

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


    // ------------------------------------------------------------------------------------------------


    //get possible tiles for active (clicked) piece
    function getPossibleTiles() {

        if ((playerTurn && activePiece.piece < 8) || (!playerTurn && activePiece.piece > 8)) {

            let tiles = getPieceMovement(position, activePiece.piece, activePiece.positionX, activePiece.positionY, playerTurn);
            let validMoves = [];

            for (let i = 0; i < tiles.length; i++) {

                let string = JSON.stringify(tiles[i])
                let y = string.charAt(1)
                let x = string.charAt(3)

                if ((!playerTurn && position[y][x] > 8) || (playerTurn && position[y][x] < 8 && position[y][x] > 0)) {
                    tiles.splice(i, 1);
                    i--
                }

                //check if pice can move or is pinned
                //create copy of current position
                let positionCopy = [];
                for (let i = 0; i < position.length; i++) {
                    positionCopy[i] = position[i].slice();
                }

                //simulate the move
                positionCopy[y][x] = activePiece.piece;
                positionCopy[activePiece.positionY][activePiece.positionX] = 0;

                //check if new simulated position is still check
                const isCheck = checkForCheck(positionCopy)

                if (isCheck === false) {
                    validMoves.push(tiles[i])
                }
            }
            setPossibleTiles(validMoves)
        }
    }


    //get all possible tiles for each player
    function getAllPossibleTiles (position) {

        let pTurn = true;
        let simulatedTilesWhite = []
        let simulatedTilesBlack = []

        for (let c = 0; c < 2; c++) {
            
            let allSimulatedTiles = []

            for (let posX =  0; posX < 8; posX++) {
                for (let posY = 0; posY < 8; posY++) {

                    let piece = position[posY][posX];

                    if ((pTurn && piece < 8 && piece > 0) || (!pTurn && piece > 8)) {
                        const tiles = getPieceMovement(position, piece, posX, posY, pTurn)
                        allSimulatedTiles = allSimulatedTiles.concat(tiles)
                    }
                }
            }  

            if (allSimulatedTiles.length > 0) {

                //remove tile if its white turn und on the tile is a white piece (same for black)
                let itemsFound = {};
                for (let i = 0; i < allSimulatedTiles.length; i++) {

                    let string = JSON.stringify(allSimulatedTiles[i])
                    let y = string.charAt(1)
                    let x = string.charAt(3)

                    if ((!pTurn && position[y][x] > 8) || (pTurn && position[y][x] < 8 && position[y][x] > 0)) {
                        allSimulatedTiles.splice(i, 1);
                        i--
                    }
                }
                
                // remove duplicates from array
                for (let i = 0; i < allSimulatedTiles.length; i++) {
        
                    let string = JSON.stringify(allSimulatedTiles[i])
                    if (itemsFound[string]) { continue; }
                    pTurn ? simulatedTilesWhite.push(allSimulatedTiles[i]) : simulatedTilesBlack.push(allSimulatedTiles[i]);
                    itemsFound[string] = true;
                }
            }
            pTurn = false;
        }
        return {simulatedTilesWhite, simulatedTilesBlack}
    }


    //check possible moves when player is in check
    function getPossibleTilesAfterCheck () {

        let possibleMoves;
        let king;

        const tiles = getAllPossibleTiles(position)

        if (playerIsInCheck === "white") {
            king = 6;
            possibleMoves = tiles.simulatedTilesWhite;
        } else if (playerIsInCheck === "black") {
            king = 16;
            possibleMoves = tiles.simulatedTilesBlack;
        }

        //get king position
        const kingPosition = getKingPosition(position, king)

        //blocking the check with a piece
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

            //place a not existing piece on current possible tile to block the check
            positionCopy[y][x] = 10;

            //check if new simulated position is still check
            const isCheck = checkForCheck(positionCopy)

            //if position got no check, add move to possible moves after check
            if (isCheck === false) {
                setPossibleTilesAfterCheck(oldArray => [...oldArray, [y, x]])
            }
        }

        
        //escaping with the king
        const simulatedTilesKing = rules.kingMove(kingPosition[1], kingPosition[0], position, king, castle)

        for (let i = 0; i < simulatedTilesKing.length; i++) {

            //create copy of current position
            let positionCopy = [];
            for (let i = 0; i < position.length; i++) {
                positionCopy[i] = position[i].slice();
            }

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
            const isCheck = checkForCheck(positionCopy)
            
            if (isCheck === false) {
                setPossibleKingTilesAfterCheck(oldArray => [...oldArray, [y, x]])
            }
        }
    }


    function checkForCheck (position) {

        let king;
        let inCheck;
        let possibleMoves;

        //get all possible Tiles for each player
        const tiles = getAllPossibleTiles(position)

        //set variables
        if (playerTurn) {
            king = 6;
            possibleMoves = tiles.simulatedTilesBlack;
            console.log()
        } else {
            king = 16;
            possibleMoves = tiles.simulatedTilesWhite;
        }

        //get king position
        const kingPosition = getKingPosition(position, king)

        //check if player is in check
        for (let i = 0; i < possibleMoves.length; i++) {
            if (JSON.stringify(possibleMoves[i]) === JSON.stringify(kingPosition)) {
                inCheck = true;
                break;
            } 
        }

        if ((playerTurn && inCheck) || (!playerTurn && inCheck)) {
            return true
        } else {
            return false
        }
    }


    //get king position
    function getKingPosition (position, king) {
        for (let posX = 0; posX < 8; posX++) {
            for (let posY = 0; posY < 8; posY++) {
                if (position[posY][posX] === king) {
                    return [posY, posX];
                }
            }
        }
    }


    function getPieceMovement(position, piece, posX, posY, playerTurn) {

        switch (piece) {
            //Pawn (white)
            case 1:
                if (playerTurn) {
                    const pawnWhite = rules.pawnWhiteMove(posX, posY, position, pawnCanEnPassant)
                    return pawnWhite;
                }
                break;
            //Pawn (black)
            case 11: 
                if (!playerTurn) {
                    const pawnBlack = rules.pawnBlackMove(posX, posY, position, pawnCanEnPassant)
                    return pawnBlack;
                }
                break;
            //Knight (white and black)
            case 2:
            case 12:
                if ((playerTurn && piece === 2) || (!playerTurn && piece === 12)) {
                    const knight = rules.knightMove(posX, posY, position)
                    return knight;
                }
                break;
            //Bishop (white and black)
            case 3:
            case 13: 
                if ((playerTurn && piece === 3) || (!playerTurn && piece === 13)) {
                    const bishop = rules.bishopMove(posX, posY, position)
                    return bishop;
                }              
                break;
            //Rook (white and black)
            case 4:
            case 14:
                if ((playerTurn && piece === 4) || (!playerTurn && piece === 14)) {
                    const rook = rules.rookMove(posX, posY, position)
                    return rook;
                }
                break;
            //Queen (white and black)
            case 5:
            case 15:
                if ((playerTurn && piece === 5) || (!playerTurn && piece === 15)) {
                    const queen = rules.queenMove(posX, posY, position)
                    return queen;
                }
                break;
            //King (white and black)
            case 6:
            case 16:
                if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {
                    const king = rules.kingMove(posX, posY, position, piece, castle, playerIsInCheck)
                    return king;
                }
                break;
            default: break;
        }
    }


    // ------------------------------------------------------------------------------------------------

    //check possible moves
    useEffect(() => {
        if (activePiece.isActive) {
            getPossibleTiles();
        }
    }, [activePiece.piece, activePiece.positionX, activePiece.positionY])

    //check for checks
    useEffect(() => {
        setPossibleTiles([])
        setPossibleTilesAfterCheck([])
        setPossibleKingTilesAfterCheck([])
        
        const isCheck = checkForCheck(position);
        // const tiles = getAllPossibleTiles(position)

        if (playerTurn && isCheck) {
            setPlayerIsInCheck("white")
        } else if (!playerTurn && isCheck){
            setPlayerIsInCheck("black")
        }

        // if (playerTurn && isCheck && tiles.simulatedTilesWhite.length === 0) {
        //     console.log("checkmate, white lost")
        // } else if (!playerTurn && isCheck && tiles.simulatedTilesBlack.length === 0) {
        //     console.log("checkmate, black lost")
        // }
    }, [playerTurn])

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
                        for (let c = 0; c < possibleKingTilesAfterCheck.length; c++) {
                            if ((JSON.stringify(possibleTiles[x]) === JSON.stringify([j, i])) && (JSON.stringify(possibleKingTilesAfterCheck[c]) === JSON.stringify([j, i]))) {
                                if ((playerTurn && position[j][i] > 8) || (!playerTurn && position[j][i] < 8 && position[j][i] > 0)) {
                                    isPossibleCapture = true;
                                } else if (position[j][i] === 0) {
                                    isPossibleMove = true;
                                }
                            }
                        }
                    } else {
                        for (let c = 0; c < possibleTilesAfterCheck.length; c++) {
                            if ((JSON.stringify(possibleTiles[x]) === JSON.stringify([j, i])) && (JSON.stringify(possibleTilesAfterCheck[c]) === JSON.stringify([j, i]))) {
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