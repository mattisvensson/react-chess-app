function checkCastleMoves (position, castle, setCastle) {
    
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

    if (position[7][4] !== 6) {
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
    if (position[0][4] !== 16) {
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

export default checkCastleMoves;