import React, {useEffect, useRef, useState} from 'react';
import './Board.css';
import Tile from './Tile/Tile';
import Promotion from './Promotion/Promotion'
import resetBoard from '../Logic/resetBoard';
import checkCastleMoves from '../Logic/checkCastleMoves';
import checkEnPassant from '../Logic/checkEnPassant';
import GameOver from '../Board/GameOver/GameOver';

// TODO

// stalemate

// X = completed

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
//
//   add time for players
//   add material advantage for players
//   add sound effects
//   custom board position generator
//   game recording
//    -> able to click thorugh moves/game
//   timer
//   connect to chess api
//    -> play with bots
//    -> get openings
//    -> puzzles

//responsive board size
let width = window.innerHeight / 1.2;
let pieceWidth = width / 8;

function Board() {

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

    //saves data about promoting pawn
    const [pawnIsPromoting, setPawnIsPromoting] = useState({
        isPromoting: false,
        color: null,
        posX: null,
        posY: null,
        prevX: null,
        prevY: null,
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
    const [gameOver, setGameOver] = useState({
        gameOver: false,
        reason: undefined,
        winner: undefined
    });

    const [fifthyMoveRule, setFifthyMoveRule] = useState(0);
    const [positionList, setPositionList] = useState([])


    //-------------------------------------------------------------------------------------
    //moving the piece

    //grabbing the piece
    function grabPiece (e) {

        //get tile on which the piece was standing
        const currentX = Math.floor((e.clientX - BoardRef.current.offsetLeft) / pieceWidth);
        const currentY = Math.floor((e.clientY - BoardRef.current.offsetTop) / pieceWidth);

        exitMove: if (e.target.classList.contains("piece")) {
            if (playerIsInCheck) {
                const tiles = getPossibleTilesAfterCheck()
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

            if (position[y][x] !== 0 || (playerTurn && activePiece.piece === 1) || (!playerTurn && activePiece.piece === 11)) {
                setFifthyMoveRule(0)
            } else {
                setFifthyMoveRule(prev => prev + 1)
            }

            //if pawn is promoting, set coordinates for promotion and display promotion menu
            if (savePromotion.isPromoting) {
                const updatePromotion = {
                    ...pawnIsPromoting,
                    isPromoting: true,
                    color: savePromotion.color,
                    posX: x,
                    posY: y,
                    capturedPiece: position[y][x]
                }
                setPawnIsPromoting(updatePromotion)
                setAllowPieceSelection(false)
            } else {
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

        if (pieceId < 99) {
            const newPosition = [...position];
            newPosition[pawnIsPromoting.posY][pawnIsPromoting.posX] = pieceId;
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

            setPlayerTurn(prev => !prev)
        }

        const updatePromotion = {
            ...pawnIsPromoting,
            isPromoting: false,
            color: null,
            posX: null,
            posY: null,
            prevX: null,
            prevY: null,
            capturedPiece: null
        }
        setPawnIsPromoting(updatePromotion)
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

                //check if pice can move or is pinned
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

            //remove tile if its white turn und on the tile is a white piece (same for black)
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
    function getPossibleTilesAfterCheck () {

        let possibleMoves;
        let king;

        let tiles = [];
        let tilesKing = [];

        const allTiles = getAllPossibleTiles(position)

        if (playerIsInCheck === "white") {
            king = 6;
            possibleMoves = allTiles.tilesWhite.tiles;
        } else if (playerIsInCheck === "black") {
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


    //default actions for each move
    useEffect(() => {
        let positionCopy = [];
        for (let i = 0; i < position.length; i++) {
            positionCopy[i] = position[i].slice();
        }
        setPositionList([...positionList, positionCopy]);

        setPossibleTiles([])
        setPossibleTilesAfterCheck([])
        setPossibleKingTilesAfterCheck([])
        setPlayerIsInCheck(false)

        checkForInsufficientMaterial();
        checkForThreefoldRepetition();
        checkForFifthyMoveRule();
        checkForStalemate();

        const isCheck = checkForCheck(position);

        if (playerTurn && isCheck) {
            setPlayerIsInCheck("white")
        } else if (!playerTurn && isCheck){
            setPlayerIsInCheck("black")
        }
    }, [playerTurn])


    //check possible moves
    useEffect(() => {
        if (activePiece.isActive && allowPieceSelection &&gameOver.gameOver === false) {
            const tiles = getPossibleTiles(position, activePiece.piece, activePiece.positionX, activePiece.positionY, playerTurn);
            setPossibleTiles(tiles)
        }
    }, [activePiece.piece, activePiece.positionX, activePiece.positionY])


    //check for checkmate
    useEffect(() => {
        if (playerIsInCheck) {
            const tiles = getPossibleTilesAfterCheck()
            if (tiles.tiles.length === 0 && tiles.tilesKing.length === 0) {
                let winner;
                playerIsInCheck === "white" ? winner = "black" : winner = "white";
                const updateGameOver = {
                    gameOver: true,
                    reason: "checkmate",
                    winner: winner
                }
                setGameOver(updateGameOver)
            }
        }
    }, [playerIsInCheck])


    // ------------------------------------------------------------------------------------------------
    //rendering board

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

            board.push(<Tile key={`${j}, ${i}`} posX={posX} posY={posY} image={`./assets/images/pieces/${image}.png`} isPossibleMove={isPossibleMove} isPossibleCapture={isPossibleCapture} isHighlighted={isHighlighted} isCheck={isCheck} checkColor={checkColor} color={color} width={width}/>)
        }
    }

    return (
        <>
            <div id="Board" ref={BoardRef} onMouseDown={e => grabPiece(e)} onMouseMove={e => movePiece(e)} onMouseUp={e => dropPiece(e)} style={{backgroundImage: `url(./assets/images/chessboard_white.svg)`, gridTemplateColumns: `repeat(8, ${width / 8}px`, gridTemplateRows: `repeat(8, ${width/ 8}px`}}>
                {board}
                {pawnIsPromoting.isPromoting && pawnIsPromoting.posX !== null ? <Promotion key="promotion" pawnIsPromoting={pawnIsPromoting} executePromotion={executePromotion} pieceWidth={pieceWidth}/> : null}
                {gameOver.gameOver ? <GameOver winner={gameOver.winner} reason={gameOver.reason}/> : null}
            </div>
            <button onClick={e => resetBoard(setPosition, activePiece, setActivePiece, lastPiece, setLastPiece, setPossibleTiles, setPlayerTurn, setCastle, setPlayerIsInCheck, setGameOver, setPositionList)}>Reset Board</button>
        </>
    );
}

export default Board;