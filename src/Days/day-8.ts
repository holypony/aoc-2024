import { fetchInput } from "../Utils/fetch-input";

export const mainDayEight = async () => {
    const input = await fetchInput(8);
    
    const lines = input.trim().split('\n');
    const grid = lines.map(line => [...line]);
    

    const antennas = new Map<string, [number, number][]>();
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] !== '.') {
                const char = grid[row][col];
                if (!antennas.has(char)) antennas.set(char, []);
                antennas.get(char)?.push([row, col]);
            }
        }
    }
    console.log("antennas", antennas);

    const antiNodes = new Set<string>();

    // for (const positions of antennas.values()) {
    // for (let i = 0; i < positions.length; i++) {
    //     for (let j = i + 1; j < positions.length; j++) {
    //         const pos1 = positions[i];
    //         const pos2 = positions[j];
            
    //         
    //         const deltaRow = pos2[0] - pos1[0];
    //         const deltaCol = pos2[1] - pos1[1];
            
    //         // Find anti-nodes by extending line in both directions
    //         const antiNode1 = [pos1[0] - deltaRow, pos1[1] - deltaCol];
    //         const antiNode2 = [pos2[0] + deltaRow, pos2[1] + deltaCol];
            
    //         
    //         if (isInBounds(antiNode1, grid)) {
    //             antiNodes.add(`${antiNode1[0]},${antiNode1[1]}`);
    //         }
    //         if (isInBounds(antiNode2, grid)) {
    //             antiNodes.add(`${antiNode2[0]},${antiNode2[1]}`);
    //         }
    //     }
    //     }
    // }

    for (const positions of antennas.values()) {
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const pos1 = positions[i];
                const pos2 = positions[j];
                
                const deltaRow = pos2[0] - pos1[0];
                const deltaCol = pos2[1] - pos1[1];

                let antiNode1Row = pos1[0];
                let antiNode1Col = pos1[1];
                while (isInBounds([antiNode1Row, antiNode1Col], grid)) {
                    antiNodes.add(`${antiNode1Row},${antiNode1Col}`);
                    console.log("antiNode1", antiNode1Row, antiNode1Col);
                    antiNode1Row -= deltaRow;
                    antiNode1Col -= deltaCol;
                }

                let antiNode2Row = pos2[0];
                let antiNode2Col = pos2[1];
                while (isInBounds([antiNode2Row, antiNode2Col], grid)) {
                    antiNodes.add(`${antiNode2Row},${antiNode2Col}`);
                    antiNode2Row += deltaRow;
                    antiNode2Col += deltaCol;
                }
            }
        }
    }

    return antiNodes.size;
}

function isInBounds(point: number[], grid: string[][]): boolean {
    const [row, col] = point;
    return row >= 0 && 
           row < grid.length && 
           col >= 0 && 
           col < grid[0].length;
}