function checkEnPassant (x, y, activePiece, position, pawnCanEnPassant, setPawnCanEnPassant) {
    
    let tileDifference = Math.abs(y - activePiece.positionY)
    if ((activePiece.piece === 1 || activePiece.piece === 11) && tileDifference === 2) {
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

    
    //en passant (with white)
    if (pawnCanEnPassant.isActive && activePiece.piece === 1 && x !== activePiece.positionX) {
        const updatePosition = [...position];
        updatePosition[activePiece.positionY][activePiece.positionX] = 0;
        updatePosition[y + 1][x] = 0;
        updatePosition[y][x] = 1;
    //en passant (with black)
    } else if (pawnCanEnPassant.isActive && activePiece.piece === 11 && x !== activePiece.positionX){
        const updatePosition = [...position];
        updatePosition[activePiece.positionY][activePiece.positionX] = 0;
        updatePosition[y - 1][x] = 0;
        updatePosition[y][x] = 11;
    }
}

export default checkEnPassant;