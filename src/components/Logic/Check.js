export default class Check {

    //Kopie von position erstellen
    //Zug in position Kopie simulieren
    //Gucken, ob nach simuliertem Zug König im Schach steht
    //Wenn ja: Abbrechen und original position nicht verändern
    //Wenn nein: Kopie von position in position einsetzen und Zug ausführen


    checkForCheck (position, playerTurn, simulatedTiles, setSimulatedTiles) {

        let king = 6;
        let activeKing = 6;
        let queen = 5;
        let rook = 4;
        let bishop = 3;
        let knight = 2;
        let pawn = 1;
        let kingPosition;
        let color = "white";

        // console.log(playerTurn)

        if (playerTurn) {
            king = 16;
            queen = 15;
            rook = 14;
            bishop = 13;
            knight = 12;
            pawn = 11;
            color = "black"

            // console.log("weis ist am zug")
        } else {
            // console.log("schwarz ist am zug")
            activeKing = 16;
        }

        //find position of king
        setSimulatedTiles([])
        let allSimulatedTiles = []
        for (let a =  0; a < 8; a++) {
            for (let b = 0; b < 8; b++) {
                // console.log([a, b])
                // if (position[i][j] === activeKing) {
                //     kingPosition = [i, j]
                // }

                let piece = position[b][a];

                switch (piece) {
                    //Pawn (white)
                    case 1:
                        if (playerTurn) {
                            //en passant
                            // if (b === 3 && b === pawnCanEnPassant.b) {
                            //     if (a - 1 === pawnCanEnPassant.a) {
                            //         allSimulatedTiles.push([b - 1, a - 1]]);
                            //     } else if (a + 1 === pawnCanEnPassant.a) {
                            //         allSimulatedTiles.push([b - 1, a + 1]]);
                            //     }  
                            // } 
                            //standing on starting rank (two steps possible)
                            if (b === 6) {
                                for (let i = 5; i >= 4; i--) {
                                    if (position[i][a] === 0) {
                                        allSimulatedTiles.push([i, a]);
                                    } else {
                                        break;
                                    }
                                }
                            } else if (position[b - 1][a] === 0) {
                                allSimulatedTiles.push([b - 1, a]);
                            }
                            //Check if piece can be captured
                            if (position[b - 1][a - 1] > 8) {
                                allSimulatedTiles.push([b - 1, a - 1]);
                            }
                            if (position[b - 1][a + 1] > 8) {
                                allSimulatedTiles.push([b - 1, a + 1]);
                            }
                        }
                        
                        break;
                    //Pawn (black)
                    case 11: 
                        if (!playerTurn) {
                            // //en passant
                            // if (b === 4 && b === pawnCanEnPassant.b) {
                            //     if (a - 1 === pawnCanEnPassant.a) {
                            //         allSimulatedTiles.push([b + 1, a - 1]);
                            //     } else if (a + 1 === pawnCanEnPassant.a) {
                            //         allSimulatedTiles.push([b + 1, a + 1]);
                            //     }  
                            // } 
                            //standing on starting rank (two moves possible)
                            if(b === 1) {
                                for (let i = 2; i <= 3; i++) {
                                    if (position[i][a] === 0) {
                                        allSimulatedTiles.push([i, a]);
                                    } else {
                                        break;
                                    }
                                }
                            } else if (position[b + 1][a] === 0) {
                                allSimulatedTiles.push([b + 1, a]);
                            }
                            //Check if piece can be captured
                            if (position[b + 1][a - 1] < 8 && position[b + 1][a - 1] > 0 ) {
                                allSimulatedTiles.push([b + 1, a - 1]);
                            }
                            if (position[b + 1][a + 1] < 8 && position[b + 1][a + 1] > 0) {
                                allSimulatedTiles.push([b + 1, a + 1]);
                            }
                        }
                        break;
                    //Knight (white and black)
                    case 2:
                    case 12:
                        if ((playerTurn && piece === 2) || (!playerTurn && piece === 12)) {
        
                            if (b + 1 < 8 && a + 2 < 8 && b + 1 >= 0 && a + 2 >= 0) {
                                if (position[b + 1][a + 2] === 0) {
                                    allSimulatedTiles.push([b + 1, a + 2]);
                                } else {
                                    allSimulatedTiles.push([b + 1, a + 2]);  
                                }
                            }
                            if (b - 1 < 8 && a + 2 < 8 && b - 1 >= 0 && a + 2 >= 0) {
                                if (position[b - 1][a + 2] === 0) {
                                    allSimulatedTiles.push([b - 1, a + 2]);
                                } else {
                                    allSimulatedTiles.push([b - 1, a + 2]);
                                }
                            }
                            if (b + 1 < 8 && a - 2 < 8 && b + 1 >= 0 && a - 2 >= 0) {
                                if (position[b + 1][a - 2] === 0) {
                                    allSimulatedTiles.push([b + 1, a - 2]);
                                } else {
                                    allSimulatedTiles.push([b + 1, a - 2]);
                                }
                            }
                            if (b - 1 < 8 && a - 2 < 8 && b - 1 >= 0 && a - 2 >= 0) {
                                if (position[b - 1][a - 2] === 0) {
                                    allSimulatedTiles.push([b - 1, a - 2]);
                                } else {
                                    allSimulatedTiles.push([b - 1, a - 2]);
                                }
                            }
        
        
                            if (b + 2 < 8 && a + 1 < 8 && b + 2 >= 0 && a + 1 >= 0) {
                                if (position[b + 2][a + 1] === 0) {
                                    allSimulatedTiles.push([b + 2, a + 1]);
                                } else {
                                    allSimulatedTiles.push([b + 2, a + 1]); 
                                }
                            }
                            if (b - 2 < 8 && a + 1 < 8 && b - 2 >= 0 && a + 1 >= 0) {
                                if (position[b - 2][a + 1] === 0) {
                                    allSimulatedTiles.push([b - 2, a + 1]);
                                } else {
                                    allSimulatedTiles.push([b - 2, a + 1]);
                                }
                            }
                            if (b + 2 < 8 && a - 1 < 8 && b + 2 >= 0 && a - 1 >= 0) {
                                if (position[b + 2][a - 1] === 0) {
                                    allSimulatedTiles.push([b + 2, a - 1]);
                                } else {
                                    allSimulatedTiles.push([b + 2, a - 1]);
                                }
                            }
                            if (b - 2 < 8 && a - 1 < 8 && b - 2 >= 0 && a - 1 >= 0) {
                                if (position[b - 2][a - 1] === 0) {
                                    allSimulatedTiles.push([b - 2, a - 1]);
                                } else {
                                    allSimulatedTiles.push([b - 2, a - 1]);
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
                                if (b + i < 8 && a + i < 8 && b + i >= 0 && a + i >= 0) {
                                    if (position[b + i][a + i] === 0) {
                                        allSimulatedTiles.push([b + i, a + i]);
                                    } else {
                                        allSimulatedTiles.push([b + i, a + i]);
                                        break;
                                    }
                                }
                            }
                            //top right    
                            for (let i = 1; i < 8; i++) {
                                if (b - i < 8 && a + i < 8 && b - i >= 0 && a + i >= 0) {
                                    if (position[b - i][a + i] === 0) {
                                        allSimulatedTiles.push([b - i, a + i]);
                                    } else {
                                        allSimulatedTiles.push([b - i, a + i]);
                                        break;
                                    }
                                }
                            }
                            //bottom left
                            for (let i = 1; i < 8; i++) {
                                if (b + i < 8 && a - i < 8 && b + i >= 0 && a - i >= 0) {
                                    if (position[b + i][a - i] === 0) {
                                        allSimulatedTiles.push([b + i, a - i]);
                                    } else {
                                        allSimulatedTiles.push([b + i, a - i]);
                                        break;
                                    }
                                }
                            }
                            //top left
                            for (let i = 1; i < 8; i++) {
                                if (b - i < 8 && a - i < 8 && b - i >= 0 && a - i >= 0) {
                                    if (position[b - i][a - i] === 0) {
                                        allSimulatedTiles.push([b - i, a - i]);
                                    } else {
                                        allSimulatedTiles.push([b - i, a - i]);
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
                            for (let i = b + 1; i < 8; i++) {
                                if (position[i][a] === 0) {
                                    allSimulatedTiles.push([i, a]);
                                } else {
                                    allSimulatedTiles.push([i, a]);
                                    break;
                                }
                            }
                            //up
                            for (let i = b - 1; i >= 0; i--) {
                                if (position[i][a] === 0) {
                                    allSimulatedTiles.push([i, a]);
                                } else {
                                    allSimulatedTiles.push([i, a]);
                                    break;
                                }
                            }
                            //right
                            for (let i = a + 1; i < 8; i++) {
                                if (position[b][i] === 0) {
                                    allSimulatedTiles.push([b, i]);
                                } else {
                                    allSimulatedTiles.push([b, i]);
                                    break;
                                }
                            }
                            //left
                            for (let i = a - 1; i >= 0; i--) {
                                if (position[b][i] === 0) {
                                    allSimulatedTiles.push([b, i]);
                                } else {
                                    allSimulatedTiles.push([b, i]);
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
                            for (let i = b + 1; i < 8; i++) {
                                if (position[i][a] === 0) {
                                    allSimulatedTiles.push([i, a]);
                                } else {
                                    allSimulatedTiles.push([i, a]);
                                    break;
                                }
                            }
                            //up
                            for (let i = b - 1; i >= 0; i--) {
                                if (position[i][a] === 0) {
                                    allSimulatedTiles.push([i, a]);
                                } else {
                                    allSimulatedTiles.push([i, a]);
                                    break;
                                }
                            }
                            //right
                            for (let i = a + 1; i < 8; i++) {
                                if (position[b][i] === 0) {
                                    allSimulatedTiles.push([b, i]);
                                } else {
                                    allSimulatedTiles.push([b, i]);
                                    break;
                                }
                            }
                            //left
                            for (let i = a - 1; i >= 0; i--) {
                                if (position[b][i] === 0) {
                                    allSimulatedTiles.push([b, i]);
                                } else {
                                    allSimulatedTiles.push([b, i]);
                                    break;
                                }
                            }
                            //bottom right
                            for (let i = 1; i < 8; i++) {
                                if (b + i < 8 && a + i < 8 && b + i >= 0 && a + i >= 0) {
                                    if (position[b + i][a + i] === 0) {
                                        allSimulatedTiles.push([b + i, a + i]);
                                    } else {
                                        allSimulatedTiles.push([b + i, a + i]);
                                        break
                                    }
                                }
                            }
                            //top right    
                            for (let i = 1; i < 8; i++) {
                                if (b - i < 8 && a + i < 8 && b - i >= 0 && a + i >= 0) {
                                    if (position[b - i][a + i] === 0) {
                                        allSimulatedTiles.push([b - i, a + i]);
                                    } else {
                                        allSimulatedTiles.push([b - i, a + i]);
                                        break
                                    }
                                }
                            }  
                            //bottom left
                            for (let i = 1; i < 8; i++) {
                                if (b + i < 8 && a - i < 8 && b + i >= 0 && a - i >= 0) {
                                    if (position[b + i][a - i] === 0) {
                                        allSimulatedTiles.push([b + i, a - i]);
                                    } else {
                                        allSimulatedTiles.push([b + i, a - i]);
                                        break
                                    }
                                }
                            }
                            //top left
                            for (let i = 1; i < 8; i++) {
                                if (b - i < 8 && a - i < 8 && b - i >= 0 && a - i >= 0) {
                                    if (position[b - i][a - i] === 0) {
                                        allSimulatedTiles.push([b - i, a - i]);
                                    } else {
                                        allSimulatedTiles.push([b - i, a - i]);
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
        
                            if (b - 1 < 8 && a + 1 < 8 && b - 1 >= 0 && a + 1 >= 0 && position[b - 1][a + 1] === 0) {
                                allSimulatedTiles.push([b - 1, a + 1]);
                            } else if (b - 1 < 8 && a + 1 < 8 && b - 1 >= 0 && a + 1 >= 0) {
                                allSimulatedTiles.push([b - 1, a + 1]);
                            }
                            if (a + 1 < 8 && a + 1 >= 0 && position[b][a + 1] === 0) {
                                allSimulatedTiles.push([b, a + 1]);
                            } else if (a + 1 < 8 && a + 1 >= 0) {
                                allSimulatedTiles.push([b, a + 1]);
                            }
                            if (b + 1 < 8 && a + 1 < 8 && b - 1 >= 0 && a + 1 >= 0 && position[b + 1][a + 1] === 0) {
                                allSimulatedTiles.push([b + 1, a + 1]);
                            } else if (b + 1 < 8 && a + 1 < 8 && b - 1 >= 0 && a + 1 >= 0) {
                                allSimulatedTiles.push([b + 1, a + 1]);
                            }
                            if (b + 1 < 8 && b + 1 >= 0 && position[b + 1][a] === 0) {
                                allSimulatedTiles.push([b + 1, a]);
                            } else if (b + 1 < 8 && b + 1 >= 0) {
                                allSimulatedTiles.push([b + 1, a]);
                            }
                            if (b + 1 < 8 && a - 1 < 8 && b + 1 >= 0 && a - 1 >= 0 && position[b + 1][a - 1] === 0) {
                                allSimulatedTiles.push([b + 1, a - 1]);
                            } else if (b + 1 < 8 && a - 1 < 8 && b + 1 >= 0 && a - 1 >= 0) {
                                allSimulatedTiles.push([b + 1, a - 1]);
                            }
                            if (a - 1 < 8 && a - 1 >= 0 && position[b][a - 1] === 0) {
                                allSimulatedTiles.push([b, a - 1]);
                            } else if (a - 1 < 8 && a - 1 >= 0) {
                                allSimulatedTiles.push([b, a - 1]);
                            }
                            if (b - 1 < 8 && a - 1 < 8 && b - 1 >= 0 && a - 1 >= 0 && position[b - 1][a - 1] === 0) {
                                allSimulatedTiles.push([b - 1, a - 1]);
                            } else if (b - 1 < 8 && a - 1 < 8 && b - 1 >= 0 && a - 1 >= 0) {
                                allSimulatedTiles.push([b - 1, a - 1]);
                            }
                            if (b - 1 < 8 && b - 1 >= 0 && position[b - 1][a] === 0) {
                                allSimulatedTiles.push([b - 1, a]);
                            } else if (b - 1 < 8 && b - 1 >= 0) {
                                allSimulatedTiles.push([b - 1, a]);
                            }
                            
                            
                            //check for castling
                            // if (piece === 6 && a === 4 && b === 7) {
                            //     if (castle.white.castleShort && position[7][5] === 0 && position[7][6] === 0 && position[7][7] === 4) {                              
                            //         allSimulatedTiles.push([b, a + 2]);
                            //     } 
                            
                            //     if (castle.white.castleLong && position[7][3] === 0 && position[7][2] === 0 && position[7][1] === 0 && position[7][0] === 4) {
                            //         allSimulatedTiles.push([b, a - 2]);                           
                            //     } 
                            // }
                            // if (piece === 16 && a === 4 && b === 0) {
                            //     if (castle.black.castleShort && position[0][5] === 0 && position[0][6] === 0 && position[0][7] === 14) {                              
                            //         allSimulatedTiles.push([b, a + 2]);
                            //     } 
                            
                            //     if (castle.black.castleLong && position[0][3] === 0 && position[0][2] === 0 && position[0][1] === 0 && position[0][0] === 14) {
                            //         allSimulatedTiles.push([b, a - 2]);                           
                            //     } 
                            // }
                        }
                        break;
                    default: break;
                }
            }
        }

        // console.log(allSimulatedTiles)
        // console.log(simulatedTiles)
        

        if (allSimulatedTiles.length > 0) {
            var uniques = [];
            var itemsFound = {};
            // console.log(allSimulatedTiles)
            for (let i = 0; i < allSimulatedTiles.length; i++) {

                

                let string = JSON.stringify(allSimulatedTiles[i])
                let y = string.charAt(1)
                let x = string.charAt(3)
  
                // console.log(y, x)
                // console.log(position[y][x] < 8 && position[y][x] > 0)

                //remove cuplicates from array
                if(itemsFound[string]) { continue; }
                uniques.push(allSimulatedTiles[i]);
                itemsFound[string] = true;

                if ((playerTurn && position[y][x] < 8 && position[y][x] > 0) || (!playerTurn && position[y][x] > 8)) {
                    // console.log("splice bei " + i)
                    uniques.splice(i, 1);
                }

            }
            // console.log(uniques)
        }
    }
}

//organisch