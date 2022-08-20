import {pW, pB, knW, knB, bW, bB, rW, rB, qW, qB, kW, kB, empty} from './pieceDeclaration';

export const initialPosition = [
    [rB,knB,bB,qB,kB,bB,knB,rB],
    [pB,pB,pB,pB,pB,pB,pB,pB],
    [empty,empty,empty,empty,empty,empty,empty,empty],
    [empty,empty,empty,empty,empty,empty,empty,empty],
    [empty,empty,empty,empty,empty,empty,empty,empty],
    [empty,empty,empty,empty,empty,empty,empty,empty],
    [pW,pW,pW,pW,pW,pW,pW,pW],
    [rW,knW,bW,qW,kW,bW,knW,rW],
]

export const initialActivePiece = {
    isActive: false,
    ref: null,
    piece: null,
    positionX: null,
    positionY: null,
    counter: 0
}

export const initialLastMove = ({
    oldPositionX: null,
    oldPositionY: null,
    newPositionX: null,
    newPositionY: null
})

export const initialPawnIsPromoting = ({
    isPromoting: false,
    color: null,
    posX: null,
    posY: null,
    prevX: null,
    prevY: null,
    capturedPiece: null,
    showPromotionMenu: false,
    newPiece: null,
});

export const initialPawnCanEnPassant = ({
    isActive: false,
    posX: null,
    posY: null
})

export const initialCastle = ({
    white: {
        castleLong: true,
        castleShort: true,
    },
    black: {
        castleLong: true,
        castleShort: true
    },
    isCastling: false,
})

export const initialGameOver = {
    gameOver: false,
    reason: undefined,
    winner: undefined
};

export const initialPlayerNames = {
    white: "White",
    black: "Black"
}

export const initialHoveredTile = {
    isHovering: false,
    x: null,
    y: null
}