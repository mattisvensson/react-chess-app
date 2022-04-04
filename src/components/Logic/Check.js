import Rules from "./Rules";

export default class Check {

    checkForCheck (position, setSimulatedTilesWhite, setSimulatedTilesBlack, setPlayerIsInCheck, castle, pawnCanEnPassant) {

        const rules = new Rules()

        console.log("checking for checks...")

        let whiteKingPosition;
        let blackKingPosition;

        let playerTurn = true;

        let simulatedTilesWhite = []
        let simulatedTilesBlack = []

        let whiteIsInCheck = false;
        let blackIsInCheck = false;

        for (let c = 0; c < 2; c++) {

            setSimulatedTilesWhite([])
            setSimulatedTilesBlack([])
            
            let allSimulatedTiles = []

            for (let posX =  0; posX < 8; posX++) {
                for (let posY = 0; posY < 8; posY++) {
                    
                    //find position of king
                    if (position[posY][posX] === 6) {
                        whiteKingPosition = [posY, posX];
                    }
                    if (position[posY][posX] === 16) {
                        blackKingPosition = [posY, posX]
                    }

                    // console.log(allSimulatedTiles)
                    let piece = position[posY][posX];

                    switch (piece) {
                        case 1: 
                            if (playerTurn && piece === 1) {
                                const pawnWhite = rules.pawnWhiteMove(posX, posY, position, pawnCanEnPassant)
                                // console.log(pawnWhite)
                                allSimulatedTiles = [...allSimulatedTiles, ...pawnWhite]
                            }
                            break;
                        case 11: 
                            if (!playerTurn && piece === 11) {
                                const pawnBlack = rules.pawnBlackMove(posX, posY, position, pawnCanEnPassant)
                                allSimulatedTiles = [...allSimulatedTiles, ...pawnBlack]
                            }
                            break;
                        case 2:
                        case 12: 
                            if ((playerTurn && piece === 2) || (!playerTurn && piece === 12)) {
                                const knight = rules.knightMove(posX, posY, position)
                                allSimulatedTiles = [...allSimulatedTiles, ...knight]
                            }
                            break;
                        case 3:
                        case 13: 
                            if ((playerTurn && piece === 3) || (!playerTurn && piece === 13)) {
                                const bishop = rules.bishopMove(posX, posY, position)
                                allSimulatedTiles = [...allSimulatedTiles, ...bishop]
                            }
                            break;
                        case 4:
                        case 14: 
                            if ((playerTurn && piece === 4) || (!playerTurn && piece === 14)) {
                                const rook = rules.rookMove(posX, posY, position)
                                allSimulatedTiles = [...allSimulatedTiles, ...rook]
                            }
                            break;
                        case 5:
                        case 15: 
                            if ((playerTurn && piece === 5) || (!playerTurn && piece === 15)) {
                                const queen = rules.queenMove(posX, posY, position)
                                allSimulatedTiles = [...allSimulatedTiles, ...queen]
                            }
                            break;
                        case 6:
                        case 16: 
                            if ((playerTurn && piece === 6) || (!playerTurn && piece === 16)) {
                                const king = rules.kingMove(posX, posY, position, piece, castle)
                                allSimulatedTiles = [...allSimulatedTiles, ...king]
                            }
                            break;
                        default: break;
                    }
                }
            }  

            //remove tile if its white turn und on the tile is a white piece (same for black)
            if (allSimulatedTiles.length > 0) {

                let itemsFound = {};

                for (let i = 0; i < allSimulatedTiles.length; i++) {

                    let string = JSON.stringify(allSimulatedTiles[i])
                    let y = string.charAt(1)
                    let x = string.charAt(3)

                    if ((!playerTurn && position[y][x] > 8) || (playerTurn && position[y][x] < 8 && position[y][x] > 0)) {
                        allSimulatedTiles.splice(i, 1);
                        i--
                    }

                }
                
                // remove duplicates from array
                for (let i = 0; i < allSimulatedTiles.length; i++) {
        
                    let string = JSON.stringify(allSimulatedTiles[i])

                    if(itemsFound[string]) { continue; }
                    if (playerTurn) {
                        simulatedTilesWhite.push(allSimulatedTiles[i]);
                    } else {
                        simulatedTilesBlack.push(allSimulatedTiles[i]);
                    }
                    itemsFound[string] = true;
                }

                setSimulatedTilesWhite(simulatedTilesWhite)
                setSimulatedTilesBlack(simulatedTilesBlack)

                //check if player is in check
                for (let i = 0; i < simulatedTilesWhite.length; i++) {
                    if (JSON.stringify(simulatedTilesWhite[i]) === JSON.stringify(blackKingPosition)) {
                        blackIsInCheck = true;
                        break;
                    } 
                }
                for (let i = 0; i < simulatedTilesBlack.length; i++) {
                    if (JSON.stringify(simulatedTilesBlack[i]) === JSON.stringify(whiteKingPosition)) {
                        whiteIsInCheck = true;
                        break;
                    } 
                }
            }
            playerTurn = false;
        }
                
        console.log("Whites moves:")
        console.log(simulatedTilesWhite)
        console.log("Blacks moves:")
        console.log(simulatedTilesBlack)

        if (playerTurn && whiteIsInCheck) {
            console.log("white is in check")
            setPlayerIsInCheck("white")
            return "check"
        } else if (!playerTurn && blackIsInCheck) {
            console.log("black is in check")
            setPlayerIsInCheck("black")
            return "check"
        } else {
            console.log("no checks")
            return "no check"
        }
    }




