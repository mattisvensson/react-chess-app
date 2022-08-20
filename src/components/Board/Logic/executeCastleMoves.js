import {rW, rB, kW, kB, empty} from '../pieceDeclaration';

function executeCastleMoves (x, y, position, castle, setCastle, activePiece, setPosition) {

    if (activePiece.piece === kW && castle.white.castleShort && x === 6 && y === 7) {
        console.log("1")
        const updatePosition = [...position];
        updatePosition[7][4] = empty;
        updatePosition[7][5] = rW;
        updatePosition[7][6] = kW;
        updatePosition[7][7] = empty;
        setPosition(updatePosition)

        const updateCastle = {
            ...castle,
            white: {
                ...castle.white,
                castleShort: false,
                castleLong: false
            },
            isCastling: "0-0"
        }
        setCastle(updateCastle)
        return true;
    } else if (activePiece.piece === kW && castle.white.castleLong && x === 2 && y === 7) {
        console.log("2")
        const updatePosition = [...position];
        updatePosition[7][4] = empty;
        updatePosition[7][3] = rW;
        updatePosition[7][2] = kW;
        updatePosition[7][1] = empty;
        updatePosition[7][0] = empty;
        setPosition(updatePosition)

        const updateCastle = {
            ...castle,
            white: {
                ...castle.white,
                castleShort: false,
                castleLong: false
            },
            isCastling: "0-0-0"
        }
        setCastle(updateCastle)
        return true;
    } else if (activePiece.piece === kB && castle.black.castleShort && x === 6 && y === 0) {
        console.log("3")
        const updatePosition = [...position];
        updatePosition[0][4] = empty;
        updatePosition[0][5] = rB;
        updatePosition[0][6] = kB;
        updatePosition[0][7] = empty;
        setPosition(updatePosition)

        const updateCastle = {
            ...castle,
            black: {
                ...castle.black,
                castleShort: false,
                castleLong: false
            },
            isCastling: "0-0"
        }
        setCastle(updateCastle)
        return true;
    } else if (activePiece.piece === kB && castle.black.castleLong && x === 2 && y === 0) {
        console.log("4")
        const updatePosition = [...position];
        updatePosition[0][4] = empty;
        updatePosition[0][3] = rB;
        updatePosition[0][2] = kB;
        updatePosition[0][1] = empty;
        updatePosition[0][0] = empty;
        setPosition(updatePosition)

        const updateCastle = {
            ...castle,
            black: {
                ...castle.black,
                castleShort: false,
                castleLong: false
            },
            isCastling: "0-0-0"
        }
        setCastle(updateCastle)
        return true;
    } else {
        // console.log("5")
        const updateCastle = {
            ...castle,
            isCastling: false
        }
        // console.log(updateCastle);
        setCastle(updateCastle)
        return false
    }

}

export default executeCastleMoves;