export const fetchInput = async (day: number) => {
    try {
        const response = await fetch(`https://adventofcode.com/2024/day/${day}/input`, {
            headers: {
            'Cookie': `session=${process.env.SESSION_COOKIE}`
            }
        })
        const text = await response.text();
        return text;
    } catch (error) {
        console.error("Error fetching input", error);
    }
}