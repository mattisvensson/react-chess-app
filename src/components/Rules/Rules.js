export default class Rules {
    checkMove(prevX, prevY, newX, newY, piece, playerTurn) {
        console.log("prev location " + prevX, prevY);
        console.log("new location " + newX,  newY);
        console.log("piece " + piece);

        switch (piece) {
            case 1: 
                if(playerTurn && prevX === newX) {
                    if(prevY === 6) {
                        if (prevY - newY === 1 || prevY - newY === 2) {
                            console.log("valid")
                            return true;
                        } else {
                            console.log("not allowed")
                            return false;
                        }
                    } else if (prevY - newY === 1) {
                        console.log("valid")
                        return true;
                    } else {
                        console.log("not allowed")
                        return false;
                    }
                } else {
                    console.log("not allowed")
                    return false;
                }
            
            
            break;
            case 2: break;
            case 3: break;
            case 4: ;break;
            case 5: break;
            case 6: break;
            case 11: break;
            case 12: break;
            case 13: break;
            case 14: break;
            case 15: break;
            case 16: break;
        }
    }
}