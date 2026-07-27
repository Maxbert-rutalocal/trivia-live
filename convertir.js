const fs = require('fs');

try {
    let contenido = fs.readFileSync('preguntas_crudas.json', 'utf8');

    // 1. APLANADORA: Busca el final de una pregunta '}' y el inicio de la siguiente '"Categoria"' 
    // y DESTRUYE cualquier coma, corchete o llave extra que haya quedado en medio por error.
    contenido = contenido.replace(/\}\s*[,\[\]\{\s]*\s*"Categoria"/g, '},\n  {\n    "Categoria"');

    // 2. Limpia si el mismísimo principio del archivo quedó roto
    contenido = contenido.replace(/^[\s,\[\{]*"Categoria"/, '[\n  {\n    "Categoria"');

    // 3. Limpia si el mismísimo final del archivo quedó roto
    contenido = contenido.replace(/\}\s*[,\[\]\{\s]*$/, '\n  }\n]');

    // 4. Se asegura de que empiece y termine con corchetes de lista
    if (!contenido.trim().startsWith('[')) contenido = '[\n' + contenido;
    if (!contenido.trim().endsWith(']')) contenido = contenido + '\n]';

    let datosLista;
    try {
        datosLista = JSON.parse(contenido);
    } catch (e) {
        const match = e.message.match(/position (\d+)/);
        if (match) {
            const pos = parseInt(match[1]);
            const snippet = contenido.substring(Math.max(0, pos - 150), Math.min(contenido.length, pos + 150));
            console.error("❌ Aún hay un error en esta zona:\n-----------------------------------\n" + snippet + "\n-----------------------------------");
        }
        throw e;
    }

    const formatoCorrecto = {
        general: { facil: [], medio: [], dificil: [] },
        geografia: { facil: [], medio: [], dificil: [] },
        entretenimiento: { facil: [], medio: [], dificil: [] },
        ciencia: { facil: [], medio: [], dificil: [] }
    };

    let procesadas = 0;

    datosLista.forEach(item => {
        let cat = item.Categoria ? item.Categoria.toLowerCase() : 'general';
        let dif = item.Dificultad ? item.Dificultad.toLowerCase() : 'facil';
        
        // Seguro contra errores tipográficos en las categorías
        if (!formatoCorrecto[cat]) cat = 'general';
        if (!formatoCorrecto[cat][dif]) dif = 'facil';
        
        if (item.Pregunta && item.Respuesta) {
            formatoCorrecto[cat][dif].push({
                p: item.Pregunta,
                o: [item.OpcionA || "A) -", item.OpcionB || "B) -", item.OpcionC || "C) -"],
                r: item.Respuesta
            });
            procesadas++;
        }
    });

    fs.writeFileSync('preguntas.json', JSON.stringify(formatoCorrecto, null, 2));
    console.log(`\n✅ ¡VICTORIA! El archivo fue reparado a la fuerza. Se procesaron y empaquetaron ${procesadas} preguntas listas para tu juego.\n`);

} catch (error) {
    console.error("\n❌ Error final:", error.message);
}