export default class Rules {

    // checkTile(prevX, prevY, newX, newY, piece, position) {
    //     if (piece === 1 || piece === 11) {
    //         if (prevX === newX) {
    //             if (position[newY][newX] === 0) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         } else if (prevX !== newX && (newX === prevX + 1 || newX === prevX -1)) {
    //             if ((piece < 7 && position[newY][newX] > 10) || (piece > 7 && (position[newY][newX] < 10 && position[newY][newX] > 0))) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         if (position[newY][newX] === 0) {
    //             return true;
    //         } else if ((piece < 7 && position[newY][newX] > 10) || (piece > 7 && position[newY][newX] < 10 )) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    // }

    // checkPassedTile(lowest, newX, newY, position, axis) {
    //     if (axis === "x") {
    //         if (position[newY][lowest] === 0) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         if (position[lowest][newX] === 0) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    // }

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
                    if (position[posY + 1][posX + 1] < 8 && position[posY + 1][posX - 1] > 0) {
                        setPossibleCaptures(oldArray => [...oldArray, [posY + 1, posX + 1]]);
                    }
                }
                break;
            //Knight (white)
            case 2:
                if (playerTurn) {

                    if (posY + 1 < 8 && posX + 2 < 8 && posY + 1 >= 0 && posX + 2 >= 0) {
                        if (position[posY + 1][posX + 2] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX + 2]]);
                        } else if ( position[posY + 1][posX + 2] > 8) {
                            setPossibleCaptures(oldArray => [...oldArray, [posY + 1, posX + 2]]);
                        }
                    }
                    if (posY - 1 < 8 && posX + 2 < 8 && posY - 1 >= 0 && posX + 2 >= 0) {
                        if (position[posY - 1][posX + 2] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX + 2]]);
                        } else if ( position[posY - 1][posX + 2] > 8) {
                            setPossibleCaptures(oldArray => [...oldArray, [posY - 1, posX + 2]]);
                        }
                    }
                    if (posY + 1 < 8 && posX - 2 < 8 && posY + 1 >= 0 && posX - 2 >= 0) {
                        if (position[posY + 1][posX - 2] === 0 || position[posY + 1][posX - 2] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX - 2]]);
                        } 
                    }
                    if (posY - 1 < 8 && posX - 2 < 8 && posY - 1 >= 0 && posX - 2 >= 0) {
                        if (position[posY - 1][posX - 2] === 0 || position[posY - 1][posX - 2] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX - 2]]);
                        } 
                    }

                    if (posY + 2 < 8 && posX + 1 < 8 && posY + 2 >= 0 && posX + 1 >= 0) {
                        if (position[posY + 2][posX + 1] === 0 || position[posY + 2][posX + 1] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 2, posX + 1]]);
                        } 
                    }
                    if (posY - 2 < 8 && posX + 1 < 8 && posY - 2 >= 0 && posX + 1 >= 0) {
                        if (position[posY - 2][posX + 1] === 0 || position[posY - 2][posX + 1] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 2, posX + 1]]);
                        } 
                    }
                    if (posY + 2 < 8 && posX - 1 < 8 && posY + 2 >= 0 && posX - 1 >= 0) {
                        if (position[posY + 2][posX - 1] === 0 || position[posY + 2][posX - 1] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 2, posX - 1]]);
                        } 
                    }
                    if (posY - 2 < 8 && posX - 1 < 8 && posY - 2 >= 0 && posX - 1 >= 0) {
                        if (position[posY - 2][posX - 1] === 0 || position[posY - 2][posX - 1] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 2, posX - 1]]);
                        } 
                    }
                }
                break;
            //Knight (black)
            case 12:
                if (!playerTurn) {

                    if (posY + 1 < 8 && posX + 2 < 8 && posY + 1 >= 0 && posX + 2 >= 0) {
                        if (position[posY + 1][posX + 2] === 0 || position[posY + 1][posX + 2] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX + 2]]);
                        } 
                    }
                    if (posY - 1 < 8 && posX + 2 < 8 && posY - 1 >= 0 && posX + 2 >= 0) {
                        if (position[posY - 1][posX + 2] === 0 || position[posY - 1][posX + 2] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX + 2]]);
                        } 
                    }
                    if (posY + 1 < 8 && posX - 2 < 8 && posY + 1 >= 0 && posX - 2 >= 0) {
                        if (position[posY + 1][posX - 2] === 0 || position[posY + 1][posX - 2] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX - 2]]);
                        } 
                    }
                    if (posY - 1 < 8 && posX - 2 < 8 && posY - 1 >= 0 && posX - 2 >= 0) {
                        if (position[posY - 1][posX - 2] === 0 || position[posY - 1][posX - 2] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX - 2]]);
                        } 
                    }


                    if (posY + 2 < 8 && posX + 1 < 8 && posY + 2 >= 0 && posX + 1 >= 0) {
                        if (position[posY + 2][posX + 1] === 0 || position[posY + 2][posX + 1] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 2, posX + 1]]);
                        } 
                    }
                    if (posY - 2 < 8 && posX + 1 < 8 && posY - 2 >= 0 && posX + 1 >= 0) {
                        if (position[posY - 2][posX + 1] === 0 || position[posY - 2][posX + 1] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 2, posX + 1]]);
                        } 
                    }
                    if (posY + 2 < 8 && posX - 1 < 8 && posY + 2 >= 0 && posX - 1 >= 0) {
                        if (position[posY + 2][posX - 1] === 0 || position[posY + 2][posX - 1] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 2, posX - 1]]);
                        } 
                    }
                    if (posY - 2 < 8 && posX - 1 < 8 && posY - 2 >= 0 && posX - 1 >= 0) {
                        if (position[posY - 2][posX - 1] === 0 || position[posY - 2][posX - 1] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 2, posX - 1]]);
                        } 
                    }
                }
                break;
            //Bishop (white)
            case 3:
            //Bishop (black)
            case 13: 
                if ((playerTurn && piece === 3) || (!playerTurn && piece === 13)) {

                    //bottom right
                    for (let i = 1; i < 8; i++) {
                        if (posY + i < 8 && posX + i < 8 && posY + i >= 0 && posX + i >= 0) {
                            if (position[posY + i][posX + i] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [posY + i, posX + i]]);
                            } else {
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
                                break
                            }
                        }
                    }
                }              
                break;
            //Rook (white)
            case 4:
            //Rook (black)
            case 14:
                if ((playerTurn && piece === 4) || (!playerTurn && piece === 14)) {
                    //down
                    for (let i = posY + 1; i < 8; i++) {
                        if (position[i][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [i, posX]]);
                        } else {
                            break;
                        }
                    }
                    //up
                    for (let i = posY - 1; i >= 0; i--) {
                        if (position[i][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [i, posX]]);
                        } else {
                            break;
                        }
                    }
                    //right
                    for (let i = posX + 1; i < 8; i++) {
                        if (position[posY][i] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, i]]);
                        } else {
                            break;
                        }
                    }
                    //left
                    for (let i = posX - 1; i >= 0; i--) {
                        if (position[posY][i] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, i]]);
                        } else {
                            break;
                        }
                    }
                }
                break;
            //Queen (white)
            case 5:
            //Queen (black)
            case 15:
                if ((playerTurn && piece === 5) || (!playerTurn && piece === 15)) {
                    //down
                    for (let i = posY + 1; i < 8; i++) {
                        if (position[i][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [i, posX]]);
                        } else {
                            break;
                        }
                    }
                    //up
                    for (let i = posY - 1; i >= 0; i--) {
                        if (position[i][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [i, posX]]);
                        } else {
                            break;
                        }
                    }
                    //right
                    for (let i = posX + 1; i < 8; i++) {
                        if (position[posY][i] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, i]]);
                        } else {
                            break;
                        }
                    }
                    //left
                    for (let i = posX - 1; i >= 0; i--) {
                        if (position[posY][i] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, i]]);
                        } else {
                            break;
                        }
                    }
                    //bottom right
                    for (let i = 1; i < 8; i++) {
                        if (posY + i < 8 && posX + i < 8 && posY + i >= 0 && posX + i >= 0) {
                            if (position[posY + i][posX + i] === 0) {
                                setPossibleTiles(oldArray => [...oldArray, [posY + i, posX + i]]);
                            } else {
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
                                break
                            }
                        }
                    }
                }
                
            break;
            //King (white)
            case 6:
            //King (black)
            case 16:
                if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {

                    if (posY - 1 < 8 && posX + 1 < 8 && posY - 1 >= 0 && posX + 1 >= 0) {
                        if (position[posY - 1][posX + 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX + 1]]);
                        }
                    }
                    
                    if (posX + 1 < 8 && posX + 1 >= 0) {
                        if (position[posY][posX + 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, posX + 1]]);
                        }
                    }
                    
                    if (posY + 1 < 8 && posX + 1 < 8 && posY - 1 >= 0 && posX + 1 >= 0) {
                        if (position[posY + 1][posX + 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX + 1]]);
                        }
                    }
                    if (posY + 1 < 8 && posY + 1 >= 0) {
                        if (position[posY + 1][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX]]);
                        }
                    }
                    if (posY + 1 < 8 && posX - 1 < 8 && posY + 1 >= 0 && posX - 1 >= 0) {
                        if (position[posY + 1][posX - 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX - 1]]);
                        }
                    }
                    if (posX - 1 < 8 && posX - 1 >= 0) {
                        if (position[posY][posX - 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY, posX - 1]]);
                        }
                    }
                    if (posY - 1 < 8 && posX - 1 < 8 && posY - 1 >= 0 && posX - 1 >= 0) {
                        if (position[posY - 1][posX - 1] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX - 1]]);
                        }
                    }
                    if (posY - 1 < 8 && posY - 1 >= 0) {
                        if (position[posY - 1][posX] === 0) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX]]);
                        }
                    }
                }
                break;
            default: break;
        }
    }

    isPossibleTileOccupied (piece, possibleTiles) {
        console.log("drin")
        console.log(possibleTiles)
    }
}