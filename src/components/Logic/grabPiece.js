import executeMove from "./executeMove"


//grabbing the piece
function grabPiece (e, BoardRef, activePiece, position, setPossibleTiles, setPossibleCaptures, setActivePiece, setPieceIsDragged) {

    if (e.target.classList.contains("piece")) {

        //Reset possible Tiles and captures
        setPossibleTiles([]);
        setPossibleCaptures([])
    
        //get coordinates of mouse
        const mouseX = e.clientX - 40;
        const mouseY = e.clientY - 40;

        //set piece position to mouse position
        e.target.style.position = "absolute";
        e.target.style.left = mouseX + "px";
        e.target.style.top = mouseY + "px";

        //get tile on which the piece was standing
        const currentX = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
        const currentY = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);

        //set active piece
        let samePiece = false;
        (e.target === activePiece.isActive) ? samePiece = true : samePiece = false;

        if (samePiece) {
            const updatePiece = {
                ...activePiece,
                isActive: e.target,
                piece: position[currentY][currentX],
                positionX: currentX,
                positionY: currentY,
            }
            setActivePiece(updatePiece)
        } else {
            const updatePiece = {
                ...activePiece,
                isActive: e.target,
                piece: position[currentY][currentX],
                positionX: currentX,
                positionY: currentY,
                counter: 0
            }
            setActivePiece(updatePiece)
        }

        setPieceIsDragged(true)

    } else if (activePiece.isActive) {
        
        const x = Math.floor((e.clientX - BoardRef.current.offsetLeft) / 100);
        const y = Math.floor((e.clientY - BoardRef.current.offsetTop) / 100);

        executeMove(x, y)

    }
}

export default grabPiece;