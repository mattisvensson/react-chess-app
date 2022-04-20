export default class Rules {

    checkPossibleMoves(posX, posY, piece, position, playerTurn, setPossibleTiles, castle, pawnCanEnPassant) {
        // console.log("checking possible moves...")

        switch (piece) {
            //Pawn (white)
            case 1:
                if (playerTurn) {
                    const pawnWhite = this.pawnWhiteMove(posX, posY, position, pawnCanEnPassant)
                    setPossibleTiles(pawnWhite)
                }
                
                break;
            //Pawn (black)
            case 11: 
                if (!playerTurn) {
                    const pawnBlack = this.pawnBlackMove(posX, posY, position, pawnCanEnPassant)
                    setPossibleTiles(pawnBlack)
                }
                break;
            //Knight (white and black)
            case 2:
            case 12:
                if ((playerTurn && piece === 2) || (!playerTurn && piece === 12)) {
                    const knight = this.knightMove(posX, posY, position)
                    setPossibleTiles(knight)
                }
                break;
            //Bishop (white and black)
            case 3:
            case 13: 
                if ((playerTurn && piece === 3) || (!playerTurn && piece === 13)) {
                    const bishop = this.bishopMove(posX, posY, position)
                    setPossibleTiles(bishop)
                }              
                break;
            //Rook (white and black)
            case 4:
            case 14:
                if ((playerTurn && piece === 4) || (!playerTurn && piece === 14)) {
                    const rook = this.rookMove(posX, posY, position)
                    setPossibleTiles(rook)
                }
                break;
            //Queen (white and black)
            case 5:
            case 15:
                if ((playerTurn && piece === 5) || (!playerTurn && piece === 15)) {
                    const queen = this.queenMove(posX, posY, position)
                    setPossibleTiles(queen)
                }
                break;
            //King (white and black)
            case 6:
            case 16:
                if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {
                    const king = this.kingMove(posX, posY, position, piece, castle)
                    setPossibleTiles(king)
                }
                break;
            default: break;
        }
    }


    pawnWhiteMove (posX, posY, position, pawnCanEnPassant) {
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

    pawnBlackMove (posX, posY, position, pawnCanEnPassant) {
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

    knightMove (posX, posY, position) {
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


    bishopMove (posX, posY, position) {
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


    rookMove (posX, posY, position) {
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


    queenMove (posX, posY, position) {
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


    kingMove (posX, posY, position, piece, castle) {
        let tiles = []
        if (posY - 1 >= 0 && posX + 1 < 8) {
            tiles.push([posY - 1, posX + 1]);
        }
        if (posX - 1 >= 0 && posX + 1 < 8) {
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
        if (piece === 6 && posX === 4 && posY === 7) {
            if (castle.white.castleShort && position[7][5] === 0 && position[7][6] === 0 && position[7][7] === 4) {                           
                tiles.push([posY, posX + 2]);
            } 
        
            if (castle.white.castleLong && position[7][3] === 0 && position[7][2] === 0 && position[7][1] === 0 && position[7][0] === 4) {
                tiles.push([posY, posX - 2]);                           
            } 
        }
        if (piece === 16 && posX === 4 && posY === 0) {
            if (castle.black.castleShort && position[0][5] === 0 && position[0][6] === 0 && position[0][7] === 14) {                              
                tiles.push([posY, posX + 2]);
            } 
        
            if (castle.black.castleLong && position[0][3] === 0 && position[0][2] === 0 && position[0][1] === 0 && position[0][0] === 14) {
                tiles.push([posY, posX - 2]);                           
            } 
        }
        return tiles;
    }
}
