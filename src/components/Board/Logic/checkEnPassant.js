function checkEnPassant (x, y, activePiece, position, pawnCanEnPassant, setPawnCanEnPassant) {
    
    let tileDifferenceY = Math.abs(y - activePiece.positionY)
    let tileDifferenceX = Math.abs(pawnCanEnPassant.posX - activePiece.positionX)

    //set possible en passant pawn
    if ((activePiece.piece === 1 || activePiece.piece === 11) && tileDifferenceY === 2) {
        const updateEnPassant = {
            ...pawnCanEnPassant,
            isActive: true,
            posX: x,
            posY: y
        }
        setPawnCanEnPassant(updateEnPassant)
    } else {
        const updateEnPassant = {
            ...pawnCanEnPassant,
            isActive: false,
            posX: null,
            posY: null
        }
        setPawnCanEnPassant(updateEnPassant)
    }

    
    //execute en passant (with white)
    if (pawnCanEnPassant.isActive && activePiece.piece === 1 && tileDifferenceX === 1 && y === 2) {
        const updatePosition = [...position];
        updatePosition[activePiece.positionY][activePiece.positionX] = 0;
        updatePosition[y + 1][x] = 0;
        updatePosition[y][x] = 1;
        return true
    //en passant (with black)
    } else if (pawnCanEnPassant.isActive && activePiece.piece === 11 && tileDifferenceX === 1 && y === 5){
        const updatePosition = [...position];
        updatePosition[activePiece.positionY][activePiece.positionX] = 0;
        updatePosition[y - 1][x] = 0;
        updatePosition[y][x] = 11;
        return true
    } 
    return false
}

export default checkEnPassant;