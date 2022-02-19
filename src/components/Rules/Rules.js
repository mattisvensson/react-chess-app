export default class Rules {

    checkTile(prevX, prevY, newX, newY, piece, position) {
        if (piece === 1 || piece === 11) {
            if (prevX === newX) {
                if (position[newY][newX] === 0) {
                    return true;
                } else {
                    return false;
                }
            } else if (prevX !== newX && (newX === prevX + 1 || newX === prevX -1)) {
                if ((piece < 7 && position[newY][newX] > 10) || (piece > 7 && (position[newY][newX] < 10 && position[newY][newX] > 0))) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            if (position[newY][newX] === 0) {
                return true;
            } else if ((piece < 7 && position[newY][newX] > 10) || (piece > 7 && position[newY][newX] < 10 )) {
                return true;
            } else {
                return false;
            }
        }
    }

    checkMove(prevX, prevY, newX, newY, piece, playerTurn, position) {

        // console.log(position[1][1])
        // console.log("prev location " + prevX, prevY);
        // console.log("new location " + newX,  newY);
        // console.log("piece " + piece);
        // console.log(position)

        switch (piece) {
            case 1:
                if(playerTurn) {
                    if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
                        if(prevY === 6) {
                            if (newY === 5) {
                                return true;
                            } else if (newY === 4){
                                return true;
                            } else {
                                return false;
                            }
                        } else if (prevY - newY === 1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
                break;
            case 2: 
            case 12:
                if ((playerTurn && piece === 2) || (!playerTurn && piece === 12)) {
                    if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
                        if (
                            (newX === prevX + 2 && newY === prevY + 1) ||
                            (newX === prevX + 2 && newY === prevY - 1) ||
                            (newX === prevX - 2 && newY === prevY + 1) ||
                            (newX === prevX - 2 && newY === prevY - 1) ||

                            (newX === prevX + 1 && newY === prevY + 2) ||
                            (newX === prevX + 1 && newY === prevY - 2) ||
                            (newX === prevX - 1 && newY === prevY + 2) ||
                            (newX === prevX - 1 && newY === prevY - 2) 
                            ) {
                            return true;
                        } else {
                            return false
                        }
                    }
                } else {
                    return false;
                }
                break;
            case 3: 
            case 13:
                if ((playerTurn && piece === 3) || (!playerTurn && piece === 13)) {
                    if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
                        for (let i = 1; i < 7; i++) {

                            // let passedTiles = {x: prevX + i, y: prevY - i}
                            // console.log(`passing through ${passedTiles.x}, ${passedTiles.y}`)

                            if (newX - prevX === i && prevY - newY === i) {
                                return true;
                            } else if (newX - prevX === -i && prevY - newY === -i) {
                                return true;
                            } else if (newX - prevX === i && prevY - newY === -i) {
                                return true;
                            } else if (newX - prevX === -i && prevY - newY === i) {
                                return true;
                            }
                        } 
                    }
                } else {
                    return false;
                }
                break;
            case 4: 
            case 14:
                if ((playerTurn && piece === 4) || (!playerTurn && piece === 14)) {
                    if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
                        if ((prevX !== newX && prevY === newY) || (prevY !== newY && prevX === newX)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
                break;
            case 5:
            case 15: 
                if ((playerTurn && piece === 5) || (!playerTurn && piece === 15)) {
                    if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
                        if ((prevX !== newX && prevY === newY) || (prevY !== newY && prevX === newX)) {
                            return true;
                        } else {
                            for (let i = 1; i < 7; i++) {

                                // let passedTiles = {x: prevX + i, y: prevY - i}
                                // console.log(`passing through ${passedTiles.x}, ${passedTiles.y}`)
    
                                if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
                                    if (newX - prevX === i && prevY - newY === i) {
                                        return true;
                                    } else if (newX - prevX === -i && prevY - newY === -i) {
                                        return true;
                                    } else if (newX - prevX === i && prevY - newY === -i) {
                                        return true;
                                    } else if (newX - prevX === -i && prevY - newY === i) {
                                        return true;
                                    }
                                } 
                            }
                        }
                    } 
                } else {
                    return false;
                }
                break;
            case 6: 
            case 16:
                if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {
                    if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
                        if ((newX === prevX - 1 || newX === prevX + 1 || newX === prevX) && (newY === prevY - 1 || newY === prevY + 1 || newY === prevY)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
                break;
            case 11: 
                if(!playerTurn) {
                    if (this.checkTile(prevX, prevY, newX, newY, piece, position)) {
                        if(prevY === 1) {
                            if (newY === 2 || newY === 3) {
                                return true;
                            } else {
                                return false;
                            }
                        } else if (prevY - newY === -1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
                break;
            default: return false;
        }
    }
}