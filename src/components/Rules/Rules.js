export default class Rules {

    checkTile(newX, newY, piece, position, passedTiles) {
        // if (position[newY][newX] === 0) {
        //     return true;
        // } else {
        //     return false;
        // }        
        if (position[passedTiles.y][passedTiles.x] === 0) {
            return true;
        } else {
            return false;
        }
    }

    checkMove(prevX, prevY, newX, newY, piece, playerTurn, position) {

        // if (this.checkTile(prevX, prevY, newX, newY, piece, playerTurn, position)) {

            // console.log(position[1][1])
            // console.log("prev location " + prevX, prevY);
            // console.log("new location " + newX,  newY);
            // console.log("piece " + piece);
            // console.log(position)

            switch (piece) {
                case 1 : 
                    if(playerTurn && prevX === newX) {
                        if(prevY === 6) {
                            if (newY === 5) {
                                if (this.checkTile(newX, newY, piece, position)) {
                                    return true;
                                }
                            } else if (newY === 4){
                                if (this.checkTile(newX, newY, position) && this.checkTile(newX, newY + 1, position)) {
                                    return true;
                                }
                            } else {
                                return false;
                            }
                        } else if (prevY - newY === 1) {
                            if (this.checkTile(newX, newY, position)) {
                                return true;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                    break;
                case 2: 
                    if (playerTurn) {
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
                    } else {
                        return false;
                    }
                case 3: 
                    if (playerTurn) {
                        for (let i = 1; i < 7; i++) {
                            // console.log("x: " + prevX, newX)
                            // console.log("y: " + prevY, newY)
                            // console.log("i: " + i)
                            // console.log(newX - prevX === i )

                                let passedTiles = {x: prevX + i, y: prevY - i}
                                console.log(`passing through ${passedTiles.x}, ${passedTiles.y}`)

                                this.checkTile(passedTiles)

                            if (newX - prevX === i && prevY - newY === i) {
                                console.log(`moving ${i} tiles top right`)
                                // return true;
                                break;
                            } else if (newX - prevX === -i && prevY - newY === -i) {
                                console.log(`moving ${i} tiles bottom left`)
                                // return true;
                            } else if (newX - prevX === i && prevY - newY === -i) {
                                console.log(`moving ${i} tiles bottom right`)
                                // return true;
                            } else if (newX - prevX === -i && prevY - newY === i) {
                                console.log(`moving ${i} tiles top left`)
                                // return true;
                            } else {
                                // return false;
                            }
                        }
                    } else {
                        return false;
                    }
                    break;
                case 4: 
                    if (playerTurn) {
                        if ((prevX !== newX && prevY === newY) || (prevY !== newY && prevX === newX)) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                case 5: break;
                case 6: 
                    if (playerTurn) {
                        if ((newX === prevX - 1 || newX === prevX + 1 || newX === prevX) && (newY === prevY - 1 || newY === prevY + 1 || newY === prevY)) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                case 11: 
                    if(!playerTurn && prevX === newX) {
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
                    } else {
                        return false;
                    }
                case 12:
                    if (!playerTurn) {
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
                    } else {
                        return false;
                    }
                case 13: break;
                case 14: 
                    if (!playerTurn) {
                        if ((prevX !== newX && prevY === newY) || (prevY !== newY && prevX === newX)) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                case 15: break;
                case 16:
                    if (!playerTurn) {
                        if ((newX === prevX - 1 || newX === prevX + 1 || newX === prevX) && (newY === prevY - 1 || newY === prevY + 1 || newY === prevY)) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                default: return false;
            }

        // } else {
        //     return false;
        // }
    }
}