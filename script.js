let fields = [
    null, null, null,
    null, null, null,
    null, null, null
];

let currentPlayer = 'O'; // Startspieler
let isGameOver = false;  // Variable zur Überprüfung, ob das Spiel vorbei ist

function init() {
    render();
}

function render() {
    let html = '<table>';

    for (let i = 0; i < 3; i++) {
        html += '<tr>';

        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = '';

            if (fields[index] === 'O') {
                symbol = createCircleSVG();
            } else if (fields[index] === 'X') {
                symbol = createXSVG();
            }

            html += `<td onclick="handleClick(${index}, this)">${symbol}</td>`;
        }

        html += '</tr>';
    }

    html += '</table>';

    document.getElementById('content').innerHTML = html;
}

function handleClick(index, cell) {
    // Wenn das Spiel vorbei ist oder das Feld bereits besetzt ist, keine weitere Aktion ausführen
    if (isGameOver || fields[index] !== null) {
        return;
    }

    fields[index] = currentPlayer;

    if (currentPlayer === 'O') {
        cell.innerHTML = createCircleSVG();
    } else {
        cell.innerHTML = createXSVG();
    }

    cell.onclick = null;

    // Überprüfe, ob das Spiel vorbei ist
    const winningLine = checkGameOver();
    if (winningLine) {
        drawWinningLine(winningLine);
        isGameOver = true; // Spiel als beendet markieren
        return;
    }

    // Spieler wechseln
    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
}

function createCircleSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="lightblue" stroke-width="10" fill="none">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0, 282.6" 
                    to="282.6, 0" 
                    dur="0.5s" 
                    fill="freeze" />
            </circle>
        </svg>
    `;
}

function createXSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100">
            <line x1="20" y1="20" x2="80" y2="80" stroke="yellow" stroke-width="10">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0, 84.85" 
                    to="84.85, 0" 
                    dur="0.5s" 
                    fill="freeze" />
            </line>
            <line x1="80" y1="20" x2="20" y2="80" stroke="yellow" stroke-width="10">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0, 84.85" 
                    to="84.85, 0" 
                    dur="0.5s" 
                    begin="0.1s" 
                    fill="freeze" />
            </line>
        </svg>
    `;
}

function checkGameOver() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Reihen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Reihen
        [0, 4, 8], [2, 4, 6]             // Diagonalen
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return combination; // Gibt die Siegkombination zurück
        }
    }

    return null; // Kein Gewinn
}

function drawWinningLine(winningLine) {
    const content = document.getElementById('content');
    const cells = content.getElementsByTagName('td');

    const [start, , end] = winningLine;

    // Hole die Position und Größe des Start- und Endzellen
    const startCell = cells[start].getBoundingClientRect();
    const endCell = cells[end].getBoundingClientRect();

    // Berechne die Mitte der Start- und Endzellen
    const startX = startCell.left + startCell.width / 2;
    const startY = startCell.top + startCell.height / 2;
    const endX = endCell.left + endCell.width / 2;
    const endY = endCell.top + endCell.height / 2;

    // Erstelle ein SVG-Element für die Linie
    const svgLine = `
        <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;">
            <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="white" stroke-width="5">
                <animate 
                    attributeName="x2" from="${startX}" to="${endX}" dur="0.5s" fill="freeze" />
                <animate 
                    attributeName="y2" from="${startY}" to="${endY}" dur="0.5s" fill="freeze" />
            </line>
        </svg>
    `;

    // Füge die Linie in den content-Div ein
    content.innerHTML += svgLine;
}

function restartGame() {
    // Setze das Spielfeld zurück
    fields = [
        null, null, null,
        null, null, null,
        null, null, null
    ];

    // Setze den Spielstatus zurück
    isGameOver = false;

    // Setze den Startspieler zurück
    currentPlayer = 'O';

    // Render das Spielfeld erneut
    render();
}


// Initiales Rendern
init();