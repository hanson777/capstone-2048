const board = [];
    const boardEl = document.getElementById('game-board');
    const gameOverEl = document.getElementById('game-over');

    function initBoard() {
      for (let i = 0; i < 4; i++) {
        board[i] = [];
        for (let j = 0; j < 4; j++) {
          board[i][j] = 0;
        }
      }
      addTile();
      addTile();
      drawBackground();
      drawTiles();
      gameOverEl.style.display = 'none';
    }

    function drawBackground() {
      boardEl.innerHTML = '';
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const tileBg = document.createElement('div');
          tileBg.className = 'tile-bg';
          boardEl.appendChild(tileBg);
        }
      }
    }

    function addTile() {
      let empty = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] === 0) empty.push([i, j]);
        }
      }
      if (empty.length === 0) return;
      const [x, y] = empty[Math.floor(Math.random() * empty.length)];
      board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }

    function drawTiles() {
      document.querySelectorAll('.tile').forEach(el => el.remove());
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const val = board[i][j];
          if (val === 0) continue;
          const tile = document.createElement('div');
          tile.className = 'tile tile-' + val;
          tile.textContent = val;
          tile.style.transform = `translate(${j * 110}px, ${i * 110}px)`;
          document.getElementById('game-container').appendChild(tile);
        }
      }
    }

    function canMove() {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] === 0) return true;
          if (j < 3 && board[i][j] === board[i][j + 1]) return true;
          if (i < 3 && board[i][j] === board[i + 1][j]) return true;
        }
      }
      return false;
    }

    function move(dir) {
      let moved = false;
      let hasMerged = [...Array(4)].map(() => Array(4).fill(false));
      const dx = { ArrowLeft: 0, ArrowRight: 0, ArrowUp: -1, ArrowDown: 1 };
      const dy = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 0, ArrowDown: 0 };
      const range = [0, 1, 2, 3];
      if (dir === 'ArrowRight' || dir === 'ArrowDown') range.reverse();

      for (let x of range) {
        for (let y of range) {
          let i = x, j = y;
          if (board[i][j] === 0) continue;
          let ni = i + dx[dir], nj = j + dy[dir];
          while (ni >= 0 && ni < 4 && nj >= 0 && nj < 4) {
            if (board[ni][nj] === 0) {
              board[ni][nj] = board[i][j];
              board[i][j] = 0;
              i = ni; j = nj;
              ni = i + dx[dir]; nj = j + dy[dir];
              moved = true;
            } else if (board[ni][nj] === board[i][j] && !hasMerged[ni][nj]) {
              board[ni][nj] *= 2;
              board[i][j] = 0;
              hasMerged[ni][nj] = true;
              moved = true;
              break;
            } else break;
          }
        }
      }

      if (moved) {
        addTile();
        drawTiles();
        if (!canMove()) {
          gameOverEl.style.display = 'block';
        }
      }
    }

    function restartGame() {
      initBoard();
    }

    document.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        move(e.key);
      }
    });

    initBoard();