    checkForKingMoves (position, setSimulatedTilesKing, simulatedTilesWhite, simulatedTilesBlack, castle, playerTurn) {

        console.log("checking for king moves...")

        const rules = new Rules()

        let king;
        let kingPosition;
        let simulatedTiles;
        let simulatedTilesKing = [];
        let allSimulatedTilesKing = [];
        let playerIsInCheck = false;

        console.log(simulatedTilesWhite)
        console.log(simulatedTilesBlack)
        
        if (playerTurn) {
            king = 6;
            simulatedTiles = simulatedTilesBlack;
        } else {
            king = 16;
            simulatedTiles = simulatedTilesWhite;
        }
        
        for (let posX =  0; posX < 8; posX++) {
            for (let posY = 0; posY < 8; posY++) {
                
                //find position of king
                if (position[posY][posX] === king) {
                    kingPosition = [posY, posX];
                }
            }
        }
        // console.log(kingPosition)
        
        const kingMove = rules.kingMove(kingPosition[1], kingPosition[0], position, king, castle)
        allSimulatedTilesKing = [...allSimulatedTilesKing, ...kingMove]


        //remove tile if its white turn und on the tile is a white piece (same for black)
        if (allSimulatedTilesKing.length > 0) {

            let itemsFound = {};

            for (let i = 0; i < allSimulatedTilesKing.length; i++) {

                let string = JSON.stringify(allSimulatedTilesKing[i])
                let y = string.charAt(1)
                let x = string.charAt(3)

                if ((!playerTurn && position[y][x] > 8) || (playerTurn && position[y][x] < 8 && position[y][x] > 0)) {
                    allSimulatedTilesKing.splice(i, 1);
                    i--
                }
            }
            
            // remove duplicates from array
            for (let i = 0; i < allSimulatedTilesKing.length; i++) {
    
                let string = JSON.stringify(allSimulatedTilesKing[i])

                if(itemsFound[string]) { continue; }
                simulatedTilesKing.push(allSimulatedTilesKing[i]);
                itemsFound[string] = true;
            }

            setSimulatedTilesKing(simulatedTilesKing)

            //check if player is in check
            // console.log(simulatedTiles)
            for (let i = 0; i < simulatedTiles.length; i++) {
                // console.log(simulatedTiles[i], kingPosition)
                if (JSON.stringify(simulatedTiles[i]) === JSON.stringify(kingPosition)) {
                    playerIsInCheck = true;
                    break;
                } 
            }
        }
    

        if (playerIsInCheck) {
            console.log("player is in check")
            return "check"
        } else {
            console.log("no checks with king")
            return "no check"
        }

    }
}