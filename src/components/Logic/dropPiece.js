import executeMove from "./executeMove";

function dropPiece (e) {
        
    // console.log(possibleTiles)
    // console.log(possibleCaptures)

    if (e.target === activePiece.isActive && activePiece.counter > 0) {

        const updatePiece = {
            ...activePiece,
            isActive: false,
            piece: null,
            positionX: null,
            positionY: null,
            counter: 0
        }
        setActivePiece(updatePiece)

        setPossibleTiles([]);
        setPossibleCaptures([])
    } else {
        const updatePiece = {
            ...activePiece,
            counter: 1
        }
        setActivePiece(updatePiece)
    }
    
    if (activePiece.isActive && BoardRef) {

        const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
        const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);

        executeMove(x, y);

    }
}

export default dropPiece;