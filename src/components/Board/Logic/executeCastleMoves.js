import {rW, rB, kW, kB, empty} from '../pieceDeclaration';

function executeCastleMoves (x, y, position, castle, setCastle, activePiece, setPosition, setLastGamePosition, setCastleNotation) {

    let isCastling = castle.isCastling;
    let updatePosition;

    if (activePiece.piece !== 6 && activePiece.piece !== 16) {
        isCastling = false
        setCastleNotation(isCastling)
        return false
    } 

    if (activePiece.piece === kW && castle.white.castleShort && x === 6 && y === 7) {
        updatePosition = [...position];
        updatePosition[7][4] = empty;
        updatePosition[7][5] = rW;
        updatePosition[7][6] = kW;
        updatePosition[7][7] = empty;
        isCastling = "0-0";
    } else if (activePiece.piece === kW && castle.white.castleLong && x === 2 && y === 7) {
        updatePosition = [...position];
        updatePosition[7][4] = empty;
        updatePosition[7][3] = rW;
        updatePosition[7][2] = kW;
        updatePosition[7][1] = empty;
        updatePosition[7][0] = empty;
        isCastling = "0-0-0";
    } else if (activePiece.piece === kB && castle.black.castleShort && x === 6 && y === 0) {
        updatePosition = [...position];
        updatePosition[0][4] = empty;
        updatePosition[0][5] = rB;
        updatePosition[0][6] = kB;
        updatePosition[0][7] = empty;
        isCastling = "0-0";
    } else if (activePiece.piece === kB && castle.black.castleLong && x === 2 && y === 0) {
        updatePosition = [...position];
        updatePosition[0][4] = empty;
        updatePosition[0][3] = rB;
        updatePosition[0][2] = kB;
        updatePosition[0][1] = empty;
        updatePosition[0][0] = empty;
        isCastling = "0-0-0";
    } else {
        isCastling = false;
    }

    if (updatePosition) {
        setPosition(updatePosition)
        setLastGamePosition(updatePosition)
    }
    setCastleNotation(isCastling)
    if (!isCastling) return false
}

export default executeCastleMoves;