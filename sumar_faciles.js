const fs = require('fs');

try {
    // 1. Lee el archivo maestro intacto
    let maestro = JSON.parse(fs.readFileSync('preguntas.json', 'utf8'));

    // 2. Lee tus nuevas preguntas fáciles
    // (Incluye una pequeña aplanadora de errores por si se te escapa una llave)
    let contenidoNuevas = fs.readFileSync('mis_faciles.json', 'utf8');
    contenidoNuevas = contenidoNuevas.replace(/\[/g, '').replace(/\]/g, '');
    contenidoNuevas = contenidoNuevas.replace(/\}\s*[\s,]*\s*\{/g, '}, {');
    if (contenidoNuevas.endsWith(',')) contenidoNuevas = contenidoNuevas.slice(0, -1);
    contenidoNuevas = '[\n' + contenidoNuevas + '\n]';
    
    let nuevas = JSON.parse(contenidoNuevas);
    let agregadas = 0;

    // 3. Inyecta cada pregunta en su categoría correspondiente
    nuevas.forEach(item => {
        let cat = item.Categoria ? item.Categoria.toLowerCase() : 'general';
        if (!maestro[cat]) cat = 'general';
        
        // Si la categoría solo tiene la pregunta de prueba, la borra para dejar espacio
        if (maestro[cat].facil.length === 1 && maestro[cat].facil[0].p.includes("PREGUNTA DE PRUEBA")) {
            maestro[cat].facil = [];
        }

        if (item.Pregunta && item.Respuesta) {
            maestro[cat].facil.push({
                p: item.Pregunta,
                o: [item.OpcionA || "A) -", item.OpcionB || "B) -", item.OpcionC || "C) -"],
                r: item.Respuesta
            });
            agregadas++;
        }
    });

    // 4. Guarda el archivo maestro actualizado
    fs.writeFileSync('preguntas.json', JSON.stringify(maestro, null, 2));
    console.log(`\n✅ ¡ÉXITO! Se han inyectado ${agregadas} preguntas fáciles nuevas al tablero principal.\n`);

} catch (e) {
    console.error("\n❌ Error al inyectar las preguntas (Revisa las comas de mis_faciles.json):", e.message);
}