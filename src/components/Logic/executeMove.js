function executeMove (x, y) {
        
    let match = false;
    for (let i = 0; i < possibleTiles.length; i++) {
        if (JSON.stringify(possibleTiles[i]) === JSON.stringify([y, x])) {
            match = true;
            break;
        }
    }
    for (let i = 0; i < possibleCaptures.length; i++) {
        if (JSON.stringify(possibleCaptures[i]) === JSON.stringify([y, x])) {
            if ((playerTurn && position[y][x] > 8) || (!playerTurn && position[y][x] < 8)) {
                match = true;
                break;
            }
        }
    }
    
    if (match) {
        
        const newPosition = [...position];
        newPosition[activePiece.positionY][activePiece.positionX] = 0;
        newPosition[y][x] = activePiece.piece;
        setPosition(newPosition);

        setPlayerTurn(prev => !prev)

        //Reset possible Tiles
        setPossibleTiles([]);
        setPossibleCaptures([])

        const updateLastPiece = {
            ...lastPiece, 
            oldPositionX: activePiece.positionX,
            oldPositionY: activePiece.positionY,
            newPositionX: x,
            newPositionY: y
        }
        setLastPiece(updateLastPiece)

        const updatePiece = {
            ...activePiece,
            isActive: false,
            counter: 0
        }
        setActivePiece(updatePiece)

    }      

    activePiece.isActive.style.position = "static";
    activePiece.isActive.style.left = "unset";
    activePiece.isActive.style.top = "unset";

    setPieceIsDragged(false)

}

export default executeMove;