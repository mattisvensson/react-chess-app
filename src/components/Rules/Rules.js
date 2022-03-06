export default class Rules {

    checkPossibleMoves(posX, posY, piece, position, playerTurn, setPossibleTiles, setPossibleCaptures) {
        console.log("checking possible moves...")

        switch (piece) {
            //Pawn (white)
            case 1:
                if (playerTurn) {
                    if(posY === 6) {
                        for (let i = 5; i >= 4; i--) {
                            if (position[i][posX] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [i, posX]]);
                            } else {
                                return false;
                            }
                        }
                    } else if (position[posY - 1][posX] === 0) {
                        setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX]]);
                    } else {
                        return false;
                    }
                    //Check if piece can be captured
                    if (position[posY - 1][posX - 1] > 8) {
                        setPossibleCaptures(oldArray => [...oldArray, [posY - 1, posX - 1]]);
                    }
                    if (position[posY - 1][posX + 1] > 8) {
                        setPossibleCaptures(oldArray => [...oldArray, [posY - 1, posX + 1]]);
                    }
                }
                
                break;
            //Pawn (black)
            case 11: 
                if (!playerTurn) {
                    if(posY === 1) {
                        for (let i = 2; i <= 3; i++) {
                            if (position[i][posX] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [i, posX]]);
                            } else {
                                return false;
                            }
                        }
                    } else if (position[posY + 1][posX] === 0) {
                        setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX]]);
                    } else {
                        return false;
                    }
                    //Check if piece can be captured
                    if (position[posY + 1][posX - 1] < 8 && position[posY + 1][posX - 1] > 0 ) {
                        setPossibleCaptures(oldArray => [...oldArray, [posY + 1, posX - 1]]);
                    }
                    if (position[posY + 1][posX + 1] < 8 && position[posY + 1][posX + 1] > 0) {
                        setPossibleCaptures(oldArray => [...oldArray, [posY + 1, posX + 1]]);
                    }
                }
                break;
            //Knight (white and black)
            case 2:
            case 12:
                if ((playerTurn && piece === 2) || (!playerTurn && piece === 12)) {

                    if (posY + 1 < 8 && posX + 2 < 8 && posY + 1 >= 0 && posX + 2 >= 0) {
                        if (position[posY + 1][posX + 2] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX + 2]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY + 1, posX + 2]]);  
                        }
                    }
                    if (posY - 1 < 8 && posX + 2 < 8 && posY - 1 >= 0 && posX + 2 >= 0) {
                        if (position[posY - 1][posX + 2] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX + 2]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY - 1, posX + 2]]);
                        }
                    }
                    if (posY + 1 < 8 && posX - 2 < 8 && posY + 1 >= 0 && posX - 2 >= 0) {
                        if (position[posY + 1][posX - 2] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX - 2]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY + 1, posX - 2]]);
                        }
                    }
                    if (posY - 1 < 8 && posX - 2 < 8 && posY - 1 >= 0 && posX - 2 >= 0) {
                        if (position[posY - 1][posX - 2] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX - 2]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY - 1, posX - 2]]);
                        }
                    }


                    if (posY + 2 < 8 && posX + 1 < 8 && posY + 2 >= 0 && posX + 1 >= 0) {
                        if (position[posY + 2][posX + 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 2, posX + 1]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY + 2, posX + 1]]); 
                        }
                    }
                    if (posY - 2 < 8 && posX + 1 < 8 && posY - 2 >= 0 && posX + 1 >= 0) {
                        if (position[posY - 2][posX + 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 2, posX + 1]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY - 2, posX + 1]]);
                        }
                    }
                    if (posY + 2 < 8 && posX - 1 < 8 && posY + 2 >= 0 && posX - 1 >= 0) {
                        if (position[posY + 2][posX - 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 2, posX - 1]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY + 2, posX - 1]]);
                        }
                    }
                    if (posY - 2 < 8 && posX - 1 < 8 && posY - 2 >= 0 && posX - 1 >= 0) {
                        if (position[posY - 2][posX - 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 2, posX - 1]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY - 2, posX - 1]]);
                        }
                    }
                }
                break;
            //Bishop (white and black)
            case 3:
            case 13: 
                if ((playerTurn && piece === 3) || (!playerTurn && piece === 13)) {

                    //bottom right
                    for (let i = 1; i < 8; i++) {
                        if (posY + i < 8 && posX + i < 8 && posY + i >= 0 && posX + i >= 0) {
                            if (position[posY + i][posX + i] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [posY + i, posX + i]]);
                            } else {
                                setPossibleCaptures(oldArray => [...oldArray, [posY + i, posX + i]]);
                                break;
                            }
                        }
                    }
                    //top right    
                    for (let i = 1; i < 8; i++) {
                        if (posY - i < 8 && posX + i < 8 && posY - i >= 0 && posX + i >= 0) {
                            if (position[posY - i][posX + i] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [posY - i, posX + i]]);
                            } else {
                                setPossibleCaptures(oldArray => [...oldArray, [posY - i, posX + i]]);
                                break;
                            }
                        }
                    }
                    //bottom left
                    for (let i = 1; i < 8; i++) {
                        if (posY + i < 8 && posX - i < 8 && posY + i >= 0 && posX - i >= 0) {
                            if (position[posY + i][posX - i] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [posY + i, posX - i]]);
                            } else {
                                setPossibleCaptures(oldArray => [...oldArray, [posY + i, posX - i]]);
                                break;
                            }
                        }
                    }
                    //top left
                    for (let i = 1; i < 8; i++) {
                        if (posY - i < 8 && posX - i < 8 && posY - i >= 0 && posX - i >= 0) {
                            if (position[posY - i][posX - i] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [posY - i, posX - i]]);
                            } else {
                                setPossibleCaptures(oldArray => [...oldArray, [posY - i, posX - i]]);
                                break;
                            }
                        }
                    }
                }              
                break;
            //Rook (white and black)
            case 4:
            case 14:
                if ((playerTurn && piece === 4) || (!playerTurn && piece === 14)) {
                    //down
                    for (let i = posY + 1; i < 8; i++) {
                        if (position[i][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [i, posX]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [i, posX]]);
                            break;
                        }
                    }
                    //up
                    for (let i = posY - 1; i >= 0; i--) {
                        if (position[i][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [i, posX]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [i, posX]]);
                            break;
                        }
                    }
                    //right
                    for (let i = posX + 1; i < 8; i++) {
                        if (position[posY][i] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, i]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY, i]]);
                            break;
                        }
                    }
                    //left
                    for (let i = posX - 1; i >= 0; i--) {
                        if (position[posY][i] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, i]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY, i]]);
                            break;
                        }
                    }
                }
                break;
            //Queen (white and black)
            case 5:
            case 15:
                if ((playerTurn && piece === 5) || (!playerTurn && piece === 15)) {
                    //down
                    for (let i = posY + 1; i < 8; i++) {
                        if (position[i][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [i, posX]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [i, posX]]);
                            break;
                        }
                    }
                    //up
                    for (let i = posY - 1; i >= 0; i--) {
                        if (position[i][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [i, posX]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [i, posX]]);
                            break;
                        }
                    }
                    //right
                    for (let i = posX + 1; i < 8; i++) {
                        if (position[posY][i] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, i]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY, i]]);
                            break;
                        }
                    }
                    //left
                    for (let i = posX - 1; i >= 0; i--) {
                        if (position[posY][i] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, i]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY, i]]);
                            break;
                        }
                    }
                    //bottom right
                    for (let i = 1; i < 8; i++) {
                        if (posY + i < 8 && posX + i < 8 && posY + i >= 0 && posX + i >= 0) {
                            if (position[posY + i][posX + i] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [posY + i, posX + i]]);
                            } else {
                                setPossibleCaptures(oldArray => [...oldArray, [posY + i, posX + i]]);
                                break
                            }
                        }
                    }
                    //top right    
                    for (let i = 1; i < 8; i++) {
                        if (posY - i < 8 && posX + i < 8 && posY - i >= 0 && posX + i >= 0) {
                            if (position[posY - i][posX + i] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [posY - i, posX + i]]);
                            } else {
                                setPossibleCaptures(oldArray => [...oldArray, [posY - i, posX + i]]);
                                break
                            }
                        }
                    }  
                    //bottom left
                    for (let i = 1; i < 8; i++) {
                        if (posY + i < 8 && posX - i < 8 && posY + i >= 0 && posX - i >= 0) {
                            if (position[posY + i][posX - i] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [posY + i, posX - i]]);
                            } else {
                                setPossibleCaptures(oldArray => [...oldArray, [posY + i, posX - i]]);
                                break
                            }
                        }
                    }
                    //top left
                    for (let i = 1; i < 8; i++) {
                        if (posY - i < 8 && posX - i < 8 && posY - i >= 0 && posX - i >= 0) {
                            if (position[posY - i][posX - i] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [posY - i, posX - i]]);
                            } else {
                                setPossibleCaptures(oldArray => [...oldArray, [posY - i, posX - i]]);
                                break
                            }
                        }
                    }
                }
                
            break;
            //King (white and black)
            case 6:
            case 16:
                if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {

                    tile1: if (posY - 1 < 8 && posX + 1 < 8 && posY - 1 >= 0 && posX + 1 >= 0) {
                        if (position[posY - 1][posX + 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX + 1]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY - 1, posX + 1]]);
                            break tile1;
                        }
                    }
                    
                    tile2: if (posX + 1 < 8 && posX + 1 >= 0) {
                        if (position[posY][posX + 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, posX + 1]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY, posX + 1]]);
                            break tile2;
                        }
                    }
                    
                    tile3: if (posY + 1 < 8 && posX + 1 < 8 && posY - 1 >= 0 && posX + 1 >= 0) {
                        if (position[posY + 1][posX + 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX + 1]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY + 1, posX + 1]]);
                            break tile3;
                        }
                    }
                    tile4: if (posY + 1 < 8 && posY + 1 >= 0) {
                        if (position[posY + 1][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY + 1, posX]]);
                            break tile4;
                        }
                    }
                    tile5: if (posY + 1 < 8 && posX - 1 < 8 && posY + 1 >= 0 && posX - 1 >= 0) {
                        if (position[posY + 1][posX - 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX - 1]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY + 1, posX - 1]]);
                            break tile5;
                        }
                    }
                    tile6: if (posX - 1 < 8 && posX - 1 >= 0) {
                        if (position[posY][posX - 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, posX - 1]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY, posX - 1]]);
                            break tile6;
                        }
                    }
                    tile7: if (posY - 1 < 8 && posX - 1 < 8 && posY - 1 >= 0 && posX - 1 >= 0) {
                        if (position[posY - 1][posX - 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX - 1]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY - 1, posX - 1]]);
                            break tile7;
                        }
                    }
                    tile8: if (posY - 1 < 8 && posY - 1 >= 0) {
                        if (position[posY - 1][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX]]);
                        } else {
                            setPossibleCaptures(oldArray => [...oldArray, [posY - 1, posX]]);
                            break tile8;
                        }
                    }
                }
                break;
            default: break;
        }
    }
}