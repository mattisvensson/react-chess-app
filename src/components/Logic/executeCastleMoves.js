function executeCastleMoves (x, y, position, castle, setCastle, activePiece, setPosition) {

    if (activePiece.piece === 6 && castle.white.castleShort && x === 6 && y === 7) {
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
                castleLong: false
            },
            isCastling: "0-0",
        }
        setCastle(updateCastle)
        return true;
    } else if (activePiece.piece === 6 && castle.white.castleLong && x === 2 && y === 7) {
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
                castleLong: false
            },
            isCastling: "0-0-0",
        }
        setCastle(updateCastle)
        return true;
    } else if (activePiece.piece === 16 && castle.black.castleShort && x === 6 && y === 0) {
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
                castleLong: false
            },
            isCastling: "0-0",
        }
        setCastle(updateCastle)
        return true;
    } else if (activePiece.piece === 16 && castle.black.castleLong && x === 2 && y === 0) {
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
                castleLong: false
            },
            isCastling: "0-0-0",
        }
        setCastle(updateCastle)
        return true;
    } else {
        const updateCastle = {
            ...castle,
            isCastling: false,
        }
        setCastle(updateCastle)
        return false
    }

}

export default executeCastleMoves;