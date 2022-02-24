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

    checkPossibleMoves(posX, posY, piece, position, playerTurn, setPossibleTiles) {
        console.log("checking possible moves...")

        switch (piece) {
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
                    console.log(position[posY - 1][posX - 1])
                    if (position[posY - 1][posX - 1] > 8) {
                        setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX - 1]]);
                    }
                    if (position[posY - 1][posX + 1] > 8) {
                        setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX + 1]]);
                    }
                }
                
                break;
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
                }
                break;
            case 2:
                if (playerTurn) {

                    if ((posY + 1 || posX + 2) < 8 && (posY + 1 || posX + 2) >= 0) {
                        if (position[posY + 1][posX + 2] === 0 || position[posY + 1][posX + 2] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX + 2]]);
                        } 
                    }
                    if ((posY - 1 || posX + 2) < 8 && (posY - 1 || posX + 2) >= 0) {
                        if (position[posY - 1][posX + 2] === 0 || position[posY - 1][posX + 2] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX + 2]]);
                        } 
                    }
                    if ((posY + 1 || posX - 2) < 8 && (posY + 1 || posX - 2) >= 0) {
                        if (position[posY + 1][posX - 2] === 0 || position[posY + 1][posX - 2] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX - 2]]);
                        } 
                    }
                    if ((posY - 1 || posX - 2) < 8 && (posY - 1 || posX - 2) >= 0) {
                        if (position[posY - 1][posX - 2] === 0 || position[posY - 1][posX - 2] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX - 2]]);
                        } 
                    }

                    if ((posY + 2 || posX + 1) < 8 && (posY + 2 || posX + 1) >= 0) {
                        if (position[posY + 2][posX + 1] === 0 || position[posY + 2][posX + 1] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 2, posX + 1]]);
                        } 
                    }
                    if ((posY - 2 || posX + 1) < 8 && (posY - 2 || posX + 1) >= 0) {
                        if (position[posY - 2][posX + 1] === 0 || position[posY - 2][posX + 1] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 2, posX + 1]]);
                        } 
                    }
                    if ((posY + 2 || posX - 1) < 8 && (posY + 2 || posX - 1) >= 0) {
                        if (position[posY + 2][posX - 1] === 0 || position[posY + 2][posX - 1] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 2, posX - 1]]);
                        } 
                    }
                    if ((posY - 2 || posX - 1) < 8 && (posY - 2 || posX - 1) >= 0) {
                        if (position[posY - 2][posX - 1] === 0 || position[posY - 2][posX - 1] > 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 2, posX - 1]]);
                        } 
                    }
                }
                break;
            case 12:
                if (!playerTurn) {

                    if ((posY + 1 || posX + 2) < 8 && (posY + 1 || posX + 2) >= 0) {
                        if (position[posY + 1][posX + 2] === 0 || position[posY + 1][posX + 2] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX + 2]]);
                        } 
                    }
                    if ((posY - 1 || posX + 2) < 8 && (posY - 1 || posX + 2) >= 0) {
                        if (position[posY - 1][posX + 2] === 0 || position[posY - 1][posX + 2] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX + 2]]);
                        } 
                    }
                    if ((posY + 1 || posX - 2) < 8 && (posY + 1 || posX - 2) >= 0) {
                        if (position[posY + 1][posX - 2] === 0 || position[posY + 1][posX - 2] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 1, posX - 2]]);
                        } 
                    }
                    if ((posY - 1 || posX - 2) < 8 && (posY - 1 || posX - 2) >= 0) {
                        if (position[posY - 1][posX - 2] === 0 || position[posY - 1][posX - 2] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 1, posX - 2]]);
                        } 
                    }


                    if ((posY + 2 || posX + 1) < 8 && (posY + 2 || posX + 1) >= 0) {
                        if (position[posY + 2][posX + 1] === 0 || position[posY + 2][posX + 1] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 2, posX + 1]]);
                        } 
                    }
                    if ((posY - 2 || posX + 1) < 8 && (posY - 2 || posX + 1) >= 0) {
                        if (position[posY - 2][posX + 1] === 0 || position[posY - 2][posX + 1] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 2, posX + 1]]);
                        } 
                    }
                    if ((posY + 2 || posX - 1) < 8 && (posY + 2 || posX - 1) >= 0) {
                        if (position[posY + 2][posX - 1] === 0 || position[posY + 2][posX - 1] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY + 2, posX - 1]]);
                        } 
                    }
                    if ((posY - 2 || posX - 1) < 8 && (posY - 2 || posX - 1) >= 0) {
                        if (position[posY - 2][posX - 1] === 0 || position[posY - 2][posX - 1] < 8) {
                            setPossibleTiles(oldArray => [...oldArray, [posY - 2, posX - 1]]);
                        } 
                    }
                }
                break;
            case 3:
            case 13: break;
            case 4:
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
                        console.log(i)
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
            case 5:
            case 15:break;
            case 6:
            case 16:
                if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {

                    // if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
                    //     if ((newX === prevX - 1 || newX === prevX + 1 || newX === prevX) && (newY === prevY - 1 || newY === prevY + 1 || newY === prevY)) {
                    //         return true;
                    //     } else {
                    //         return false;
                    //     }
                    // }
                } else {
                    return false;
                }
                break;
            default: break;
        }
    }

    // checkMove(prevX, prevY, newX, newY, piece, playerTurn, position) {

    //     // console.log(position[1][1])
    //     // console.log("prev location " + prevX, prevY);
    //     // console.log("new location " + newX,  newY);
    //     // console.log("piece " + piece);
    //     // console.log(position)

    //     switch (piece) {
    //         // Pawn (white)
    //         case 1:
    //             if(playerTurn) {
    //                 if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
    //                     if(prevY === 6) {
    //                         if (newY === 5) {
    //                             return true;
    //                         } else if (newY === 4){
    //                             return true;
    //                         } else {
    //                             return false;
    //                         }
    //                     } else if (prevY - newY === 1) {
    //                         return true;
    //                     } else {
    //                         return false;
    //                     }
    //                 }
    //             } else {
    //                 return false;
    //             }
    //             break;
    //         // Pawn (black)
    //         case 11:
    //             if(!playerTurn) {
    //                 if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
    //                     if(prevY === 1) {
    //                         if (newY === 2 || newY === 3) {
    //                             return true;
    //                         } else {
    //                             return false;
    //                         }
    //                     } else if (prevY - newY === -1) {
    //                         return true;
    //                     } else {
    //                         return false;
    //                     }
    //                 }
    //             } else {
    //                 return false;
    //             }
    //             break;
    //         // Knight
    //         case 2:
    //         case 12:
    //             if ((playerTurn && piece === 2) || (!playerTurn && piece === 12)) {
    //                 if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
    //                     if (
    //                         (newX === prevX + 2 && newY === prevY + 1) ||
    //                         (newX === prevX + 2 && newY === prevY - 1) ||
    //                         (newX === prevX - 2 && newY === prevY + 1) ||
    //                         (newX === prevX - 2 && newY === prevY - 1) ||

    //                         (newX === prevX + 1 && newY === prevY + 2) ||
    //                         (newX === prevX + 1 && newY === prevY - 2) ||
    //                         (newX === prevX - 1 && newY === prevY + 2) ||
    //                         (newX === prevX - 1 && newY === prevY - 2)
    //                         ) {
    //                         return true;
    //                     } else {
    //                         return false
    //                     }
    //                 }
    //             } else {
    //                 return false;
    //             }
    //             break;
    //         // Bishop
    //         case 3:
    //         case 13:
    //             if ((playerTurn && piece === 3) || (!playerTurn && piece === 13)) {
    //                 if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
    //                     for (let i = 1; i < 7; i++) {

    //                         // let passedTiles = {x: prevX + i, y: prevY - i}
    //                         // console.log(`passing through ${passedTiles.x}, ${passedTiles.y}`)

    //                         if (newX - prevX === i && prevY - newY === i) {
    //                             return true;
    //                         } else if (newX - prevX === -i && prevY - newY === -i) {
    //                             return true;
    //                         } else if (newX - prevX === i && prevY - newY === -i) {
    //                             return true;
    //                         } else if (newX - prevX === -i && prevY - newY === i) {
    //                             return true;
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 return false;
    //             }
    //             break;
    //         // Rook
    //         case 4:
    //         case 14:
    //             if ((playerTurn && piece === 4) || (!playerTurn && piece === 14)) {

    //                 let lowest;
    //                 let highest;
    //                 let axis;

    //                 if (prevX === newX) {
    //                     lowest = Math.min(prevY, newY) + 1
    //                     highest = Math.max(prevY, newY) - 1
    //                     axis = "y"
    //                 } else if (prevY === newY) {
    //                     lowest = Math.min(prevX, newX) + 1
    //                     highest = Math.max(prevX, newX) - 1
    //                     axis = "x"
    //                 }

    //                 console.log("lowest: " + lowest)
    //                 console.log("highest: " + highest)

    //                 let allClear = [];

    //                 for (lowest; lowest <= highest; lowest++) {
    //                     console.log(lowest)

    //                     if (this.checkPassedTile(lowest, newX, newY, position, axis)) {
    //                         allClear.push(0);
    //                     } else {
    //                         allClear.push(1);
    //                     }
    //                 }

    //                 console.log("ok")
    //                 if (!(allClear.includes(1)) && this.checkTile(prevX, prevY, newX, newY, piece, position)) {
    //                     if ((prevX !== newX && prevY === newY) || (prevY !== newY && prevX === newX)) {
    //                         return true;
    //                     }
    //                 }
    //             } else {
    //                 return false;
    //             }
    //             break;
    //         // Queen
    //         case 5:
    //         case 15:
    //             if ((playerTurn && piece === 5) || (!playerTurn && piece === 15)) {
    //                 if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
    //                     if ((prevX !== newX && prevY === newY) || (prevY !== newY && prevX === newX)) {
    //                         return true;
    //                     } else {
    //                         for (let i = 1; i < 7; i++) {

    //                             // let passedTiles = {x: prevX + i, y: prevY - i}
    //                             // console.log(`passing through ${passedTiles.x}, ${passedTiles.y}`)

    //                             if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
    //                                 if (newX - prevX === i && prevY - newY === i) {
    //                                     return true;
    //                                 } else if (newX - prevX === -i && prevY - newY === -i) {
    //                                     return true;
    //                                 } else if (newX - prevX === i && prevY - newY === -i) {
    //                                     return true;
    //                                 } else if (newX - prevX === -i && prevY - newY === i) {
    //                                     return true;
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 return false;
    //             }
    //             break;
    //         // King
    //         case 6:
    //         case 16:
    //             if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {
    //                 if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
    //                     if ((newX === prevX - 1 || newX === prevX + 1 || newX === prevX) && (newY === prevY - 1 || newY === prevY + 1 || newY === prevY)) {
    //                         return true;
    //                     } else {
    //                         return false;
    //                     }
    //                 }
    //             } else {
    //                 return false;
    //             }
    //             break;
    //         default: return false;
    //     }
    // }
}