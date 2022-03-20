function checkCastleMoves (x, position, castle, setCastle, activePiece, setPosition) {
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
                castleLong: false
            }
        }
        setCastle(updateCastle)
        // break move;
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
                castleLong: false
            }
        }
        setCastle(updateCastle)
        // break move;
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
                castleLong: false
            }
        }
        setCastle(updateCastle)
        // break move;
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
                castleLong: false
            }
        }
        setCastle(updateCastle)
        // break move;
    }
}

export default checkCastleMoves;