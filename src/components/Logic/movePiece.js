//move piece
function movePiece (e, activePiece, BoardRef, pieceIsDagged) {
    console.log("movePiece: " + pieceIsDagged)
    if (pieceIsDagged) {

        //get coordinates of mouse
        const mouseX = e.clientX - 40;
        const mouseY = e.clientY - 40;

        //get borders of the board
        const minX = BoardRef.current.offsetLeft;
        const maxX = BoardRef.current.offsetLeft + 800;
        const minY = BoardRef.current.offsetTop;
        const maxY = BoardRef.current.offsetTop + 800;

        if (activePiece.isActive && pieceIsDagged) {

            //set piece position to mouse position
            activePiece.isActive.style.position = "absolute";
            activePiece.isActive.style.left = mouseX + "px";
            activePiece.isActive.style.top = mouseY + "px";

            //stop piece from following the mouse if mouse is outside of the board
            if (mouseX < minX) {activePiece.isActive.style.left = minX - 20 + "px";}
            if (mouseX + 60 > maxX) {activePiece.isActive.style.left = maxX - 70 + "px";}
            if (mouseY < minY) {activePiece.isActive.style.top = minY - 10 + "px";}
            if (mouseY + 70 > maxY) {activePiece.isActive.style.top = maxY - 70 + "px";}
        }
    }
}

export default movePiece;