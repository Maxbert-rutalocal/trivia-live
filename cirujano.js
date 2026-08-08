const fs = require('fs');

console.log("🚀 Iniciando el robot cirujano para reparar tu mazo de Trivia Live...");

try {
    let textoRoto = fs.readFileSync('preguntas.json', 'utf8');
    
    // Esta fórmula mágica ignora las llaves o comas rotas y saca solo la información valiosa
    const regex = /"Categoria"\s*:\s*"(.*?)"\s*,\s*"Dificultad"\s*:\s*"(.*?)"\s*,\s*"Pregunta"\s*:\s*"(.*?)"\s*,\s*"OpcionA"\s*:\s*"(.*?)"\s*,\s*"OpcionB"\s*:\s*"(.*?)"\s*,\s*"OpcionC"\s*:\s*"(.*?)"\s*,\s*"Respuesta"\s*:\s*"(.*?)"/gs;
    
    let match;
    let mazoLimpio = [];

    while ((match = regex.exec(textoRoto)) !== null) {
        // Limpiamos comillas dobles accidentales por si acaso
        mazoLimpio.push({
            Categoria: match[1].replace(/"/g, "'"),
            Dificultad: match[2].replace(/"/g, "'"),
            Pregunta: match[3].replace(/"/g, "'"),
            OpcionA: match[4].replace(/"/g, "'"),
            OpcionB: match[5].replace(/"/g, "'"),
            OpcionC: match[6].replace(/"/g, "'"),
            Respuesta: match[7].replace(/"/g, "'")
        });
    }

    if(mazoLimpio.length > 0) {
        // Reescribimos el archivo con el formato JSON perfecto
        fs.writeFileSync('preguntas.json', JSON.stringify(mazoLimpio, null, 2), 'utf8');
        console.log(`✅ ¡OPERACIÓN EXITOSA! Se rescataron y repararon ${mazoLimpio.length} preguntas.`);
        console.log("El archivo preguntas.json ahora es 100% válido. Ya puedes subirlo a GitHub.");
    } else {
        console.log("❌ No se encontraron preguntas. Asegúrate de tener texto en preguntas.json.");
    }
} catch (error) {
    console.log("❌ Error leyendo el archivo:", error);
}