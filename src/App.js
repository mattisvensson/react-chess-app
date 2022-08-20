import React, {useEffect, useRef, useState} from 'react';

import Info from './components/Info/Info';
import PlayerInfo from './components/PlayerInfo/PlayerInfo';
import GameInfo from './components/GameInfo/GameInfo';

import Tile from './components/Board/Tiles/Tile';
import Promotion from './components/Board/Promotion/Promotion';
import checkCastleMoves from './components/Board/Logic/checkCastleMoves';
import executeCastleMoves from './components/Board/Logic/executeCastleMoves';
import checkEnPassant from './components/Board/Logic/checkEnPassant';
import {pW, pB, knW, knB, bW, bB, rW, rB, qW, qB, kW, kB, empty} from './components/Board/pieceDeclaration';
import { initialPosition, initialActivePiece, initialLastMove, initialPawnIsPromoting, initialPawnCanEnPassant, initialCastle, initialGameOver, initialPlayerNames, initialHoveredTile } from './components/Board/initialStateValues';
import GameOver from './components/Board/GameOver/GameOver';

import { ReactComponent as BoardWhite } from './materials/chessboard_white.svg';
import { ReactComponent as BoardBlack } from './materials/chessboard_black.svg';

import './App.css';
import './components/Board/Board.css';

import audioMoveFile from './sounds/move.mp3';
const audioMove = new Audio(audioMoveFile)


// TODO

// X = completed

//   Version 1.0
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
// X  -> prevent kings from getting close to each other
// X  -> check for pins
// X  -> check if king can capture unprotected piece
// X checkmate
// X draw
// X  -> 50 move rule (50 moves without pawn move or capture)
// X  -> threefold repetition
// X  -> no legal moves for player
// X  -> insufficient material
// X tile highlighting
// X  -> possible Moves
// X  -> capturable pieces
// X  -> last move
// x  -> active piece


//   Version 2.0
// X highlight hovered tile
// X add time for players
// X show material advantage for players
// X add sound effects
//   game recording
//    -> able to click thorugh moves/game
//    -> highlight move from that position
//    -> show timestamps for each move (when game is finished)
//   show game notation while game is running for each move
// X save current game to local storage
// X load game correctly (with timer) from local storage
//   download game pgn
// X board can rotate after each move
//   "play as" setting
//   mobile styles
//   right click highlightes tile
//
//   Überarbeiten
//   move simulieren als eigene funktion schreiben
//   surrender buttons während des spiels
//   nach quit des spiels gleiche einstellungen wie beim start
//   delay beim ziehen der figur durch clicken
//   "zurücksetzten" der figur beim ziehen der figur (draggen)
//   check beim castlen prüfen (ab 1243)
//   markieren von feldern micht rechter maustaste
//
//   Version 3.0
//   connect to chess api / backend
//    -> play with bots
//    -> get openings
//    -> puzzles
//    -> engine evaluation
//   custom board position generator
//   login for users
//   save played games to database
//   play with friends online

//responsive board size
let width = window.innerHeight > window.innerWidth ? window.innerWidth / 1.05 : window.innerHeight / 1.4;
let pieceWidth = width / 8;

