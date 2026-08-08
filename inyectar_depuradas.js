const fs = require('fs');

console.log("💉 Iniciando la inyección de tus preguntas fáciles DEPURADAS...");

try {
    // 1. Leer el archivo maestro actual
    let maestroRaw = fs.readFileSync('preguntas.json', 'utf8');
    let mazoMaestro = JSON.parse(maestroRaw);

    // 2. Borrar TODAS las preguntas fáciles viejas (y posiblemente raras) del mazo maestro
    let mazoSinFaciles = mazoMaestro.filter(item => item.Dificultad.toLowerCase() !== 'facil');
    console.log(`🗑️ Se eliminaron las fáciles viejas. Quedan ${mazoSinFaciles.length} preguntas de nivel Medio/Difícil.`);

    // 3. Leer el nuevo archivo depurado que acabas de crear
    let facilesRaw = fs.readFileSync('mis_faciles_depurado.json', 'utf8');
    let mazoFaciles = JSON.parse(facilesRaw);

    // 4. Asegurarnos de que el formato encaje perfecto
    let nuevasFaciles = [];
    mazoFaciles.forEach(item => {
        if(item.Pregunta) {
            item.Dificultad = "facil"; 
            nuevasFaciles.push(item);
        } else if(item.p) {
            nuevasFaciles.push({
                Categoria: item.cat || "general",
                Dificultad: "facil",
                Pregunta: item.p,
                OpcionA: item.o[0],
                OpcionB: item.o[1],
                OpcionC: item.o[2],
                Respuesta: item.r
            });
        }
    });

    console.log(`✨ Se van a inyectar ${nuevasFaciles.length} preguntas FÁCILES VIP al tablero.`);

    // 5. Unir el mazo maestro limpio con las nuevas fáciles
    let mazoDefinitivo = mazoSinFaciles.concat(nuevasFaciles);

    // 6. Sobreescribir el archivo maestro
    fs.writeFileSync('preguntas.json', JSON.stringify(mazoDefinitivo, null, 2), 'utf8');
    
    console.log(`✅ ¡INYECCIÓN EXITOSA! El archivo 'preguntas.json' tiene ahora ${mazoDefinitivo.length} preguntas en total listas para jugar.`);

} catch (error) {
    console.log("❌ Ocurrió un error:", error.message);
    console.log("Asegúrate de que 'mis_faciles_depurado.json' y 'preguntas.json' estén en la misma carpeta.");
}