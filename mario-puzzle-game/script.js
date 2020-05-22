const pieces = [];

var firstSelectedPiece = undefined;
var secondSeletecPiece = undefined;

// Create a puzzle with size 4 x 4
window.onload = () => {
  for (r = 1; r <= 4; r++) {
    for (c = 1; c <= 4; c++) {
      const pieceElement = document.createElement('div');
      pieceElement.setAttribute('id', `piece${r}-${c}`);
      pieceElement.classList.add('piece');
      pieceElement.setAttribute('style', `--r: ${r}; --c: ${c}`);
      pieceElement.addEventListener('click', (e) => { makePlay(e) });

      document.querySelector('.container').appendChild(pieceElement);
    }
  }
};

handleStartGame = async () => {
  document.querySelector('.overlay').style.display = 'none';
  document.querySelector('.overlay button').remove();
  document.querySelector('.container').classList.add('playing');

  setTimeout(async () => {
    await fillPiecesList();
    shufflePieces();
  }, 500);
}

fillPiecesList = async () => {
  document.querySelectorAll('.piece').forEach((e) => {
    pieces.push({
      id: e.id,
      initial: { top: e.offsetTop, left: e.offsetLeft },
      current: {}
    });
  });
}

shufflePieces = () => {
  pieces.forEach((piece) => {
    let randomPosition;
    let validPosition = false;

    while(!validPosition) {
      randomPosition = pieces[Math.floor(Math.random() * pieces.length)];

      const usedPosition = pieces.some((p) => (
        p.current.top === randomPosition.initial.top 
          && p.current.left === randomPosition.initial.left
      ));

      validPosition = !usedPosition;
    }

    piece.current = {
      top: randomPosition.initial.top,
      left: randomPosition.initial.left,
    }

    document.querySelector(`#${piece.id}`).style.transform = `translate(
      ${piece.current.left - piece.initial.left}px, 
      ${piece.current.top - piece.initial.top}px
    )`;
  });
}

makePlay = (e) => {
  e.target.classList.toggle('selected');

  const { id, offsetTop, offsetLeft } = e.target;

  if (!firstSelectedPiece) {
    firstSelectedPiece = { id: id, top: offsetTop, left: offsetLeft };
  } else if (!secondSeletecPiece) {
    secondSeletecPiece = { id: id, top: offsetTop, left: offsetLeft };

    const firstPiecePositions = getPiecePositions(firstSelectedPiece.id, firstSelectedPiece);
    const secondPiecePositions = getPiecePositions(secondSeletecPiece.id, secondSeletecPiece);

    movePieces(firstPiecePositions, secondPiecePositions);

    updatePiecePositions(firstSelectedPiece.id, secondPiecePositions.current);
    updatePiecePositions(secondSeletecPiece.id, firstPiecePositions.current);

    firstSelectedPiece = undefined;
    secondSeletecPiece = undefined;
    
    document.querySelectorAll('.selected').forEach((element) => {
      element.classList.toggle('selected');
    });

    checkGameEnded();
  }
}

getPiecePositions = (id, defaultPositions) => {
  const { top, left } = defaultPositions;

  let piece = pieces.find((p) => p.id === id);

  if (!piece) {
    piece = {
      id: id,
      initial: { top, left },
      current: { top, left }
    };

    pieces.push(piece);
  }

  return Object.assign({}, piece);
}

movePieces = (firstPiecePositions, secondPiecePositions) => {
  const elementPiece1 = document.querySelector(`#${firstSelectedPiece.id}`);
  const elementPiece2 = document.querySelector(`#${secondSeletecPiece.id}`);

  elementPiece1.style.transform = `translate(
    ${secondPiecePositions.current.left - firstPiecePositions.initial.left}px, 
    ${secondPiecePositions.current.top - firstPiecePositions.initial.top}px
  )`;

  elementPiece2.style.transform = `translate(
    ${firstPiecePositions.current.left - secondPiecePositions.initial.left}px, 
    ${firstPiecePositions.current.top - secondPiecePositions.initial.top}px
  )`;
}

updatePiecePositions = (id, newPositions) => {
  const { top, left } = newPositions;

  const index = pieces.findIndex((p) => p.id === id);

  pieces[index].current = { top, left };
}

checkGameEnded = () => {
  const gameEnded = pieces.every((piece) => (
    piece.initial.top === piece.current.top && piece.initial.left === piece.current.left
  ));

  if (gameEnded) {
    document.querySelector('.container').classList.remove('playing');
    
    setTimeout(() => { 
      const successMessage = document.createElement('h1');
      successMessage.classList.add('success-message');
      successMessage.innerHTML = '<strong>Parabéns !</strong> Você conseguiu montar o quebra-cabeça !!!';

      document.querySelector('.overlay').appendChild(successMessage);
      document.querySelector('.overlay').style.display = 'flex';
    }, 1000);
  }
} 