function App() {

    let size = window.innerWidth < 750 ? "mobile" : "desktop"

    //States

    //Refs
    const BoardRef = useRef(null);    
    const isMounted = useRef(false)
    
    const [loading, setLoading] = useState(false)

    //Keep track of active piece
    const [activePiece, setActivePiece] = useState(initialActivePiece)

    //keep track of moves and positions
    const [position, setPosition] = useState(initialPosition)
    const [positionList, setPositionList] = useState([])
    const [moveList, setMoveList] = useState([])
    const [currentPosition, setCurrentPosition] = useState(initialPosition)
    const [currentMove, setCurrentMove] = useState(initialLastMove)
    const [lastMove, setLastMove] = useState(initialLastMove)

    //true = white at bottom
    //false = black at botom
    const [boardDirection, setBoardDirection] = useState(true)

    //promotion and en passant
    const [pawnIsPromoting, setPawnIsPromoting] = useState(initialPawnIsPromoting)
    const [pawnCanEnPassant, setPawnCanEnPassant] = useState(initialPawnCanEnPassant)

    //keep track of castling rights for both sides
    const [castle, setCastle] = useState(initialCastle)

    //true = white's turn
    //false = black's turn
    const [playerTurn, setPlayerTurn] = useState(true)
    const [playerNames, setPlayerNames] = useState(initialPlayerNames)
    const [playerIsInCheck, setPlayerIsInCheck] = useState(false);
    const [startAs, setStartAs] = useState("white");    
    const [playerTop, setPlayerTop] = useState("black");
    const [playerBottom, setPlayerBottom] = useState("white");

    //saves possible Tiles
    const [possibleTiles, setPossibleTiles] = useState([]);
    const [possibleTilesAfterCheck, setPossibleTilesAfterCheck] = useState([])
    const [possibleKingTilesAfterCheck, setPossibleKingTilesAfterCheck] = useState([])

    //keep track of if piece is dragged or not
    const [pieceIsDragged, setPieceIsDragged] = useState(false);

    //info if game is over
    const [gameOver, setGameOver] = useState(initialGameOver);
    const [gameStatus, setGameStatus] = useState(false)

    const [fifthyMoveRule, setFifthyMoveRule] = useState(0);
    const [hoveredTile, setHoveredTile] = useState(initialHoveredTile);
    const [markedTiles, setMarkedTiles] = useState([]);

    //Game settings
    const [showPossibleTiles, setShowPossibleTiles] = useState(true)
    const [allowPieceSelection, setAllowPieceSelection] = useState(true)
    const [playSound, setPlaySound] = useState(true)    
    const [saveGame, setSaveGame] = useState(false)
    const [foundSavedGame, setFoundSavedGame] = useState(false)

    //-------------------------------------------------------------------------------------
    //piece movement logic
    window.oncontextmenu = function (e) {
        let currentX = Math.floor((e.clientX - BoardRef.current.offsetLeft) / pieceWidth);
        let currentY = Math.floor((e.clientY - BoardRef.current.offsetTop) / pieceWidth);
        if (currentX >= 0 && currentX <= 7 && currentY >= 0 && currentY <= 7) {
            setMarkedTiles(oldArray => [...oldArray, [currentX, currentY]])
        }
        return false;   // cancel default menu
    }

    //grabbing the piece
    function grabPiece (e) {

        if (e.button !== 0) return

        //get tile on which the piece was standing
        let {currentX, currentY} = getBoardCoords(e.clientX, e.clientY)

        //blacks turn and board rotation is on
        if (!boardDirection) {
            let invertedCords = invertBoardAxis(currentX, currentY)
            currentX = invertedCords.invertedX
            currentY = invertedCords.invertedY
        }

        let match = false;
        if (possibleTiles) {
            for (let i = 0; i < possibleTiles.length; i++) {
                if (JSON.stringify(possibleTiles[i]) === JSON.stringify([currentY, currentX])) {
                    let string = JSON.stringify(possibleTiles[i])
                    let y = string.charAt(1)
                    let x = string.charAt(3)
                    if ((playerTurn && position[y][x] > 8) || (!playerTurn && position[y][x] < 8 && position[y][x] > 0)) {
                        console.log("drin")
                        executeMove(currentX, currentY)
                        match = true;
                        break
                    }
                }
            }
        }

        if (e.target.classList.contains("piece") && allowPieceSelection && !match) {

            //set active piece
            if (e.target !== activePiece.ref) {
                const updatePiece = {
                    isActive: true,
                    ref: e.target,
                    piece: position[currentY][currentX],
                    positionX: currentX,
                    positionY: currentY,
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

            if (playerIsInCheck) {
                const tiles = getPossibleTilesAfterCheck(playerIsInCheck)
                setPossibleTilesAfterCheck(tiles.tiles)
                setPossibleKingTilesAfterCheck(tiles.tilesKing)
            }            

            //get coordinates of mouse
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            //get borders of the board
            const BoardMinX = BoardRef.current.offsetLeft;
            const BoardMinY = BoardRef.current.offsetTop;

            //set piece position to mouse position
            e.target.style.transform = `translate(${mouseX - BoardMinX - (pieceWidth / 2) + "px"}, ${mouseY - BoardMinY - (pieceWidth / 2) + "px"})`;
            e.target.style.zIndex = "10";
            e.target.style.cursor = `grabbing`

            if ((playerTurn && position[currentY][currentX] === pW) || (!playerTurn && position[currentY][currentX] === pB)) {
                let updatePromotion = {
                    ...pawnIsPromoting,
                    prevX: currentX,
                    prevY: currentY
                }
                setPawnIsPromoting(updatePromotion)
            }

            setHoveredTile(initialHoveredTile)
            setLastMove(currentMove)
            setPieceIsDragged(true)        
        }
    }

    //move piece
    function movePiece (e) {

        if (pieceIsDragged && allowPieceSelection) {

            //get coordinates of mouse
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            //get borders of the board
            const BoardMinX = BoardRef.current.offsetLeft;
            const BoardMaxX = BoardRef.current.offsetLeft + width;
            const BoardMinY = BoardRef.current.offsetTop;
            const BoardMaxY = BoardRef.current.offsetTop + width;

            let posX = mouseX - BoardMinX - (pieceWidth / 2);
            let posY = mouseY - BoardMinY - (pieceWidth / 2);

            if (activePiece.isActive) {  
                
                let {currentX, currentY} = getBoardCoords(e.clientX, e.clientY)
                
                const updateHover = {
                    isHovering: true,
                    x: currentX,
                    y: currentY
                }
                setHoveredTile(updateHover)

                //stop piece from following the mouse if mouse is outside of the board
                if (mouseX < BoardMinX || mouseX > BoardMaxX || mouseY < BoardMinY || mouseY > BoardMaxY) {

                    activePiece.ref.style.transform = null;
                    activePiece.ref.style.zIndex = null;
                    activePiece.ref.style.cursor = null;

                    setActivePiece(initialActivePiece)
                } else {
                    activePiece.ref.style.transform = `translate(${posX}px, ${posY}px)`;
                    activePiece.ref.style.cursor = `grabbing`
                }
            }
        }
    }


    //drop piece
    function dropPiece (e) {

        if (activePiece.ref) {
            activePiece.ref.style.transform = null;
            activePiece.ref.style.zIndex = null;
            activePiece.ref.style.cursor = null;
            setPieceIsDragged(false)
        }

        setHoveredTile(initialHoveredTile)

        //get tile on which the piece was standing
        let {currentX, currentY} = getBoardCoords(e.clientX, e.clientY)

        //blacks turn and board rotation is on
        if (!boardDirection) {
            let invertedCords = invertBoardAxis(currentX, currentY)
            currentX = invertedCords.invertedX
            currentY = invertedCords.invertedY
        }

        //deselect piece if its already active and grabbed
        if (currentX === activePiece.positionX && currentY === activePiece.positionY && activePiece.counter === 1) {
            setActivePiece(initialActivePiece)
        } else if (activePiece.isActive) {
            e.target.style.transform = null
            executeMove(currentX, currentY);
        }
    }


    //execute move
    function executeMove (x, y) {

        //promotion
        let savePromotion = {};
        if (activePiece.piece === pW && y === 0) {
            savePromotion = {
                isPromoting: true,
                color: "white"
            }
        } else if (activePiece.piece === pB && y === 7) {
            savePromotion = {
                isPromoting: true,
                color: "black"
            }
        }

        //check if desired tile is in possible moves
        let match = false;

        if (possibleTiles) {
            for (let j = 0; j < possibleTiles.length; j++) {
                if (playerIsInCheck) {
                    if ((playerTurn && activePiece.piece === kW) || (!playerTurn && activePiece.piece === kB)) {
                        for (let i = 0; i < possibleKingTilesAfterCheck.length; i++) {
                            if ((JSON.stringify(possibleTiles[j]) === JSON.stringify(possibleKingTilesAfterCheck[i])) && (JSON.stringify(possibleTiles[j]) === JSON.stringify([y, x]))) {
                                match = true;
                                break;
                            }
                        }
                    } else if ((playerTurn && activePiece.piece < 8) || (!playerTurn && activePiece.piece > 8)){
                        for (let i = 0; i < possibleTilesAfterCheck.length; i++) {
                            if ((JSON.stringify(possibleTiles[j]) === JSON.stringify(possibleTilesAfterCheck[i])) && (JSON.stringify(possibleTiles[j]) === JSON.stringify([y, x]))) {
                                match = true;
                                break;
                            }
                        }
                    }
                } else if ((playerTurn && (position[y][x] > 8 || position[y][x] === empty)) || (!playerTurn && position[y][x] < 8)) {
                    if (JSON.stringify(possibleTiles[j]) === JSON.stringify([y, x])) {
                        match = true;
                        break;
                    }
                }
            }
        }

        //if desired tile is a possible moves
        if (match) {

            if (position[y][x] !== empty || (playerTurn && activePiece.piece === pW) || (!playerTurn && activePiece.piece === pB)) {
                setFifthyMoveRule(0)
            } else {
                setFifthyMoveRule(prev => prev + 1)
            }

            setGameStatus(true)

            //if pawn is promoting, set coordinates for promotion and display promotion menu
            if (savePromotion.isPromoting) {
                const updatePromotion = {
                    ...pawnIsPromoting,
                    isPromoting: true,
                    color: savePromotion.color,
                    posX: x,
                    posY: y,
                    capturedPiece: position[y][x],
                    showPromotionMenu: true,
                }
                setPawnIsPromoting(updatePromotion)
                setAllowPieceSelection(false)
            } else {

                //play sound
                playSound && audioMove.play()

                let positionCopy = [];
                for (let i = 0; i < position.length; i++) {
                    positionCopy[i] = position[i].slice();
                }

                //en passant
                const enpassant = checkEnPassant(x, y, activePiece, position, pawnCanEnPassant, setPawnCanEnPassant);

                //execute castle
                const caslte = executeCastleMoves(x, y, positionCopy, castle, setCastle, activePiece, setPosition);

                if (!enpassant && !caslte) {
                    //normal move
                    const newPosition = [...position];
                    newPosition[activePiece.positionY][activePiece.positionX] = empty;
                    newPosition[y][x] = activePiece.piece;
                    setPosition(newPosition);
                }


                //highlight last move
                const updateLastMove = {
                    ...lastMove,
                    oldPositionX: activePiece.positionX,
                    oldPositionY: activePiece.positionY,
                    newPositionX: x,
                    newPositionY: y
                }
                setLastMove(updateLastMove)
                setCurrentMove(updateLastMove)

                const updatePiece = {
                    ...activePiece,
                    isActive: false,
                    ref: null
                }
                setActivePiece(updatePiece)
                setPlayerIsInCheck(false)

                //check which castle moves are still possible
                checkCastleMoves(position, castle, setCastle)

                //switch player turn
                setPlayerTurn(prev => !prev)
            }
        }

        if (activePiece.ref) {
            activePiece.ref.style.transform = null;
            activePiece.ref.style.zIndex = null;
            setPieceIsDragged(false)
        }
    }


    //execute pawn promotionm(executed from Promotion.js)
    function executePromotion (piece) {

        if (pawnIsPromoting.color === "black") piece += 10;

        if (piece < 99) {

            //play sound
            playSound && audioMove.play()

            const newPosition = [...position];
            newPosition[pawnIsPromoting.posY][pawnIsPromoting.posX] = piece;
            newPosition[pawnIsPromoting.prevY][pawnIsPromoting.prevX] = empty;
            setPosition(newPosition);

            //highlight last move
            const updateLastMove = {
                ...lastMove,
                oldPositionX: pawnIsPromoting.prevX,
                oldPositionY: pawnIsPromoting.prevY,
                newPositionX: pawnIsPromoting.posX,
                newPositionY: pawnIsPromoting.posY
            }
            setLastMove(updateLastMove)

            const updatePromotion = {
                ...pawnIsPromoting,
            showPromotionMenu: false,
            newPiece: piece,
            }
            setPawnIsPromoting(updatePromotion)
            setPlayerTurn(prev => !prev)
        } else if (piece >= 99) {
            const updatePromotion = {
                ...pawnIsPromoting,
                showPromotionMenu: false,
            }
            setPawnIsPromoting(updatePromotion)
        }
        setAllowPieceSelection(true)
    }


    // ------------------------------------------------------------------------------------------------
    //logic


    //invert coordinates
    function invertBoardAxis (x, y) {
        if (!boardDirection) {

            let axis = [0, 1, 2, 3, 4, 5, 6, 7]

            let invertedX = (axis.length - 1) - x;
            let invertedY = (axis.length - 1) - y;

            return {invertedX, invertedY}
            
        }
    }


    //get board coordinates of current mouse position
    function getBoardCoords (x, y) {
        let currentX = Math.floor((x - BoardRef.current.offsetLeft) / pieceWidth);
        let currentY = Math.floor((y - BoardRef.current.offsetTop) / pieceWidth);
        return {currentX, currentY}
    }


    //get possible tiles for active (clicked) piece
    function getPossibleTiles(position, piece, posX, posY, playerTurn) {

        if ((playerTurn && piece < 8) || (!playerTurn && piece > 8)) {

            let tiles = getPieceMovement(position, piece, posX, posY, playerTurn);
            let validMoves = [];

            for (let i = 0; i < tiles.length; i++) {
                
                let string = JSON.stringify(tiles[i])
                let y = string.charAt(1)
                let x = string.charAt(3)

                if ((!playerTurn && position[y][x] > 8) || (playerTurn && position[y][x] < 8 && position[y][x] > 0)) {
                    tiles.splice(i, 1);
                    i--
                }
            }

            for (let i = 0; i < tiles.length; i++) {

                let string = JSON.stringify(tiles[i])
                let y = string.charAt(1)
                let x = string.charAt(3)

                //check if piece can move or is pinned
                //create copy of current position
                let positionCopy = [];
                for (let i = 0; i < position.length; i++) {
                    positionCopy[i] = position[i].slice();
                }

                //simulate the move
                positionCopy[y][x] = piece;
                positionCopy[posY][posX] = empty;

                //check if new simulated position is still check
                const isCheck = checkForCheck(positionCopy)

                let kingIsNear = false;
                if (piece === kW || piece === kB) {
                    kingIsNear = isKingNear(positionCopy)
                }

                if (isCheck === false && kingIsNear === false) {
                    validMoves.push(tiles[i])
                }
            }
            return validMoves
        }
        return []
    }


    //get all possible tiles for each player
    function getAllPossibleTiles (position) {

        let simulatedPlayerTurn = true;
        let tilesWhite = {
            kingTiles: [],
            tiles: []
        }
        let tilesBlack = {
            kingTiles: [],
            tiles: []
        }

        for (let c = 0; c < 2; c++) {
            let allTiles = []
            let kingTiles = []

            for (let posX = 0; posX < 8; posX++) {
                for (let posY = 0; posY < 8; posY++) {

                    let piece = position[posY][posX];

                    if ((simulatedPlayerTurn && piece === kW) || (!simulatedPlayerTurn && piece === kB)) {
                        const tiles = getKingMovement(position, piece, posX, posY, simulatedPlayerTurn)
                        kingTiles = kingTiles.concat(tiles)
                    } else if ((simulatedPlayerTurn && piece < 8 && piece > 0) || (!simulatedPlayerTurn && piece > 8)) {
                        const tiles = getPieceMovement(position, piece, posX, posY, simulatedPlayerTurn)
                        allTiles = allTiles.concat(tiles)
                    }
                }
            }

            //remove tile if its whites turn and on the tile is a white piece (same for black)
            for (let i = 0; i < allTiles.length; i++) {
                let string = JSON.stringify(allTiles[i])
                let y = string.charAt(1)
                let x = string.charAt(3)

                if ((!simulatedPlayerTurn && position[y][x] > 8) || (simulatedPlayerTurn && position[y][x] < 8 && position[y][x] > 0)) {
                    allTiles.splice(i, 1);
                    i--
                }
            }

            for (let i = 0; i < kingTiles.length; i++) {
                let string = JSON.stringify(kingTiles[i])
                let y = string.charAt(1)
                let x = string.charAt(3)

                if ((!simulatedPlayerTurn && position[y][x] > 8) || (simulatedPlayerTurn && position[y][x] < 8 && position[y][x] > 0)) {
                    kingTiles.splice(i, 1);
                    i--
                }
            }

            // remove duplicates from array
            let itemsFound = {};
            // let clearedTiles = [];
            for (let i = 0; i < allTiles.length; i++) {

                let string = JSON.stringify(allTiles[i])
                if (itemsFound[string]) { continue; }
                // clearedTiles.push(allTiles[i]);
                simulatedPlayerTurn ? tilesWhite.tiles.push(allTiles[i]) : tilesBlack.tiles.push(allTiles[i]);
                itemsFound[string] = true;
            }


            simulatedPlayerTurn ? tilesWhite.kingTiles = kingTiles : tilesBlack.kingTiles = kingTiles
            simulatedPlayerTurn = false;
        }
        return {tilesWhite, tilesBlack}
    }


    //get possible tiles when player is in check
    function getPossibleTilesAfterCheck (playerInCheck) {

        let possibleMoves;
        let king;

        let tiles = [];
        let tilesKing = [];

        const allTiles = getAllPossibleTiles(position)

        if (playerInCheck === "white") {
            king = 6;
            possibleMoves = allTiles.tilesWhite.tiles;
        } else if (playerInCheck === "black") {
            king = 16;
            possibleMoves = allTiles.tilesBlack.tiles;
        }

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
                let newTile = [y, x]
                tiles = tiles.concat([newTile])
            }
        }

        const kingPosition = getKingPosition(position, king)
        const possibleKingMoves = kingMove(kingPosition[1], kingPosition[0], position, king, castle)

        //escaping with the king
        for (let i = 0; i < possibleKingMoves.length; i++) {

            //create copy of current position
            let positionCopy = [];
            for (let i = 0; i < position.length; i++) {
                positionCopy[i] = position[i].slice();
            }

            let string = JSON.stringify(possibleKingMoves[i])
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
            if (positionCopy[y][x] === 0 || (playerTurn && positionCopy[y][x] > 8) || (!playerTurn && positionCopy[y][x] < 8)) {
                positionCopy[ky][kx] = 0;
                positionCopy[y][x] = king;

                //check if new simulated position is still check
                const isCheck = checkForCheck(positionCopy)

                if (isCheck === false) {
                    let newTile = [y, x]
                    tilesKing = tilesKing.concat([newTile])
                }
            }
        }
        return {tiles, tilesKing}
    }

    //check if a position contains a check
    function checkForCheck (position) {

        let king;
        let inCheck;
        let possibleMoves;

        //get all possible Tiles for each player
        const tiles = getAllPossibleTiles(position)

        //set variables
        if (playerTurn) {
            king = 6;
            possibleMoves = tiles.tilesBlack.tiles;
        } else {
            king = 16;
            possibleMoves = tiles.tilesWhite.tiles;
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

    //check if the two kings are close to each other
    function isKingNear (position) {

        const whiteKing = getKingPosition(position, 6)
        const blackKing = getKingPosition(position, 16)

        if (whiteKing[0] - 1 === blackKing[0] && whiteKing[1] === blackKing[1]) {
            return true
        } else if (whiteKing[0] - 1 === blackKing[0] && whiteKing[1] + 1 === blackKing[1]) {
            return true
        } else if (whiteKing[0] === blackKing[0] && whiteKing[1] + 1 === blackKing[1]) {
            return true
        } else if (whiteKing[0] + 1 === blackKing[0] && whiteKing[1] + 1 === blackKing[1]) {
            return true
        } else if (whiteKing[0] + 1 === blackKing[0] && whiteKing[1] === blackKing[1]) {
            return true
        } else if (whiteKing[0] + 1 === blackKing[0] && whiteKing[1] - 1 === blackKing[1]) {
            return true
        } else if (whiteKing[0] === blackKing[0] && whiteKing[1] - 1 === blackKing[1]) {
            return true
        } else if (whiteKing[0] - 1 === blackKing[0] && whiteKing[1] - 1 === blackKing[1]) {
            return true
        }
        return false;
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


    function getKingMovement(position, piece, posX, posY, playerTurn) {
        if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {
            const king = kingMove(posX, posY, position, piece, castle, playerIsInCheck)
            return king;
        }
    }

    function getPieceMovement(position, piece, posX, posY, playerTurn) {

        switch (piece) {
            //Pawn (white)
            case 1:
                if (playerTurn) {
                    const pawnWhite = pawnWhiteMove(posX, posY, position, pawnCanEnPassant)
                    return pawnWhite;
                }
                break;
            //Pawn (black)
            case 11:
                if (!playerTurn) {
                    const pawnBlack = pawnBlackMove(posX, posY, position, pawnCanEnPassant)
                    return pawnBlack;
                }
                break;
            //Knight (white and black)
            case 2:
            case 12:
                if ((playerTurn && piece === 2) || (!playerTurn && piece === 12)) {
                    const knight = knightMove(posX, posY, position)
                    return knight;
                }
                break;
            //Bishop (white and black)
            case 3:
            case 13:
                if ((playerTurn && piece === 3) || (!playerTurn && piece === 13)) {
                    const bishop = bishopMove(posX, posY, position)
                    return bishop;
                }
                break;
            //Rook (white and black)
            case 4:
            case 14:
                if ((playerTurn && piece === 4) || (!playerTurn && piece === 14)) {
                    const rook = rookMove(posX, posY, position)
                    return rook;
                }
                break;
            //Queen (white and black)
            case 5:
            case 15:
                if ((playerTurn && piece === 5) || (!playerTurn && piece === 15)) {
                    const rook = rookMove(posX, posY, position)
                    const bishop = bishopMove(posX, posY, position)
                    const combined = rook.concat(bishop)
                    return combined;
                }
                break;
            //King (white and black)
            case 6:
            case 16:
                if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {
                    const king = kingMove(posX, posY, position, piece, castle, playerIsInCheck)
                    return king;
                }
                break;
            default: return [];
        }
    }


    //--------------------------------------------------------------------------------------------------------------


    function pawnWhiteMove (posX, posY, position, pawnCanEnPassant) {
        let tiles = []

        //en passant
        if (posY === 3 && posY === pawnCanEnPassant.posY) {
            if (posX - 1 === pawnCanEnPassant.posX) {
                tiles.push([posY - 1, posX - 1]);
            } else if (posX + 1 === pawnCanEnPassant.posX) {
                tiles.push([posY - 1, posX + 1]);
            }  
        } 
        //standing on starting rank (two steps possible)
        if (posY - 1 >= 0) {
            if (posY === 6) {
                for (let i = 5; i >= 4; i--) {
                    if (position[i][posX] === 0) {
                        tiles.push([i, posX]);
                    } else {
                        break;
                    }
                }
            } else if (position[posY - 1][posX] === 0) {
                tiles.push([posY - 1, posX]);
            }
        }
        //Check if piece can be captured
        if (posY - 1 >= 0 && posX - 1 >= 0) {
            if (position[posY - 1][posX - 1] > 8) {
                tiles.push([posY - 1, posX - 1]);
            }
        }
        if (posY - 1 >= 0 && posX + 1 <= 7) {
            if (position[posY - 1][posX + 1] > 8) {
                tiles.push([posY - 1, posX + 1]);
            }
        }
        return tiles;
    }

    function pawnBlackMove (posX, posY, position, pawnCanEnPassant) {
        let tiles = []

        //en passant
        if (posY === 4 && posY === pawnCanEnPassant.posY) {
            if (posX - 1 === pawnCanEnPassant.posX) {
                tiles.push([posY + 1, posX - 1]);
            } else if (posX + 1 === pawnCanEnPassant.posX) {
                tiles.push([posY + 1, posX + 1]);
            }  
        } 
        //standing on starting rank (two moves possible)
        if(posY === 1) {
            for (let i = 2; i <= 3; i++) {
                if (position[i][posX] === 0) {
                    tiles.push([i, posX]);
                } else {
                    break;
                }
            }
        } else if (posY + 1 <= 7 && position[posY + 1][posX] === 0) {
            tiles.push([posY + 1, posX]);
        }
        //Check if piece can be captured
        if (posY + 1 <= 7 && posX - 1 >= 0) {
            if (position[posY + 1][posX - 1] < 8 && position[posY + 1][posX - 1] > 0 ) {
                tiles.push([posY + 1, posX - 1]);
            }
        }
        if (posY + 1 <= 7 && posX + 1 <= 7) {
            if (position[posY + 1][posX + 1] < 8 && position[posY + 1][posX + 1] > 0) {
                tiles.push([posY + 1, posX + 1]);
            }
        }
        return tiles;
    }

    function knightMove (posX, posY, position) {
        let tiles = []
        if (posY + 1 < 8 && posX + 2 < 8 && posY + 1 >= 0 && posX + 2 >= 0) {
            if (position[posY + 1][posX + 2] === 0) {
                tiles.push([posY + 1, posX + 2]);
            } else {
                tiles.push([posY + 1, posX + 2]);  
            }
        }
        if (posY - 1 < 8 && posX + 2 < 8 && posY - 1 >= 0 && posX + 2 >= 0) {
            if (position[posY - 1][posX + 2] === 0) {
                tiles.push([posY - 1, posX + 2]);
            } else {
                tiles.push([posY - 1, posX + 2]);
            }
        }
        if (posY + 1 < 8 && posX - 2 < 8 && posY + 1 >= 0 && posX - 2 >= 0) {
            if (position[posY + 1][posX - 2] === 0) {
                tiles.push([posY + 1, posX - 2]);
            } else {
                tiles.push([posY + 1, posX - 2]);
            }
        }
        if (posY - 1 < 8 && posX - 2 < 8 && posY - 1 >= 0 && posX - 2 >= 0) {
            if (position[posY - 1][posX - 2] === 0) {
                tiles.push([posY - 1, posX - 2]);
            } else {
                tiles.push([posY - 1, posX - 2]);
            }
        }


        if (posY + 2 < 8 && posX + 1 < 8 && posY + 2 >= 0 && posX + 1 >= 0) {
            if (position[posY + 2][posX + 1] === 0) {
                tiles.push([posY + 2, posX + 1]);
            } else {
                tiles.push([posY + 2, posX + 1]); 
            }
        }
        if (posY - 2 < 8 && posX + 1 < 8 && posY - 2 >= 0 && posX + 1 >= 0) {
            if (position[posY - 2][posX + 1] === 0) {
                tiles.push([posY - 2, posX + 1]);
            } else {
                tiles.push([posY - 2, posX + 1]);
            }
        }
        if (posY + 2 < 8 && posX - 1 < 8 && posY + 2 >= 0 && posX - 1 >= 0) {
            if (position[posY + 2][posX - 1] === 0) {
                tiles.push([posY + 2, posX - 1]);
            } else {
                tiles.push([posY + 2, posX - 1]);
            }
        }
        if (posY - 2 < 8 && posX - 1 < 8 && posY - 2 >= 0 && posX - 1 >= 0) {
            if (position[posY - 2][posX - 1] === 0) {
                tiles.push([posY - 2, posX - 1]);
            } else {
                tiles.push([posY - 2, posX - 1]);
            }
        }
        return tiles;
    }


    function bishopMove (posX, posY, position) {
        let tiles = []
        //bottom right
        for (let i = 1; i < 8; i++) {
            if (posY + i < 8 && posX + i < 8) {
                if (position[posY + i][posX + i] === 0) {
                    tiles.push([posY + i, posX + i]);
                } else {
                    tiles.push([posY + i, posX + i]);
                    break;
                }
            }
        }
        //top right    
        for (let i = 1; i < 8; i++) {
            if (posY - i < 8 && posX + i < 8 && posY - i >= 0) {
                if (position[posY - i][posX + i] === 0) {
                    tiles.push([posY - i, posX + i]);
                } else {
                    tiles.push([posY - i, posX + i]);
                    break;
                }
            }
        }
        //bottom left
        for (let i = 1; i < 8; i++) {
            if (posY + i < 8 && posX - i < 8 && posX - i >= 0) {
                if (position[posY + i][posX - i] === 0) {
                    tiles.push([posY + i, posX - i]);
                } else {
                    tiles.push([posY + i, posX - i]);
                    break;
                }
            }
        }
        //top left
        for (let i = 1; i < 8; i++) {
            if (posY - i < 8 && posX - i < 8 && posY - i >= 0 && posX - i >= 0) {
                if (position[posY - i][posX - i] === 0) {
                    tiles.push([posY - i, posX - i]);
                } else {
                    tiles.push([posY - i, posX - i]);
                    break;
                }
            }
        }
        return tiles;
    }


    function rookMove (posX, posY, position) {
        let tiles = [];
        //down
        for (let i = posY + 1; i < 8; i++) {
            if (position[i][posX] === 0) {
                tiles.push([i, posX]);
            } else {
                tiles.push([i, posX]);
                break;
            }
        }
        //up
        for (let i = posY - 1; i >= 0; i--) {
            if (position[i][posX] === 0) {
                tiles.push([i, posX]);
            } else {
                tiles.push([i, posX]);
                break;
            }
        }
        //right
        for (let i = posX + 1; i < 8; i++) {
            if (position[posY][i] === 0) {
                tiles.push([posY, i]);
            } else {
                tiles.push([posY, i]);
                break;
            }
        }
        //left
        for (let i = posX - 1; i >= 0; i--) {
            if (position[posY][i] === 0) {
                tiles.push([posY, i]);
            } else {
                tiles.push([posY, i]);
                break;
            }
        }
        return tiles;
    }

    function kingMove (posX, posY, position, piece, castle, playerIsInCheck) {
        let tiles = []
        if (posY - 1 >= 0 && posX + 1 < 8) {
            tiles.push([posY - 1, posX + 1]);
        }
        if (posX + 1 < 8) {
            tiles.push([posY, posX + 1]);
        }
        if (posY + 1 < 8 && posX + 1 < 8) {
            tiles.push([posY + 1, posX + 1]);
        }
        if (posY + 1 < 8) {
            tiles.push([posY + 1, posX]);
        }
        if (posY + 1 < 8 && posX - 1 >= 0) {
            tiles.push([posY + 1, posX - 1]);
        }
        if (posX - 1 >= 0) {
            tiles.push([posY, posX - 1]);
        }
        if (posY - 1 >= 0 && posX - 1 >= 0) {
            tiles.push([posY - 1, posX - 1]);
        }
        if (posY - 1 >= 0) {
            tiles.push([posY - 1, posX]);
        }    
        
        //check for castling
        if (piece === 6 && posX === 4 && posY === 7 && playerIsInCheck === false) {
            if (castle.white.castleShort && position[7][5] === 0 && position[7][6] === 0 && position[7][7] === 4) {
                //create copy of current position
                let positionCopy = [];
                for (let i = 0; i < position.length; i++) {
                    positionCopy[i] = position[i].slice();
                }

                positionCopy[7][4] = 0;
                
                positionCopy[7][5] = 6;
                const firstPos = checkForCheck(positionCopy)

                positionCopy[7][5] = 0;
                positionCopy[7][6] = 6;
                const secondPos = checkForCheck(positionCopy)

                if (firstPos === false && secondPos === false) {
                    tiles.push([posY, posX + 2]);
                }
            } 
        
            if (castle.white.castleLong && position[7][3] === 0 && position[7][2] === 0 && position[7][1] === 0 && position[7][0] === 4) {
                //create copy of current position
                let positionCopy = [];
                for (let i = 0; i < position.length; i++) {
                    positionCopy[i] = position[i].slice();
                }

                positionCopy[7][4] = 0;
                
                positionCopy[7][3] = 6;
                const firstPos = checkForCheck(positionCopy)

                positionCopy[7][3] = 0;
                positionCopy[7][2] = 6;
                const secondPos = checkForCheck(positionCopy)

                if (firstPos === false && secondPos === false) {
                    tiles.push([posY, posX - 2]);
                }                         
            } 
        }
        if (piece === 16 && posX === 4 && posY === 0 && playerIsInCheck === false) {
            if (castle.black.castleShort && position[0][5] === 0 && position[0][6] === 0 && position[0][7] === 14) {                              
                //create copy of current position
                let positionCopy = [];
                for (let i = 0; i < position.length; i++) {
                    positionCopy[i] = position[i].slice();
                }

                positionCopy[0][4] = 0;
                
                positionCopy[0][5] = 6;
                const firstPos = checkForCheck(positionCopy)

                positionCopy[0][5] = 0;
                positionCopy[0][6] = 6;
                const secondPos = checkForCheck(positionCopy)

                if (firstPos === false && secondPos === false) {
                    tiles.push([posY, posX + 2]);
                }
            } 
        
            if (castle.black.castleLong && position[0][3] === 0 && position[0][2] === 0 && position[0][1] === 0 && position[0][0] === 14) {
                //create copy of current position
                let positionCopy = [];
                for (let i = 0; i < position.length; i++) {
                    positionCopy[i] = position[i].slice();
                }

                positionCopy[0][4] = 0;
                
                positionCopy[0][3] = 6;
                const firstPos = checkForCheck(positionCopy)

                positionCopy[0][3] = 0;
                positionCopy[0][2] = 6;
                const secondPos = checkForCheck(positionCopy)

                if (firstPos === false && secondPos === false) {
                    tiles.push([posY, posX - 2]);
                }                             
            } 
        }
        return tiles;
    }


    // ------------------------------------------------------------------------------------------------


    //check for insufficient material
    function checkForInsufficientMaterial () {

        let pieces = {
            white: [],
            black: []
        }
        let bishopColor = {
            white: undefined,
            black: undefined
        }
        let insufficientMaterial = false;
        for (let posX = 0; posX < 8; posX++) {
            for (let posY = 0; posY < 8; posY++) {
                if (position[posY][posX] > 0 && position[posY][posX] < 8) {
                    if (position[posY][posX] === 3) { 
                        let color;
                        (posX + posY + 2) % 2 === 0 ? color = "light" : color = "dark";
                        bishopColor.white = color;
                    }
                    pieces.white.push(position[posY][posX])
                } else if (position[posY][posX] > 8) {
                    if (position[posY][posX] === 13) {
                        let color;
                        (posX + posY + 2) % 2 === 0 ? color = "light" : color = "dark";
                        bishopColor.black = color;
                    }
                    pieces.black.push(position[posY][posX])
                }
            
            }
        }
        
        if (pieces.white.length === 1 && pieces.black.length === 1) {
            insufficientMaterial = true;
        }

        if (pieces.white.length === 2 && pieces.white.includes(3) && pieces.black.length === 2 && pieces.black.includes(13)) {
            if (bishopColor.white === bishopColor.black) {
                insufficientMaterial = true;
            }
        }

        if (pieces.white.length === 1) {
            if (pieces.black.length === 2 && (pieces.black.includes(12) || pieces.black.includes(13))) {
                insufficientMaterial = true;
            }
        } else if (pieces.black.length === 1) {
            if (pieces.white.length === 2 && (pieces.white.includes(2) || pieces.white.includes(3))) {
                insufficientMaterial = true;
            }
        }

        if (insufficientMaterial) {
            const updateGameOver = {
                gameOver: true,
                reason: "Draw due to insufficient material",
                winner: false
            }
            setGameOver(updateGameOver)
        }
    }

    //check for threefold repetition
    function checkForThreefoldRepetition () {
        let counter = 0;
        for (let i = 0; i < positionList.length; i++) {
            if (JSON.stringify(positionList[i].position) === JSON.stringify(position)) {
                counter++;
            } 
        }

        if (counter === 2) {
            const updateGameOver = {
                gameOver: true,
                reason: "Draw due to threefold repetition",
                winner: false
            }
            setGameOver(updateGameOver) 
        }
    }

    //check for 50 move rule
    function checkForFifthyMoveRule () {
        if (fifthyMoveRule === 100) {
            const updateGameOver = {
                gameOver: true,
                reason: "Draw due to 50 move rule",
                winner: false
            }
            setGameOver(updateGameOver)
        }
    }

    //check for stalemate
    function checkForStalemate () {
        let allTiles = [];
        for (let posX = 0; posX < 8; posX++) {
            for (let posY = 0; posY < 8; posY++) {
                if ((playerTurn && position[posY][posX] <= 8 && position[posY][posX] > 0) || (!playerTurn && position[posY][posX] > 8)) {
                    const tiles = getPossibleTiles(position, position[posY][posX], posX, posY, playerTurn)
                    allTiles = allTiles.concat(tiles)
                }
            }
        }
        if (allTiles.length === 0 && playerIsInCheck === false) {
            const updateGameOver = {
                gameOver: true,
                reason: "Draw due to stalemate",
                winner: false
            }
            setGameOver(updateGameOver)
        }
    }

    // ------------------------------------------------------------------------------------------------
    function resetBoard () {

        setPosition(initialPosition)
        setActivePiece(initialActivePiece)
        setLastMove(initialLastMove)
        setCurrentMove(initialLastMove)
        setPawnIsPromoting(initialPawnIsPromoting)
        setPawnCanEnPassant(initialPawnCanEnPassant)
        setCastle(initialCastle)
        setGameOver(initialGameOver)        
        setPlayerNames(initialPlayerNames)
        setHoveredTile(initialHoveredTile)
        setCurrentPosition(initialPosition)

        setPlayerTurn(true)
        setAllowPieceSelection(true)
        setPossibleTiles([])
        setPossibleTilesAfterCheck([])
        setPossibleKingTilesAfterCheck([])
        setPieceIsDragged(false)
        setPlayerIsInCheck(false)
        setFifthyMoveRule(0)
        setPositionList([])
        setMoveList([])
        setGameStatus(false)
        setFoundSavedGame(false)

        //Timer
        pauseTimer()
        setTimerWhite('10:00');
        setTimerBlack('10:00');
        setStartSeconds(600);
        setIncrement(5000);
        setPlayWithTimer(true);
    
        setRemainingTimeWhite(0)
        setRemainingTimeBlack(0)
        setIsFirstStartWhite(true)
        setIsFirstStartBlack(true)
        localStorage.removeItem("game")
    }


    // ------------------------------------------------------------------------------------------------

    //default actions for each move
    useEffect(() => {
        if (isMounted.current) {
            let positionCopy = [];
            for (let i = 0; i < position.length; i++) {
                positionCopy[i] = position[i].slice();
            }

            const updatePositionList = {
                id: positionList.length,
                position: positionCopy,
                tiles: {
                    oldX: lastMove.oldPositionX,
                    oldY: lastMove.oldPositionY,
                    newX: lastMove.newPositionX,
                    newY: lastMove.newPositionY
                },
                timer: {
                    white: timerWhite,
                    black: timerBlack
                }
            }
            setPositionList([...positionList, updatePositionList]);
            setCurrentPosition(positionCopy);

            setPossibleTiles([])
            setPossibleTilesAfterCheck([])
            setPossibleKingTilesAfterCheck([])
            setPlayerIsInCheck(false)

            checkForInsufficientMaterial();
            checkForThreefoldRepetition();
            checkForFifthyMoveRule();
            checkForStalemate();

            const isCheck = checkForCheck(position);

            let check;
            let mate;

            if (isCheck) {
                let player = playerTurn ? "white" : "black"
                check = true;
                setPlayerIsInCheck(player)

                //check for checkmate
                const tiles = getPossibleTilesAfterCheck(player)
                if (tiles.tiles.length === 0 && tiles.tilesKing.length === 0) {
                    
                    let winner = playerIsInCheck === "white" ? "Black" : "White";
                    
                    const updateGameOver = {
                        gameOver: true,
                        reason: `${winner} won by checkmate!`,
                        winner: `${winner} was victorious!`
                    }
                    setGameOver(updateGameOver)
                    mate = true;
                }
            }

            
            //PGN Notation 
            let x = lastMove.newPositionX;
            let y = lastMove.newPositionY;

            let oldPosition = positionList[positionList.length - 1]

            if (oldPosition) {
                oldPosition = oldPosition.position
            }

            if (x === null || y === null) return;

            const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
            const rows = ["a", "b", "c", "d", "e", "f", "g", "h"];
            let piece = konvertPieceIdToLetter(activePiece.piece);
            let move;
            let promotionPiece = konvertPieceIdToLetter(pawnIsPromoting.newPiece)
            let capture;
            let gameStatus; 

            //konvert pieceId to abbreviation
            function konvertPieceIdToLetter (piece) {
                switch (piece) {
                    case 2:
                    case 12: return "N";
                    case 3:
                    case 13: return "B";
                    case 4:
                    case 14: return "R";
                    case 5:
                    case 15: return "Q";
                    case 6:
                    case 16: return "K";
                    default: return null;
                }
            }

            //captures
            if (oldPosition && oldPosition[y][x] !== 0 && !piece) {
                capture = rows[activePiece.positionX] + "x"
            } else if (oldPosition && oldPosition[y][x] !== 0) {
                capture = "x"
            } else {
                capture = ""
            }

            //check or checkmate
            if (check && mate) {
                gameStatus = "#"
            } else if (check) {
                gameStatus = "+"
            } else {
                gameStatus = ""
            }

            //castle
            // console.log(castle)
            if (castle.isCastling) {
                move = castle.isCastling
            } else {
                move = `${piece !== null ? piece : ""}${capture}${rows[x]}${ranks[y]}${pawnIsPromoting.isPromoting ? `=${promotionPiece}` : ""}${gameStatus}`
            }

            const updateMoveList = [
                ...moveList,
                [move]
            ]
            setMoveList(updateMoveList)
        

            //Timer
            pauseTimer()
            if (!mate) startTimer()


            //save to local storage
            if (saveGame) {
                localStorage.setItem("game", JSON.stringify(
                    {
                        position: position,
                        playerTurn: playerTurn,
                        nameWhite: playerNames.white,
                        nameBlack: playerNames.black,
                        moveList: updateMoveList,
                        timer: {
                            playWithTimer: playWithTimer,
                            increment: increment,
                            timeWhite: timerWhite,
                            timeBlack: timerBlack,
                            remainingTimeWhite: remainingTimeWhite,
                            remainingTimeBlack: remainingTimeBlack,
                            isFirstStartBlack: isFirstStartBlack,
                            isFirstStartWhite: isFirstStartWhite
                        },
                        settings: {
                            startAs: startAs,
                            saveGame: saveGame,
                            showTiles: showPossibleTiles,
                            playSound: playSound,
                        }
                    }
                ))
            } else {
                localStorage.removeItem("game")
            }
        }

    }, [playerTurn])


    useEffect(() => {
        if (startAs === "black") {
            setBoardDirection(false)
        } else {
            setBoardDirection(true)   
        }
    }, [startAs])

    useEffect(() => {
        if (startAs === "rotate") {
            if (playerTurn) {
                setBoardDirection(true)
            } else if (!playerTurn) {
                setBoardDirection(false)
            }
        }

    }, [playerTurn])


    useEffect(() => {

        const localGame = JSON.parse(localStorage.getItem("game"))
        const settings = JSON.parse(localStorage.getItem("settings"))

        if (localGame) {
            setFoundSavedGame(true)
            setGameStatus(false)
            setAllowPieceSelection(false)
            setPosition(localGame.position)
            setPlayerTurn(localGame.playerTurn)
            const updatePlayerNames = {
                white: localGame.nameWhite,
                black: localGame.nameBlack
            }
            setPlayerNames(updatePlayerNames)
            setMoveList(localGame.moveList)

            setPlayWithTimer(localGame.timer.playWithTimer)
            setIncrement(localGame.timer.increment)
            setTimerWhite(localGame.timer.timeWhite)
            setTimerBlack(localGame.timer.timeBlack)
            setRemainingTimeWhite(localGame.timer.remainingTimeWhite)
            setRemainingTimeBlack(localGame.timer.remainingTimeBlack)
            setIsFirstStartBlack(localGame.timer.isFirstStartBlack)
            setIsFirstStartWhite(localGame.timer.isFirstStartWhite)

            setStartAs(localGame.settings.startAs)
            setSaveGame(localGame.settings.saveGame)
            setShowPossibleTiles(localGame.settings.showTiles)
            setPlaySound(localGame.settings.playSound)
        }

        //set saved settings
        if (settings) {
            setStartAs(settings.startAs)
            setSaveGame(settings.saveGame)
            setShowPossibleTiles(settings.showPossibleTiles)
            setPlaySound(settings.playSound)
        }
        
    }, [])

    //store settings to local storage
    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify(
            {
                startAs: startAs,
                saveGame: saveGame,
                showPossibleTiles: showPossibleTiles,
                playSound: playSound
            }
        ))
    }, [startAs, saveGame, showPossibleTiles, playSound])

    //check possible moves
    useEffect(() => {
        if (isMounted.current) {
            //set position to current postion when clicked through moves
            if (activePiece.isActive && gameOver.gameOver === false && JSON.stringify(position) !== JSON.stringify(currentPosition)) {
                setPosition(currentPosition)
            }

            if (activePiece.isActive && gameOver.gameOver === false) {
                const tiles = getPossibleTiles(position, activePiece.piece, activePiece.positionX, activePiece.positionY, playerTurn);
                setPossibleTiles(tiles)
            } else {
                setPossibleTiles()
            }
        } else {
            isMounted.current = true;
        }

    }, [activePiece.piece, activePiece.positionX, activePiece.positionY])


    //--------------------------------------------------------------------------------------------------

    //https://www.geeksforgeeks.org/how-to-create-a-countdown-timer-using-reactjs/

    // The state for our timer
    const timerRef = useRef(null);
    const [timerWhite, setTimerWhite] = useState('10:00');
    const [timerBlack, setTimerBlack] = useState('10:00');
    const [startSeconds, setStartSeconds] = useState(600);
    const [increment, setIncrement] = useState(5000);
    const [playWithTimer, setPlayWithTimer] = useState(false);

    const [remainingTimeWhite, setRemainingTimeWhite] = useState(0)
    const [remainingTimeBlack, setRemainingTimeBlack] = useState(0)
    const [isFirstStartWhite, setIsFirstStartWhite] = useState(true)
    const [isFirstStartBlack, setIsFirstStartBlack] = useState(true)

    function startTimer () {

        if (!playWithTimer) return

        let initialTime = new Date();

        if ((playerTurn && isFirstStartWhite) || (!playerTurn && isFirstStartBlack)) {

            initialTime.setSeconds(initialTime.getSeconds() + startSeconds);

            playerTurn ? setIsFirstStartWhite(false) : setIsFirstStartBlack(false);
        }

        if (timerRef.current) clearInterval(timerRef.current);

        let cacheTime = playerTurn ? remainingTimeWhite : remainingTimeBlack;
        let total;

        const id = setInterval(() => {

            cacheTime = cacheTime - 100

            if ((playerTurn && isFirstStartWhite) || (!playerTurn && isFirstStartBlack)) {
                total = Date.parse(initialTime) - Date.parse(new Date());
            } else {
                playerTurn ? setRemainingTimeWhite(cacheTime) : setRemainingTimeBlack(cacheTime)
                total = cacheTime
            }
            const seconds = Math.floor((total / 1000) % 60);
            const minutes = Math.floor((total / 1000 / 60) % 60);

            playerTurn ? setRemainingTimeWhite(total) : setRemainingTimeBlack(total)

            if (total >= 0) {
                if (playerTurn) {
                    setTimerWhite(
                        (minutes > 9 ? minutes : '0' + minutes) + ':'
                        + (seconds > 9 ? seconds : '0' + seconds)
                    )
                } else {
                    setTimerBlack(
                        (minutes > 9 ? minutes : '0' + minutes) + ':'
                        + (seconds > 9 ? seconds : '0' + seconds)
                    )
                }
            } else {
                let winner = playerTurn ? "Black" : "White"
                let loser = playerTurn ? "White" : "Black"
                const updateGameOver = {
                    gameOver: true,
                    reason: `${loser} ran out of time!`,
                    winner: `${winner} was victorious!`
                }
                setGameOver(updateGameOver)
                pauseTimer()
            }
        }, 100)
        timerRef.current = id;

        if (increment > 0) {
            if (!playerTurn && !isFirstStartWhite) {
                setRemainingTimeWhite(prev => prev + increment)
                let total = remainingTimeWhite + increment

                const seconds = Math.floor((total / 1000) % 60);
                const minutes = Math.floor((total / 1000 / 60) % 60);   
                
                setTimerWhite(
                    (minutes > 9 ? minutes : '0' + minutes) + ':'
                    + (seconds > 9 ? seconds : '0' + seconds)
                )
            } else {
                setRemainingTimeBlack(prev => prev + increment)
                let total = remainingTimeBlack + increment
                const seconds = Math.floor((total / 1000) % 60);
                const minutes = Math.floor((total / 1000 / 60) % 60);

                setTimerBlack(
                    (minutes > 9 ? minutes : '0' + minutes) + ':'
                    + (seconds > 9 ? seconds : '0' + seconds)
                )
            }
        }
    }

    function pauseTimer () {
        clearInterval(timerRef.current)
    }

    function setStartTime (time, increment) {
        setPlayWithTimer(true)
        setStartSeconds(time * 60)
        setIncrement(increment * 1000)
        setTimerWhite(`${time}:00`)
        setTimerBlack(`${time}:00`)
    }

    // ------------------------------------------------------------------------------------------------
    //rendering board

    const [tiles, setTiles] = useState({
        tile: [],
        capture: [],
        highlight: [],
        check: [],
        move: [],
        marked: []
    })


    useEffect(() => {

        let tileArr = [];
        let captureArr = [];
        let highlightArr = [];
        let checkArr = [];
        let moveArr = [];
        let markedArr = [];
        
        for (let j = 0; j < 8; j++) { //y
            for (let i = 0; i < 8; i++) { //x
                let piece = undefined;
                let isPossibleMove = false;
                let isPossibleCapture = false;

                let posX = i;
                let posY = j;
                
                //invert coordinates
                if (!boardDirection) {
                    let invertedCords = invertBoardAxis(i, j)
                    posX = invertedCords.invertedX
                    posY = invertedCords.invertedY
                }

                //highlight possible tiles
                if (possibleTiles) {
                    for (let x = 0; x < possibleTiles.length; x++) {
                        if (playerIsInCheck) {
                            if (activePiece.piece === kW || activePiece.piece === kB) {
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
                        } else if (JSON.stringify(possibleTiles[x]) === JSON.stringify([j, i])) {
                            if ((playerTurn && position[j][i] > 8) || (!playerTurn && position[j][i] < 8 && position[j][i] > 0)) {
                                isPossibleCapture = true;
                            } else if (position[j][i] === 0) {
                                isPossibleMove = true;
                            }
                        }
                    }
                }
          

                //highlight active piece and last move
                if ((activePiece.positionX === i && activePiece.positionY === j) || (lastMove.oldPositionX === i && lastMove.oldPositionY === j) || (lastMove.newPositionX === i && lastMove.newPositionY === j)) {
                    let newHighlight = {
                        posX: posX,
                        posY: posY
                    }
                    highlightArr.push(newHighlight)
                }

                //highlight if king is in check
                if ((playerIsInCheck === "white" && position[j][i] === kW) || (playerIsInCheck === "black" && position[j][i] === kB)) {
                    let newCheck = {
                        posX: posX,
                        posY: posY
                    }
                    checkArr.push(newCheck)
                }

                for (let x = 0; x < markedTiles.length; x++) {
                    if (JSON.stringify([i, j]) === JSON.stringify(markedTiles[x])) {
                        let newMark = {
                            posX: posX,
                            posY: posY
                        }
                        markedArr.push(newMark)
                    }
                }


                switch (position[j][i]) {
                    case pW: piece = "wp"; break;
                    case pB: piece = "bp"; break;
                    case knW: piece = "wn"; break;
                    case knB: piece = "bn"; break;
                    case bW: piece = "wb"; break;
                    case bB: piece = "bb"; break;
                    case rW: piece = "wr"; break;
                    case rB: piece = "br"; break;
                    case qW: piece = "wq"; break;
                    case qB: piece = "bq"; break;
                    case kW: piece = "wk"; break;
                    case kB: piece = "bk"; break;
                    default: piece = "empty"; break;
                }


                if (showPossibleTiles && isPossibleMove) {
                    let newMove = {
                        posX: posX,
                        posY: posY
                    }
                    moveArr.push(newMove)
                }

                if (showPossibleTiles && isPossibleCapture) {
                    let newCapture = {
                        posX: posX,
                        posY: posY
                    }
                    captureArr.push(newCapture)
                }

                if (piece !== "empty") {
                    let newTile = {
                        posX: posX,
                        posY: posY,
                        piece: piece
                    }
                    tileArr.push(newTile)
                }
            }
        }

        const updateTiles = {
            tile: tileArr,
            capture: captureArr,
            highlight: highlightArr,
            check: checkArr,
            move: moveArr,
            marked: markedArr
        }
        setTiles(updateTiles)

    }, [position, possibleTiles, markedTiles, boardDirection])

    
    //change player info    
    useEffect(() => {
        if ((playerTurn && startAs === "rotate") || startAs === "white") {
            setPlayerTop("black");
            setPlayerBottom("white");
        } else if ((!playerTurn && startAs === "rotate") || startAs === "black") {
            setPlayerTop("white");
            setPlayerBottom("black");
        }
    }, [startAs, playerTurn])


    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div className={`App ${size}`}>
            <div className='boardContainer'>
                <PlayerInfo key="playerInfo1" playerNames={playerNames} team={playerTop} timerWhite={timerWhite} timerBlack={timerBlack} playWithTimer={playWithTimer} increment={increment} position={position} playerTurn={playerTurn}/>
                <div id="Board" ref={BoardRef} onMouseDown={e => grabPiece(e)} onMouseMove={e => movePiece(e)} onMouseUp={e => dropPiece(e)} style={{width: `${width}px`, height: `${width}px`}}>
                    {startAs === "black" ?
                        <BoardBlack/> 
                    :
                        <BoardWhite/>
                    }

                    {hoveredTile.isHovering && <Tile key={`hovered-${hoveredTile.y}-${hoveredTile.x}`} posX={hoveredTile.x} posY={hoveredTile.y} type="hover"/>}

                    {tiles.move.map((move) => {
                        return <Tile key={`move-${move.posY}-${move.posX}`} posX={move.posX} posY={move.posY} type="move"/>
                    })}

                    {tiles.capture.map((capture) => {
                        return <Tile key={`capture-${capture.posY}-${capture.posX}`} posX={capture.posX} posY={capture.posY} type="capture"/>
                    })}

                    {tiles.marked.map((marked) => {
                        return <Tile key={`highlight-${marked.posY}-${marked.posX}`} posX={marked.posX} posY={marked.posY} type="marked"/>
                    })}

                    {tiles.highlight.map((highlight) => {
                        return <Tile key={`highlight-${highlight.posY}-${highlight.posX}`} posX={highlight.posX} posY={highlight.posY} type="highlight"/>
                    })}

                    {tiles.check.map((check) => {
                        return <Tile key={`check-${check.posY}-${check.posX}`} posX={check.posX} posY={check.posY} type="check"/>
                    })}
                    
                    {tiles.tile.map((tile) => {
                        return <Tile key={`tile-${tile.posY}-${tile.posX}`} posX={tile.posX} posY={tile.posY} piece={tile.piece} type="piece"/>
                        
                    })}
                    {pawnIsPromoting.showPromotionMenu && pawnIsPromoting.posX !== null && <Promotion pawnIsPromoting={pawnIsPromoting} executePromotion={executePromotion} pieceWidth={pieceWidth}/>}
                    {gameOver.gameOver && <GameOver winner={gameOver.winner} reason={gameOver.reason}/>}
                </div>
                <PlayerInfo key="playerInfo2" playerNames={playerNames} team={playerBottom} timerWhite={timerWhite} timerBlack={timerBlack} playWithTimer={playWithTimer} increment={increment} position={position} playerTurn={playerTurn}/>
            </div>
            <GameInfo 
                playerTurn={playerTurn} 
                setPlayerTurn={setPlayerTurn}
                positionList={positionList} 
                setPosition={setPosition} 
                moveList={moveList} 
                setActivePiece={setActivePiece} 
                initialActivePiece={initialActivePiece}
                startTimer={startTimer} 
                pauseTimer={pauseTimer} 
                gameStatus={gameStatus} 
                setGameStatus={setGameStatus} 
                gameOver={gameOver} 
                setGameOver={setGameOver}
                setStartTime={setStartTime} 
                setPlayWithTimer={setPlayWithTimer} 
                playSound={playSound} 
                setPlaySound={setPlaySound} 
                showPossibleTiles={showPossibleTiles} 
                setShowPossibleTiles={setShowPossibleTiles} 
                setPlayerNames={setPlayerNames} 
                saveGame={saveGame} 
                setSaveGame={setSaveGame} 
                foundSavedGame={foundSavedGame} 
                setFoundSavedGame={setFoundSavedGame} 
                resetBoard={resetBoard} 
                setAllowPieceSelection={setAllowPieceSelection}
                setLastMove={setLastMove}
                setPossibleTiles={setPossibleTiles}
                setPossibleTilesAfterCheck={setPossibleTilesAfterCheck} 
                setPossibleKingTilesAfterCheck={setPossibleKingTilesAfterCheck}
                startAs={startAs}
                setStartAs={setStartAs}
                audioMove={audioMove}/> 
            <Info/>
        </div>
    );
}

export default App;