export default class Check {
    checkForCheck (position, playerTurn, playerIsInCheck, setPlayerIsInCheck) {
        let king = 6;
        let activeKing = 6;
        let queen = 5;
        let rook = 4;
        let bishop = 3;
        let knight = 2;
        let pawn = 1;
        let kingPosition;
        let color = "white";


        if (playerTurn) {
            king = 16;
            queen = 15;
            rook = 14;
            bishop = 13;
            knight = 12;
            pawn = 11;
            color = "black"

            console.log("weis ist am zug")
        } else {
            console.log("schwarz ist am zug")
        }

        //find position of king
        for (let i =  0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (position[i][j] === activeKing) {
                    kingPosition = [i, j]
                }
            }
        }

        console.log(kingPosition)

        //check for queen and rook
        for (let i = kingPosition[0] - 1; i >= 0; i--) {
            console.log("drin")
            if (position[i][kingPosition[1]] === 0) {
                console.log("schach")
                const updateCheck = {
                    ...playerIsInCheck,
                    inCheck: true,
                    player: color,
                }
                setPlayerIsInCheck(updateCheck)
            } else if (position[i][kingPosition[1]] === rook) {
                break;
            } else {
                console.log("kein schach")
                const updateCheck = {
                    ...playerIsInCheck,
                    inCheck: false,
                    player: null,
                }
                setPlayerIsInCheck(updateCheck)
                break;
            }
        }
        // for (let i = kingPosition[0] + 1; i <= 7; i++) {
        //     if (position[i][kingPosition[1]] === 0) {
        //         console.log("schach")
        //         const updateCheck = {
        //             ...playerIsInCheck,
        //             inCheck: true,
        //             player: color,
        //         }
        //         setPlayerIsInCheck(updateCheck)
        //     } else if (position[i][kingPosition[1]] === rook) {
        //         break;
        //     } else {
        //         console.log("kein schach")
        //         const updateCheck = {
        //             ...playerIsInCheck,
        //             inCheck: false,
        //             player: null,
        //         }
        //         setPlayerIsInCheck(updateCheck)
        //         break;
        //     }
        // }
    }
}