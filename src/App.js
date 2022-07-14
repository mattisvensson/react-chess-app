import React, {useEffect, useRef, useState} from 'react';

import Info from './components/Info/Info';
import PlayerInfo from './components/PlayerInfo/PlayerInfo';
import GameInfo from './components/GameInfo/GameInfo';

import Tile from './components/Board/Tiles/Tile';
import PossibleMove from './components/Board/Tiles/PossibleMove';
import PossibleCapture from './components/Board/Tiles/PossibleCapture';
import HighlightedTile from './components/Board/Tiles/HighlightedTile';
import CheckedTile from './components/Board/Tiles/CheckedTile';
import HoveredTile from './components/Board/Tiles/HoveredTile';
import Promotion from './components/Board/Promotion/Promotion';
import checkCastleMoves from './components/Board/Logic/checkCastleMoves';
import executeCastleMoves from './components/Board/Logic/executeCastleMoves';
import checkEnPassant from './components/Board/Logic/checkEnPassant';
import GameOver from './components/Board/GameOver/GameOver';

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
//   load/save current game to local storage
//   download game pgn
//   board can rotate after each move
//   "play as" setting
//
//
//   later:
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

    //Initial values
    const initialPosition = [
        [14,12,13,15,16,13,12,14],
        [11,11,11,11,11,11,11,11],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1],
        [4,2,3,5,6,3,2,4],
    ]

    const initialActivePiece = {
        isActive: false,
        piece: null,
        positionX: null,
        positionY: null,
        counter: 0
    }

    const initialLastPiece = ({
        oldPositionX: null,
        oldPositionY: null,
        newPositionX: null,
        newPositionY: null
    })

    const initialPawnIsPromoting = ({
        isPromoting: false,
        color: null,
        posX: null,
        posY: null,
        prevX: null,
        prevY: null,
        capturedPiece: null,
        showPromotionMenu: false,
        newPiece: null,
    });

    const initialPawnCanEnPassant = ({
        isActive: false,
        posX: null,
        posY: null
    })

    const initialCastle = ({
        white: {
            castleLong: true,
            castleShort: true,
        },
        black: {
            castleLong: true,
            castleShort: true
        },
        isCastling: false,
    })
    
    const initialGameOver = {
        gameOver: false,
        reason: undefined,
        winner: undefined
    };

    const initialPieceAdvantage = {
        white: [],
        black: []
    }

    const initialPlayerNames = {
        white: "White",
        black: "Black"
    }

    const initialHoveredTile = {
        isHovering: false,
        x: null,
        y: null
    }

    //States

    const [loading, setLoading] = useState(false)

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
    const [position, setPosition] = useState(initialPosition)

    //Referencing the board
    const BoardRef = useRef(null);

    //Keep track of active piece
    const [activePiece, setActivePiece] = useState(initialActivePiece);

    //keep track of the last move
    const [lastPiece, setLastPiece] = useState(initialLastPiece)

    //saves data about promoting pawn
    const [pawnIsPromoting, setPawnIsPromoting] = useState(initialPawnIsPromoting);

    //saves data of pawn which can be captured en passant
    const [pawnCanEnPassant, setPawnCanEnPassant] = useState(initialPawnCanEnPassant)

    //keep track of castling rights for both sides
    const [castle, setCastle] = useState(initialCastle)

    //true = white's turn
    //false = black's turn
    const [playerTurn, setPlayerTurn] = useState(true);

    const [allowPieceSelection, setAllowPieceSelection] = useState(true)

    //saves possible Tiles for active piece
    const [possibleTiles, setPossibleTiles] = useState([]);

    //save all possible moves when player is in check
    const [possibleTilesAfterCheck, setPossibleTilesAfterCheck] = useState([])
    const [possibleKingTilesAfterCheck, setPossibleKingTilesAfterCheck] = useState([])

    //keep track of if piece is dragged or not
    const [pieceIsDragged, setPieceIsDragged] = useState(false);

    //player is in check
    const [playerIsInCheck, setPlayerIsInCheck] = useState(false);

    //info if game is over
    const [gameOver, setGameOver] = useState(initialGameOver);

    const [fifthyMoveRule, setFifthyMoveRule] = useState(0);
    const [positionList, setPositionList] = useState([]);
    const [moveList, setMoveList] = useState([]);
    const [currentPosition, setCurrentPosition] = useState([]);
    const [gameStatus, setGameStatus] = useState(false)

    const [pieceAdvantage, setPieceAdvantage] = useState(initialPieceAdvantage)

    const [playerNames, setPlayerNames] = useState(initialPlayerNames)

    const [hoveredTile, setHoveredTile] = useState(initialHoveredTile)

    const [foundSavedGame, setFoundSavedGame] = useState(false)

    //Game settings
    const [switchBoard, setSwitchBoard] = useState(false)
    const [saveGame, setSaveGame] = useState(false)
    const [showPossibleTiles, setShowPossibleTiles] = useState(true)
    const [playSound, setPlaySound] = useState(true)

    //-------------------------------------------------------------------------------------
    //moving the piece

    //grabbing the piece
    function grabPiece (e) {

        //get tile on which the piece was standing
        const currentX = Math.floor((e.clientX - BoardRef.current.offsetLeft) / pieceWidth);
        const currentY = Math.floor((e.clientY - BoardRef.current.offsetTop) / pieceWidth);

        exitMove: if (e.target.classList.contains("piece") && allowPieceSelection) {
            
            const updateHover = {
                isHovering: true,
                x: currentX,
                y: currentY
            }
            setHoveredTile(updateHover)

            if (playerIsInCheck) {
                const tiles = getPossibleTilesAfterCheck(playerIsInCheck)
                setPossibleTilesAfterCheck(tiles.tiles)
                setPossibleKingTilesAfterCheck(tiles.tilesKing)
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
            e.target.style.transform = `translate(${mouseX - BoardMinX -(pieceWidth / 2) + "px"}, ${mouseY - BoardMinY -(pieceWidth / 2) + "px"})`;
            e.target.style.zIndex = "10";

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

            if ((playerTurn && position[currentY][currentX] === 1) || (!playerTurn && position[currentY][currentX] === 11)) {
                let updatePromotion = {
                    ...pawnIsPromoting,
                    prevX: currentX,
                    prevY: currentY
                }
                setPawnIsPromoting(updatePromotion)
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

            let posX = mouseX - BoardMinX - (pieceWidth / 2);
            let posY = mouseY - BoardMinY - (pieceWidth / 2);

            if (activePiece.isActive) {  
                
                const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / pieceWidth);
                const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / pieceWidth);
                
                const updateHover = {
                    isHovering: true,
                    x: x,
                    y: y
                }
                setHoveredTile(updateHover)

                //stop piece from following the mouse if mouse is outside of the board
                // if (mouseX < BoardMinX) {posX = BoardMinX - (pieceWidth / 2)}
                // if (mouseX > BoardMaxX) {posX = BoardMinX + BoardWidth - (pieceWidth / 2)}
                // if (mouseY < BoardMinY) {posY = BoardMinY - pieceWidth}
                // if (mouseY > BoardMaxY) {posY = BoardMinY + BoardWidth - (pieceWidth / 2)}

                if (mouseX < BoardMinX || mouseX > BoardMaxX || mouseY < BoardMinY || mouseY > BoardMaxY) {

                    activePiece.isActive.style.transform = null;
                    activePiece.isActive.style.zIndex = null;

                    const updatePiece = {
                        ...activePiece,
                        isActive: false,
                        piece: null,
                        positionX: null,
                        positionY: null,
                        counter: 0
                    }
                    setActivePiece(updatePiece)
                    setPossibleTiles([])
                } else {
                    activePiece.isActive.style.transform = `translate(${posX}px, ${posY}px)`;
                }

                
            }
        }
    }


    //drop piece
    function dropPiece (e) {

        const updateHover = {
            isHovering: false,
            x: null,
            y: null
        }
        setHoveredTile(updateHover)

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
            setPossibleTiles([])
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
                    for (let j = 0; j < possibleTiles.length; j++) {
                        if ((JSON.stringify(possibleTiles[j]) === JSON.stringify(possibleKingTilesAfterCheck[i])) && (JSON.stringify(possibleTiles[j]) === JSON.stringify([y, x]))) {
                            match = true;
                            break;
                        }
                    }
                }
            } else if ((playerTurn && activePiece.piece < 8) || (!playerTurn && activePiece.piece > 8)){
                for (let i = 0; i < possibleTilesAfterCheck.length; i++) {
                    for (let j = 0; j < possibleTiles.length; j++) {
                        if ((JSON.stringify(possibleTiles[j]) === JSON.stringify(possibleTilesAfterCheck[i])) && (JSON.stringify(possibleTiles[j]) === JSON.stringify([y, x]))) {
                            match = true;
                            break;
                        }
                    }
                }
            }
        } else if (possibleTiles) {
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

            if (position[y][x] !== 0 || (playerTurn && activePiece.piece === 1) || (!playerTurn && activePiece.piece === 11)) {
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

                    if (newPosition[y][x] !== 0) {
                        let capturedPiece = newPosition[y][x]
                        if (playerTurn) {
                            const updatePieceAdvantage = {
                                ...pieceAdvantage,
                                white: [...pieceAdvantage.white, capturedPiece]
                            }
                            setPieceAdvantage(updatePieceAdvantage)
                        } else {
                            const updatePieceAdvantage = {
                                ...pieceAdvantage,
                                black: [...pieceAdvantage.black, capturedPiece]
                            }
                            setPieceAdvantage(updatePieceAdvantage)
                        }
                    }

                    newPosition[activePiece.positionY][activePiece.positionX] = 0;
                    newPosition[y][x] = activePiece.piece;
                    setPosition(newPosition);
                }


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

                //check which castle moves are still possible
                checkCastleMoves(position, castle, setCastle)

                //switch player turn
                setPlayerTurn(prev => !prev)
                setPossibleTiles()
            }
        }

        //drop dragged piece
        activePiece.isActive.style.transform = null;
        activePiece.isActive.style.zIndex = null;
        setPieceIsDragged(false)
    }


    //execute pawn promotionm(executed from Promotion.js)
    function executePromotion (piece) {

        if (pawnIsPromoting.color === "black") piece += 10;

        if (piece < 99) {

            //play sound
            playSound && audioMove.play()

            const newPosition = [...position];
            newPosition[pawnIsPromoting.posY][pawnIsPromoting.posX] = piece;
            newPosition[pawnIsPromoting.prevY][pawnIsPromoting.prevX] = 0;
            setPosition(newPosition);

            //highlight last move
            const updateLastPiece = {
                ...lastPiece,
                oldPositionX: pawnIsPromoting.prevX,
                oldPositionY: pawnIsPromoting.prevY,
                newPositionX: pawnIsPromoting.posX,
                newPositionY: pawnIsPromoting.posY
            }
            setLastPiece(updateLastPiece)

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
                positionCopy[posY][posX] = 0;

                //check if new simulated position is still check
                const isCheck = checkForCheck(positionCopy)

                let kingIsNear = false;
                if (piece === 6 || piece === 16) {
                    kingIsNear = isKingNear(positionCopy)
                }

                if (isCheck === false && kingIsNear === false) {
                    validMoves.push(tiles[i])
                }
            }
            return validMoves
        } else {
            return []
        }
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

            for (let posX =  0; posX < 8; posX++) {
                for (let posY = 0; posY < 8; posY++) {

                    let piece = position[posY][posX];

                    if ((simulatedPlayerTurn && piece === 6) || (!simulatedPlayerTurn && piece === 16)) {
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
        switch (piece) {
            //King (white and black)
            case 6:
            case 16:
                if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {
                    const king = kingMove(posX, posY, position, piece, castle, playerIsInCheck)
                    return king;
                }
                break;
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
                    const queen = queenMove(posX, posY, position)
                    return queen;
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
            if (posY + i < 8 && posX + i < 8 && posY + i >= 0 && posX + i >= 0) {
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
            if (posY - i < 8 && posX + i < 8 && posY - i >= 0 && posX + i >= 0) {
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
            if (posY + i < 8 && posX - i < 8 && posY + i >= 0 && posX - i >= 0) {
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


    function queenMove (posX, posY, position) {
        let tiles = []
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
        //bottom right
        for (let i = 1; i < 8; i++) {
            if (posY + i < 8 && posX + i < 8 && posY + i >= 0 && posX + i >= 0) {
                if (position[posY + i][posX + i] === 0) {
                    tiles.push([posY + i, posX + i]);
                } else {
                    tiles.push([posY + i, posX + i]);
                    break
                }
            }
        }
        //top right    
        for (let i = 1; i < 8; i++) {
            if (posY - i < 8 && posX + i < 8 && posY - i >= 0 && posX + i >= 0) {
                if (position[posY - i][posX + i] === 0) {
                    tiles.push([posY - i, posX + i]);
                } else {
                    tiles.push([posY - i, posX + i]);
                    break
                }
            }
        }  
        //bottom left
        for (let i = 1; i < 8; i++) {
            if (posY + i < 8 && posX - i < 8 && posY + i >= 0 && posX - i >= 0) {
                if (position[posY + i][posX - i] === 0) {
                    tiles.push([posY + i, posX - i]);
                } else {
                    tiles.push([posY + i, posX - i]);
                    break
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
                    break
                }
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

    function loadPGN () {
        console.log("loading pgn")
    }

    function createPGN () {
        console.log("creating pgn")
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
                reason: "insufficient material",
                winner: "draw"
            }
            setGameOver(updateGameOver)
        }
    }

    //check for threefold repetition
    function checkForThreefoldRepetition () {
        let counter = 0;
        for (let i = 0; i < positionList.length; i++) {
            if (JSON.stringify(positionList[i]) === JSON.stringify(position)) {
                counter++;
            } 
        }

        if (counter === 2) {
            const updateGameOver = {
                gameOver: true,
                reason: "threefold repetition",
                winner: "draw"
            }
            setGameOver(updateGameOver) 
        }
    }

    //check for 50 move rule
    function checkForFifthyMoveRule () {
        if (fifthyMoveRule === 100) {
            const updateGameOver = {
                gameOver: true,
                reason: "moverule",
                winner: "draw"
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
                reason: "stalemate",
                winner: "draw"
            }
            setGameOver(updateGameOver)
        }
    }

    // ------------------------------------------------------------------------------------------------


    function resetBoard () {

        setPosition(initialPosition)
        setActivePiece(initialActivePiece)
        setLastPiece(initialLastPiece)
        setPawnIsPromoting(initialPawnIsPromoting)
        setPawnCanEnPassant(initialPawnCanEnPassant)
        setCastle(initialCastle)
        setGameOver(initialGameOver)        
        setPieceAdvantage(initialPieceAdvantage)
        setPlayerNames(initialPlayerNames)
        setHoveredTile(initialHoveredTile)


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
        setCurrentPosition([])
        setGameStatus(false)
        setFoundSavedGame(false)
        //Settings
        setSwitchBoard(false)
        setSaveGame(false)
        setShowPossibleTiles(true)
        setPlaySound(true)

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
        let positionCopy = [];
        for (let i = 0; i < position.length; i++) {
            positionCopy[i] = position[i].slice();
        }
        setPositionList([...positionList, positionCopy]);
        setCurrentPosition([positionCopy]);

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
                let winner;
                playerIsInCheck === "white" ? winner = "black" : winner = "white";
                const updateGameOver = {
                    gameOver: true,
                    reason: "checkmate",
                    winner: winner
                }
                setGameOver(updateGameOver)
                mate = true;
            }
        }

        //PGN Notation 
        let x = lastPiece.newPositionX;
        let y = lastPiece.newPositionY;

        let oldPosition = positionList[positionList.length - 1]

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
        if (oldPosition[y][x] !== 0 && !piece) {
            capture = rows[activePiece.positionX] + "x"
        } else if (oldPosition[y][x] !== 0) {
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
        startTimer()


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
                        rotateBoard: switchBoard,
                        saveGame: saveGame,
                        showTiles: showPossibleTiles,
                        playSound: playSound,
                    }
                }
            ))
        } else {
            localStorage.removeItem("game")
        }

    }, [playerTurn])

    useEffect(() => {

        // setLoading(true)

        const localGame = JSON.parse(localStorage.getItem("game"))
        const settings = JSON.parse(localStorage.getItem("settings"))

        if (localGame) {
            console.log(localGame.timer.remainingTimeWhite, localGame.timer.remainingTimeBlack)
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

            setSwitchBoard(localGame.settings.switchBoard)
            setSaveGame(localGame.settings.saveGame)
            setShowPossibleTiles(localGame.settings.showTiles)
            setPlaySound(localGame.settings.playSound)
        }

        //set saved settings
        if (settings) {
            setSwitchBoard(settings.switchBoard)
            setSaveGame(settings.saveGame)
            setShowPossibleTiles(settings.showPossibleTiles)
            setPlaySound(settings.playSound)
        }
        
        // setLoading(false)
    }, [])

    //store settings to local storage
    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify(
            {
                switchBoard: switchBoard,
                saveGame: saveGame,
                showPossibleTiles: showPossibleTiles,
                playSound: playSound
            }
        ))
    }, [switchBoard, saveGame, showPossibleTiles, playSound])

    //check possible moves
    useEffect(() => {
        if (activePiece.isActive && gameOver.gameOver === false) {
            const tiles = getPossibleTiles(position, activePiece.piece, activePiece.positionX, activePiece.positionY, playerTurn);
            setPossibleTiles(tiles)
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
    const [playWithTimer, setPlayWithTimer] = useState(true);

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
                let winner = playerTurn ? "black" : "white"
                const updateGameOver = {
                    gameOver: true,
                    reason: "time",
                    winner: winner
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

    let tile = [];
    let capture = [];
    let highlight = [];
    let check = [];
    let move = [];

    for (let j = 0; j < 8; j++) { //y
        for (let i = 0; i < 8; i++) { //x
            let piece = undefined;
            let isPossibleMove = false;
            let isPossibleCapture = false;
            let isHighlighted = false;
            let isCheck = false;


            //highlight possible Tiles
            if (possibleTiles) {
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
                case 1: piece = "wp"; break;
                case 11: piece = "bp"; break;
                case 2: piece = "wn"; break;
                case 12: piece = "bn"; break;
                case 3: piece = "wb"; break;
                case 13: piece = "bb"; break;
                case 4: piece = "wr"; break;
                case 14: piece = "br"; break;
                case 5: piece = "wq"; break;
                case 15: piece = "bq"; break;
                case 6: piece = "wk"; break;
                case 16: piece = "bk"; break;
                default: piece = "empty"; break;
            }

            let newMove = {
                posX: i,
                posY: j,
                isPossibleMove: isPossibleMove
            }
            showPossibleTiles && move.push(newMove)

            let newCapture = {
                posX: i,
                posY: j,
                isPossibleCapture: isPossibleCapture
            }
            showPossibleTiles && capture.push(newCapture)

            let newHighlight = {
                posX: i,
                posY: j,
                isHighlighted: isHighlighted
            }
            highlight.push(newHighlight)

            let newCheck = {
                posX: i,
                posY: j,
                isCheck: isCheck
            }
            check.push(newCheck)

            let newTile = {
                posX: i,
                posY: j,
                piece: piece
            }
            tile.push(newTile)
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div className={`App ${size}`}>
            <div className='boardContainer'>
                <PlayerInfo key="playerInfo1" playerNames={playerNames} team="black" timerWhite={timerWhite} timerBlack={timerBlack} playWithTimer={playWithTimer} increment={increment} pieceAdvantage={pieceAdvantage} position={position} playerTurn={playerTurn}/>
                <div id="Board" ref={BoardRef} onMouseDown={e => grabPiece(e)} onMouseMove={e => movePiece(e)} onMouseUp={e => dropPiece(e)} style={{width: `${width}px`, height: `${width}px`}}>
                    {switchBoard && !playerTurn ? 
                        <svg version="1.1" x="0px" y="0px" viewBox="0 0 800 800">
                            <g id="tiles">
                                <g id="a8">
                                    <rect fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="b8">
                                    <rect x="100" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="c8">
                                    <rect x="200" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="d8">
                                    <rect x="300" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="e8">
                                    <rect x="400" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="f8">
                                    <rect x="500" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="g8">
                                    <rect x="600" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="h8">
                                    <rect x="700" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="a7">
                                    <rect y="100" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="b7">
                                    <rect x="100" y="100" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="c7">
                                    <rect x="200" y="100" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="d7">
                                    <rect x="300" y="100" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="e7">
                                    <rect x="400" y="100" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="f7">
                                    <rect x="500" y="100" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="g7">
                                    <rect x="600" y="100" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="h7">
                                    <rect x="700" y="100" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="a6">
                                    <rect y="200" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="b6">
                                    <rect x="100" y="200" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="c6">
                                    <rect x="200" y="200" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="d6">
                                    <rect x="300" y="200" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="e6">
                                    <rect x="400" y="200" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="f6">
                                    <rect x="500" y="200" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="g6">
                                    <rect x="600" y="200" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="h6">
                                    <rect x="700" y="200" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="a5">
                                    <rect y="300" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="b5">
                                    <rect x="100" y="300" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="c5">
                                    <rect x="200" y="300" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="d5">
                                    <rect x="300" y="300" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="e5">
                                    <rect x="400" y="300" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="f5">
                                    <rect x="500" y="300" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="g5">
                                    <rect x="600" y="300" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="h5">
                                    <rect x="700" y="300" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="a4">
                                    <rect y="400" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="b4">
                                    <rect x="100" y="400" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="c4">
                                    <rect x="200" y="400" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="d4">
                                    <rect x="300" y="400" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="e4">
                                    <rect x="400" y="400" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="f4">
                                    <rect x="500" y="400" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="g4">
                                    <rect x="600" y="400" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="h4">
                                    <rect x="700" y="400" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="a3">
                                    <rect y="500" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="b3">
                                    <rect x="100" y="500" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="c3">
                                    <rect x="200" y="500" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="d3">
                                    <rect x="300" y="500" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="e3">
                                    <rect x="400" y="500" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="f3">
                                    <rect x="500" y="500" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="g3">
                                    <rect x="600" y="500" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="h3">
                                    <rect x="700" y="500" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="a2">
                                    <rect y="600" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="b2">
                                    <rect x="100" y="600" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="c2">
                                    <rect x="200" y="600" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="d2">
                                    <rect x="300" y="600" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="e2">
                                    <rect x="400" y="600" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="f2">
                                    <rect x="500" y="600" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="g2">
                                    <rect x="600" y="600" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="h2">
                                    <rect x="700" y="600" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="a1">
                                    <rect y="700" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="b1">
                                    <rect x="100" y="700" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="c1">
                                    <rect x="200" y="700" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="d1">
                                    <rect x="300" y="700" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="e1">
                                    <rect x="400" y="700" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="f1">
                                    <rect x="500" y="700" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="g1">
                                    <rect x="600" y="700" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="h1">
                                    <rect x="700" y="700" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                            </g>
                            <g id="legend">
                                <g>
                                    <path fill="#EEEEE2" d="M79.9,770.3h2.5v8.5h0.1c0.4-0.7,1-1.3,1.8-1.7c0.7-0.4,1.6-0.7,2.5-0.7c1.8,0,4.7,1.1,4.7,5.8v8.1H89v-7.8
                                        c0-2.2-0.8-4-3.1-4c-1.6,0-2.9,1.1-3.3,2.5c-0.1,0.3-0.2,0.7-0.2,1.2v8.2h-2.5V770.3z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M8.9,720.5c0-2.3,1.4-3.9,3.6-4.9l0-0.1c-2-1-2.9-2.5-2.9-4.1c0-2.9,2.4-4.8,5.6-4.8c3.5,0,5.3,2.2,5.3,4.5
                                        c0,1.5-0.8,3.2-3,4.3v0.1c2.3,0.9,3.7,2.5,3.7,4.7c0,3.2-2.7,5.3-6.2,5.3C11.2,725.5,8.9,723.2,8.9,720.5z M18.7,720.4
                                        c0-2.2-1.5-3.3-4-4c-2.1,0.6-3.3,2-3.3,3.8c-0.1,1.8,1.3,3.5,3.6,3.5C17.3,723.7,18.7,722.3,18.7,720.4z M11.9,711.3
                                        c0,1.8,1.4,2.8,3.5,3.4c1.6-0.5,2.8-1.7,2.8-3.3c0-1.5-0.9-3-3.1-3C13,708.4,11.9,709.8,11.9,711.3z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M19.5,509.7c-0.5,0-1.1,0-1.8,0.1c-3.9,0.6-5.9,3.5-6.3,6.5h0.1c0.9-1.1,2.4-2.1,4.4-2.1
                                        c3.2,0,5.5,2.3,5.5,5.9c0,3.3-2.3,6.4-6,6.4c-3.9,0-6.4-3-6.4-7.8c0-3.6,1.3-6.4,3.1-8.2c1.5-1.5,3.5-2.4,5.8-2.7
                                        c0.7-0.1,1.3-0.1,1.8-0.1V509.7z M18.8,520.2c0-2.6-1.5-4.2-3.8-4.2c-1.5,0-2.9,0.9-3.5,2.2c-0.2,0.3-0.3,0.6-0.3,1.1
                                        c0.1,3,1.4,5.2,4,5.2C17.4,524.6,18.8,522.8,18.8,520.2z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M16.7,325.2v-5H8.3v-1.6l8.1-11.6H19v11.3h2.5v1.9H19v5H16.7z M16.7,318.3v-6.1c0-1,0-1.9,0.1-2.9h-0.1
                                        c-0.6,1.1-1,1.8-1.5,2.7l-4.5,6.2v0.1H16.7z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M9.1,128.2v-1.5l1.9-1.9c4.6-4.4,6.7-6.8,6.8-9.5c0-1.8-0.9-3.6-3.6-3.6c-1.7,0-3,0.8-3.9,1.5l-0.8-1.7
                                        c1.3-1.1,3.1-1.8,5.2-1.8c3.9,0,5.6,2.7,5.6,5.3c0,3.4-2.4,6.1-6.3,9.8l-1.5,1.3v0.1h8.2v2H9.1z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M14.5,9.3L14.5,9.3L11.2,11l-0.5-1.9l4-2.1h2.1v18.2h-2.4V9.3z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M9.7,222.3c0.7,0.4,2.3,1.1,4,1.1c3.2,0,4.1-2,4.1-3.5c0-2.5-2.3-3.6-4.7-3.6h-1.4v-1.8h1.4
                                        c1.8,0,4.1-0.9,4.1-3.1c0-1.5-0.9-2.7-3.2-2.7c-1.5,0-2.9,0.6-3.6,1.2l-0.6-1.8c1-0.7,2.8-1.4,4.8-1.4c3.6,0,5.2,2.1,5.2,4.3
                                        c0,1.9-1.1,3.5-3.4,4.3v0.1c2.2,0.4,4.1,2.1,4.1,4.7c0,2.9-2.3,5.5-6.6,5.5c-2,0-3.8-0.6-4.7-1.2L9.7,222.3z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M20,409H13l-0.7,4.7c0.4-0.1,0.8-0.1,1.5-0.1c1.4,0,2.8,0.3,3.9,1c1.4,0.8,2.6,2.4,2.6,4.7
                                        c0,3.6-2.8,6.2-6.8,6.2c-2,0-3.7-0.6-4.5-1.1l0.6-1.9c0.8,0.4,2.2,1,3.9,1c2.3,0,4.3-1.5,4.3-3.9c0-2.4-1.6-4-5.2-4
                                        c-1,0-1.8,0.1-2.5,0.2l1.2-8.7H20V409z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M20.9,609v1.6L13,627.2h-2.5l7.9-16.1V611H9.4v-2H20.9z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M188.6,776.6c-0.1,1-0.1,2.1-0.1,3.7v7.9c0,3.1-0.6,5-1.9,6.2c-1.3,1.2-3.2,1.6-4.9,1.6
                                        c-1.6,0-3.4-0.4-4.5-1.1l0.6-1.9c0.9,0.6,2.3,1.1,4,1.1c2.5,0,4.4-1.3,4.4-4.7v-1.5H186c-0.8,1.3-2.2,2.3-4.3,2.3
                                        c-3.4,0-5.8-2.9-5.8-6.6c0-4.6,3-7.2,6.1-7.2c2.4,0,3.6,1.2,4.2,2.4h0.1l0.1-2H188.6z M186,782c0-0.4,0-0.8-0.1-1.1
                                        c-0.4-1.4-1.7-2.6-3.4-2.6c-2.4,0-4,2-4,5.1c0,2.7,1.3,4.9,4,4.9c1.5,0,2.9-1,3.4-2.5c0.1-0.4,0.2-0.9,0.2-1.3V782z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M379.3,783.8c0.1,3.3,2.2,4.7,4.6,4.7c1.8,0,2.8-0.3,3.8-0.7l0.4,1.8c-0.9,0.4-2.4,0.8-4.5,0.8
                                        c-4.2,0-6.7-2.7-6.7-6.8c0-4.1,2.4-7.3,6.4-7.3c4.4,0,5.6,3.9,5.6,6.4c0,0.5-0.1,0.9-0.1,1.1H379.3z M386.5,782.1
                                        c0-1.6-0.6-4-3.4-4c-2.5,0-3.6,2.3-3.8,4H386.5z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M591.6,789.7c-0.6,0.3-2.1,0.8-3.9,0.8c-4.1,0-6.7-2.8-6.7-6.9c0-4.2,2.9-7.2,7.3-7.2c1.5,0,2.7,0.4,3.4,0.7
                                        l-0.6,1.9c-0.6-0.3-1.5-0.6-2.9-0.6c-3.1,0-4.8,2.3-4.8,5.1c0,3.1,2,5.1,4.7,5.1c1.4,0,2.3-0.4,3-0.7L591.6,789.7z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M787.4,790.2l-0.2-1.7h-0.1c-0.8,1.1-2.2,2-4.1,2c-2.7,0-4.1-1.9-4.1-3.9c0-3.3,2.9-5.1,8.1-5v-0.3
                                        c0-1.1-0.3-3.1-3.1-3.1c-1.3,0-2.6,0.4-3.5,1l-0.6-1.6c1.1-0.7,2.7-1.2,4.5-1.2c4.1,0,5.2,2.8,5.2,5.5v5.1c0,1.2,0.1,2.3,0.2,3.2
                                        H787.4z M787,783.3c-2.7-0.1-5.7,0.4-5.7,3.1c0,1.6,1.1,2.4,2.3,2.4c1.8,0,2.9-1.1,3.3-2.3c0.1-0.3,0.1-0.5,0.1-0.8V783.3z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M281.1,790.2v-11.7h-1.9v-1.9h1.9V776c0-1.9,0.4-3.6,1.6-4.7c0.9-0.9,2.2-1.3,3.3-1.3c0.9,0,1.6,0.2,2.1,0.4
                                        l-0.3,1.9c-0.4-0.2-0.9-0.3-1.6-0.3c-2.1,0-2.6,1.8-2.6,3.9v0.7h3.3v1.9h-3.3v11.7H281.1z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M490.6,770.3v16.4c0,1.2,0,2.6,0.1,3.5h-2.2l-0.1-2.4h-0.1c-0.8,1.5-2.4,2.7-4.6,2.7c-3.3,0-5.8-2.8-5.8-6.9
                                        c0-4.5,2.8-7.3,6.1-7.3c2.1,0,3.5,1,4.1,2.1h0.1v-8.1H490.6z M488.1,782.1c0-0.3,0-0.7-0.1-1c-0.4-1.6-1.7-2.9-3.6-2.9
                                        c-2.5,0-4.1,2.2-4.1,5.2c0,2.7,1.3,5,4,5c1.7,0,3.2-1.1,3.6-2.9c0.1-0.3,0.1-0.7,0.1-1.1V782.1z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M678.8,790.2c0.1-0.9,0.1-2.3,0.1-3.5v-16.4h2.4v8.5h0.1c0.9-1.5,2.4-2.5,4.6-2.5c3.4,0,5.7,2.8,5.7,6.9
                                        c0,4.8-3.1,7.3-6.1,7.3c-2,0-3.5-0.8-4.5-2.5H681l-0.1,2.2H678.8z M681.3,784.7c0,0.3,0.1,0.6,0.1,0.9c0.5,1.7,1.9,2.9,3.7,2.9
                                        c2.6,0,4.1-2.1,4.1-5.2c0-2.7-1.4-5-4-5c-1.7,0-3.2,1.1-3.8,3c-0.1,0.3-0.1,0.6-0.1,1V784.7z"/>
                                </g>
                            </g>
                        </svg>
                    :
                        <svg version="1.1" x="0px" y="0px" viewBox="0 0 800 800">
                            <g id="tiles">
                                <g id="a8">
                                    <rect fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="b8">
                                    <rect x="100" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="c8">
                                    <rect x="200" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="d8">
                                    <rect x="300" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="e8">
                                    <rect x="400" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="f8">
                                    <rect x="500" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="g8">
                                    <rect x="600" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="h8">
                                    <rect x="700" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="a7">
                                    <rect y="100" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="b7">
                                    <rect x="100" y="100" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="c7">
                                    <rect x="200" y="100" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="d7">
                                    <rect x="300" y="100" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="e7">
                                    <rect x="400" y="100" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="f7">
                                    <rect x="500" y="100" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="g7">
                                    <rect x="600" y="100" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="h7">
                                    <rect x="700" y="100" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="a6">
                                    <rect y="200" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="b6">
                                    <rect x="100" y="200" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="c6">
                                    <rect x="200" y="200" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="d6">
                                    <rect x="300" y="200" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="e6">
                                    <rect x="400" y="200" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="f6">
                                    <rect x="500" y="200" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="g6">
                                    <rect x="600" y="200" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="h6">
                                    <rect x="700" y="200" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="a5">
                                    <rect y="300" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="b5">
                                    <rect x="100" y="300" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="c5">
                                    <rect x="200" y="300" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="d5">
                                    <rect x="300" y="300" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="e5">
                                    <rect x="400" y="300" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="f5">
                                    <rect x="500" y="300" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="g5">
                                    <rect x="600" y="300" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="h5">
                                    <rect x="700" y="300" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="a4">
                                    <rect y="400" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="b4">
                                    <rect x="100" y="400" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="c4">
                                    <rect x="200" y="400" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="d4">
                                    <rect x="300" y="400" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="e4">
                                    <rect x="400" y="400" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="f4">
                                    <rect x="500" y="400" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="g4">
                                    <rect x="600" y="400" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="h4">
                                    <rect x="700" y="400" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="a3">
                                    <rect y="500" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="b3">
                                    <rect x="100" y="500" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="c3">
                                    <rect x="200" y="500" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="d3">
                                    <rect x="300" y="500" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="e3">
                                    <rect x="400" y="500" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="f3">
                                    <rect x="500" y="500" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="g3">
                                    <rect x="600" y="500" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="h3">
                                    <rect x="700" y="500" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="a2">
                                    <rect y="600" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="b2">
                                    <rect x="100" y="600" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="c2">
                                    <rect x="200" y="600" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="d2">
                                    <rect x="300" y="600" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="e2">
                                    <rect x="400" y="600" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="f2">
                                    <rect x="500" y="600" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="g2">
                                    <rect x="600" y="600" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="h2">
                                    <rect x="700" y="600" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="a1">
                                    <rect y="700" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="b1">
                                    <rect x="100" y="700" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="c1">
                                    <rect x="200" y="700" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="d1">
                                    <rect x="300" y="700" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="e1">
                                    <rect x="400" y="700" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="f1">
                                    <rect x="500" y="700" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                                <g id="g1">
                                    <rect x="600" y="700" fill="#769656" width="100" height="100"/>
                                </g>
                                <g id="h1">
                                    <rect x="700" y="700" fill="#EEEEE2" width="100" height="100"/>
                                </g>
                            </g>
                            <g id="legend">
                                <g>
                                    <path fill="#EEEEE2" d="M87.4,790.2l-0.2-1.7h-0.1c-0.8,1.1-2.2,2-4.1,2c-2.7,0-4.1-1.9-4.1-3.9c0-3.3,2.9-5.1,8.1-5v-0.3
                                        c0-1.1-0.3-3.1-3.1-3.1c-1.3,0-2.6,0.4-3.5,1l-0.6-1.6c1.1-0.7,2.7-1.2,4.5-1.2c4.1,0,5.2,2.8,5.2,5.5v5.1c0,1.2,0.1,2.3,0.2,3.2
                                        H87.4z M87,783.3c-2.7-0.1-5.7,0.4-5.7,3.1c0,1.6,1.1,2.4,2.3,2.4c1.8,0,2.9-1.1,3.3-2.3c0.1-0.3,0.1-0.5,0.1-0.8V783.3z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M14.5,709.3L14.5,709.3l-3.2,1.7l-0.5-1.9l4-2.1h2.1v18.2h-2.4V709.3z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M9.7,523.3c0.7,0.4,2.3,1.1,4,1.1c3.2,0,4.1-2,4.1-3.5c0-2.5-2.3-3.6-4.7-3.6h-1.4v-1.8h1.4
                                        c1.8,0,4.1-0.9,4.1-3.1c0-1.5-0.9-2.7-3.2-2.7c-1.5,0-2.9,0.6-3.6,1.2l-0.6-1.8c1-0.7,2.8-1.4,4.8-1.4c3.6,0,5.2,2.1,5.2,4.3
                                        c0,1.9-1.1,3.5-3.4,4.3v0.1c2.2,0.4,4.1,2.1,4.1,4.7c0,2.9-2.3,5.5-6.6,5.5c-2,0-3.8-0.6-4.7-1.2L9.7,523.3z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M20,309H13l-0.7,4.7c0.4-0.1,0.8-0.1,1.5-0.1c1.4,0,2.8,0.3,3.9,1c1.4,0.8,2.6,2.4,2.6,4.7
                                        c0,3.6-2.8,6.2-6.8,6.2c-2,0-3.7-0.6-4.5-1.1l0.6-1.9c0.8,0.4,2.2,1,3.9,1c2.3,0,4.3-1.5,4.3-3.9c0-2.4-1.6-4-5.2-4
                                        c-1,0-1.8,0.1-2.5,0.2l1.2-8.7H20V309z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M20.9,110v1.6L13,128.2h-2.5l7.9-16.1V112H9.4v-2H20.9z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M8.9,20.5c0-2.3,1.4-3.9,3.6-4.9l0-0.1c-2-1-2.9-2.5-2.9-4.1c0-2.9,2.4-4.8,5.6-4.8c3.5,0,5.3,2.2,5.3,4.5
                                        c0,1.5-0.8,3.2-3,4.3v0.1c2.3,0.9,3.7,2.5,3.7,4.7c0,3.2-2.7,5.3-6.2,5.3C11.2,25.5,8.9,23.2,8.9,20.5z M18.7,20.4
                                        c0-2.2-1.5-3.3-4-4c-2.1,0.6-3.3,2-3.3,3.8c-0.1,1.8,1.3,3.5,3.6,3.5C17.3,23.7,18.7,22.3,18.7,20.4z M11.9,11.3
                                        c0,1.8,1.4,2.8,3.5,3.4c1.6-0.5,2.8-1.7,2.8-3.3c0-1.5-0.9-3-3.1-3C13,8.4,11.9,9.8,11.9,11.3z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M19.5,208.7c-0.5,0-1.1,0-1.8,0.1c-3.9,0.6-5.9,3.5-6.3,6.5h0.1c0.9-1.1,2.4-2.1,4.4-2.1
                                        c3.2,0,5.5,2.3,5.5,5.9c0,3.3-2.3,6.4-6,6.4c-3.9,0-6.4-3-6.4-7.8c0-3.6,1.3-6.4,3.1-8.2c1.5-1.5,3.5-2.4,5.8-2.7
                                        c0.7-0.1,1.3-0.1,1.8-0.1V208.7z M18.8,219.2c0-2.6-1.5-4.2-3.8-4.2c-1.5,0-2.9,0.9-3.5,2.2c-0.2,0.3-0.3,0.6-0.3,1.1
                                        c0.1,3,1.4,5.2,4,5.2C17.4,223.6,18.8,221.8,18.8,219.2z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M16.7,425.2v-5H8.3v-1.6l8.1-11.6H19v11.3h2.5v1.9H19v5H16.7z M16.7,418.3v-6.1c0-1,0-1.9,0.1-2.9h-0.1
                                        c-0.6,1.1-1,1.8-1.5,2.7l-4.5,6.2v0.1H16.7z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M9.1,627.2v-1.5l1.9-1.9c4.6-4.4,6.7-6.8,6.8-9.5c0-1.8-0.9-3.6-3.6-3.6c-1.7,0-3,0.8-3.9,1.5l-0.8-1.7
                                        c1.3-1.1,3.1-1.8,5.2-1.8c3.9,0,5.6,2.7,5.6,5.3c0,3.4-2.4,6.1-6.3,9.8l-1.5,1.3v0.1h8.2v2H9.1z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M176.8,790.2c0.1-0.9,0.1-2.3,0.1-3.5v-16.4h2.4v8.5h0.1c0.9-1.5,2.4-2.5,4.6-2.5c3.4,0,5.7,2.8,5.7,6.9
                                        c0,4.8-3.1,7.3-6.1,7.3c-2,0-3.5-0.8-4.5-2.5H179l-0.1,2.2H176.8z M179.3,784.7c0,0.3,0.1,0.6,0.1,0.9c0.5,1.7,1.9,2.9,3.7,2.9
                                        c2.6,0,4.1-2.1,4.1-5.2c0-2.7-1.4-5-4-5c-1.7,0-3.2,1.1-3.8,3c-0.1,0.3-0.1,0.6-0.1,1V784.7z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M389.6,770.3v16.4c0,1.2,0,2.6,0.1,3.5h-2.2l-0.1-2.4h-0.1c-0.8,1.5-2.4,2.7-4.6,2.7c-3.3,0-5.8-2.8-5.8-6.9
                                        c0-4.5,2.8-7.3,6.1-7.3c2.1,0,3.5,1,4.1,2.1h0.1v-8.1H389.6z M387.1,782.1c0-0.3,0-0.7-0.1-1c-0.4-1.6-1.7-2.9-3.6-2.9
                                        c-2.5,0-4.1,2.2-4.1,5.2c0,2.7,1.3,5,4,5c1.7,0,3.2-1.1,3.6-2.9c0.1-0.3,0.1-0.7,0.1-1.1V782.1z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M586.1,790.2v-11.7h-1.9v-1.9h1.9V776c0-1.9,0.4-3.6,1.6-4.7c0.9-0.9,2.2-1.3,3.3-1.3c0.9,0,1.6,0.2,2.1,0.4
                                        l-0.3,1.9c-0.4-0.2-0.9-0.3-1.6-0.3c-2.1,0-2.6,1.8-2.6,3.9v0.7h3.3v1.9h-3.3v11.7H586.1z"/>
                                </g>
                                <g>
                                    <path fill="#769656" d="M779.9,770.3h2.5v8.5h0.1c0.4-0.7,1-1.3,1.8-1.7c0.7-0.4,1.6-0.7,2.5-0.7c1.8,0,4.7,1.1,4.7,5.8v8.1H789v-7.8
                                        c0-2.2-0.8-4-3.1-4c-1.6,0-2.9,1.1-3.3,2.5c-0.1,0.3-0.2,0.7-0.2,1.2v8.2h-2.5V770.3z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M290.6,789.7c-0.6,0.3-2.1,0.8-3.9,0.8c-4.1,0-6.7-2.8-6.7-6.9c0-4.2,2.9-7.2,7.3-7.2c1.5,0,2.7,0.4,3.4,0.7
                                        l-0.6,1.9c-0.6-0.3-1.5-0.6-2.9-0.6c-3.1,0-4.8,2.3-4.8,5.1c0,3.1,2,5.1,4.7,5.1c1.4,0,2.3-0.4,3-0.7L290.6,789.7z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M480.3,783.8c0.1,3.3,2.2,4.7,4.6,4.7c1.8,0,2.8-0.3,3.8-0.7l0.4,1.8c-0.9,0.4-2.4,0.8-4.5,0.8
                                        c-4.2,0-6.7-2.7-6.7-6.8c0-4.1,2.4-7.3,6.4-7.3c4.4,0,5.6,3.9,5.6,6.4c0,0.5-0.1,0.9-0.1,1.1H480.3z M487.5,782.1
                                        c0-1.6-0.6-4-3.4-4c-2.5,0-3.6,2.3-3.8,4H487.5z"/>
                                </g>
                                <g>
                                    <path fill="#EEEEE2" d="M690.6,776.6c-0.1,1-0.1,2.1-0.1,3.7v7.9c0,3.1-0.6,5-1.9,6.2c-1.3,1.2-3.2,1.6-4.9,1.6
                                        c-1.6,0-3.4-0.4-4.5-1.1l0.6-1.9c0.9,0.6,2.3,1.1,4,1.1c2.5,0,4.4-1.3,4.4-4.7v-1.5H688c-0.8,1.3-2.2,2.3-4.3,2.3
                                        c-3.4,0-5.8-2.9-5.8-6.6c0-4.6,3-7.2,6.1-7.2c2.4,0,3.6,1.2,4.2,2.4h0.1l0.1-2H690.6z M688,782c0-0.4,0-0.8-0.1-1.1
                                        c-0.4-1.4-1.7-2.6-3.4-2.6c-2.4,0-4,2-4,5.1c0,2.7,1.3,4.9,4,4.9c1.5,0,2.9-1,3.4-2.5c0.1-0.4,0.2-0.9,0.2-1.3V782z"/>
                                </g>
                            </g>
                        </svg>
                    }

                    {hoveredTile.isHovering && <HoveredTile key={`hovered-${hoveredTile.y}-${hoveredTile.x}`} posX={hoveredTile.x} posY={hoveredTile.y}/>}

                    {move.map((move) => {
                        if (move.isPossibleMove) 
                        return <PossibleMove key={`move-${move.posY}-${move.posX}`} posX={move.posX} posY={move.posY} isPossibleMove={move.isPossibleMove}/>
                    })}

                    {capture.map((capture) => {
                        if (capture.isPossibleCapture)
                        return <PossibleCapture key={`capture-${capture.posY}-${capture.posX}`} posX={capture.posX} posY={capture.posY} isPossibleCapture={capture.isPossibleCapture}/>
                    })}

                    {highlight.map((highlight) => {
                        if (highlight.isHighlighted)
                        return <HighlightedTile key={`highlight-${highlight.posY}-${highlight.posX}`} posX={highlight.posX} posY={highlight.posY} isHighlighted={highlight.isHighlighted}/>
                    })}

                    {check.map((check) => {
                        if (check.isCheck)
                        return <CheckedTile key={`check-${check.posY}-${check.posX}`} posX={check.posX} posY={check.posY} isCheck={check.isCheck}/>
                    })}
                    
                    {tile.map((tile) => {
                        if (tile.piece !== "empty")
                        return <Tile key={`tile-${tile.posY}-${tile.posX}`} posX={tile.posX} posY={tile.posY} piece={tile.piece}/>
                        
                    })}
                    {pawnIsPromoting.showPromotionMenu && pawnIsPromoting.posX !== null && <Promotion pawnIsPromoting={pawnIsPromoting} executePromotion={executePromotion} pieceWidth={pieceWidth}/>}
                    {gameOver.gameOver && <GameOver winner={gameOver.winner} reason={gameOver.reason}/>}
                </div>
                <PlayerInfo key="playerInfo2" playerNames={playerNames} team="white" switchBoard={switchBoard} timerWhite={timerWhite} timerBlack={timerBlack} playWithTimer={playWithTimer} increment={increment} pieceAdvantage={pieceAdvantage} position={position} playerTurn={playerTurn}/>
            </div>
            <GameInfo 
                playerTurn={playerTurn} 
                positionList={positionList} 
                setPosition={setPosition} 
                moveList={moveList} 
                setActivePiece={setActivePiece} 
                startTimer={startTimer} 
                pauseTimer={pauseTimer} 
                gameStatus={gameStatus} 
                setGameStatus={setGameStatus} 
                gameOver={gameOver} 
                setGameOver={setGameOver}
                setStartTime={setStartTime} 
                setPlayWithTimer={setPlayWithTimer}
                switchBoard={switchBoard} 
                setSwitchBoard={setSwitchBoard} 
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
                setAllowPieceSelection={setAllowPieceSelection}/>  
            <Info/>
        </div>
    );
}

export default App;