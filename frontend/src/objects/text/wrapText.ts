export function wrapText(
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
): string[] {

    const result: string[] = [];

    const paragraphs = text.split("\n");

    for (const paragraph of paragraphs) {

        // Preserve empty lines.
        if (paragraph.length === 0) {
            result.push("");
            continue;
        }

        const words = paragraph.split(" ");

        let line = "";

        for (const word of words) {

            const testLine =
                line.length === 0
                    ? word
                    : `${line} ${word}`;

            if (
                context.measureText(testLine).width <= maxWidth
            ) {
                line = testLine;
                continue;
            }

            /*
             * The whole word doesn't fit.
             *
             * If we already have text on this line,
             * finish that line first.
             */
            if (line.length > 0) {
                result.push(line);
                line = "";
            }

            /*
             * The word itself may be wider than maxWidth.
             * Break it character-by-character.
             */
            let chunk = "";

            for (const character of word) {

                const testChunk =
                    chunk + character;

                if (
                    context.measureText(testChunk).width <= maxWidth
                    || chunk.length === 0
                ) {
                    chunk = testChunk;
                } else {
                    result.push(chunk);
                    chunk = character;
                }
            }

            line = chunk;
        }

        if (line.length > 0) {
            result.push(line);
        }
    }

    return result;
}