//reset board
function resetBoard (setPosition, activePiece, setActivePiece, lastPiece, setLastPiece, setPossibleTiles, setPossibleCaptures, setPlayerTurn, setCastle) {
    setPosition([
        [14,12,13,15,16,13,12,14],
        [11,11,11,11,11,11,11,11],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1],
        [4,2,3,5,6,3,2,4],
    ])

    const updatePiece = {
        ...activePiece,
        isActive: false,
        piece: null,
        positionX: null,
        positionY: null
    }
    setActivePiece(updatePiece)

    const updateLastPiece = {
        ...lastPiece, 
        oldPositionX: null,
        oldPositionY: null,
        newPositionX: null,
        newPositionY: null
    }
    setLastPiece(updateLastPiece)

    const updateCastle = {
        white: {
            castleLong: true,
            castleShort: true
        },
        black: {
            castleLong: true,
            castleShort: true
        }
    }
    setCastle(updateCastle)

    setPossibleTiles([]);
    setPossibleCaptures([])
    setPlayerTurn(true)
    console.clear()
}

export default resetBoard;