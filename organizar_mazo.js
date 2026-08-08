const fs = require('fs');

console.log("⚙️ Reorganizando y mapeando todas tus preguntas...");

try {
    // Lee tu archivo actual (asegúrate de que sea el que tiene tus preguntas, ej: preguntas_2.json o preguntas.json)
    // Si tu archivo se llama diferente, cambia el nombre aquí abajo:
    let archivoFuente = fs.existsSync('preguntas_2.json') ? 'preguntas_2.json' : 'preguntas.json';
    let rawData = fs.readFileSync(archivoFuente, 'utf8');
    let datos = JSON.parse(rawData);

    // Estructura limpia que exige el juego
    let mazoPerfecto = {
        general: { facil: [], medio: [], dificil: [] },
        geografia: { facil: [], medio: [], dificil: [] },
        entretenimiento: { facil: [], medio: [], dificil: [] },
        ciencia: { facil: [], medio: [], dificil: [] }
    };

    let contador = { general: 0, geografia: 0, entretenimiento: 0, ciencia: 0 };

    // Si es un arreglo (formato de tus 3000 preguntas)
    if (Array.isArray(datos)) {
        datos.forEach(item => {
            let catOriginal = (item.Categoria || item.cat || "general").toLowerCase();
            let difOriginal = (item.Dificultad || item.dif || "facil").toLowerCase();
            
            let p = item.Pregunta || item.p;
            let oA = item.OpcionA || (item.o ? item.o[0] : null);
            let oB = item.OpcionB || (item.o ? item.o[1] : null);
            let oC = item.OpcionC || (item.o ? item.o[2] : null);
            let r = item.Respuesta || item.r;

            if (!p || !oA || !oB || !oC || !r) return; // Ignorar mal formadas

            // Mapeo inteligente para que CUALQUIER categoría caiga en una de las 4 oficiales del tablero
            let catOficial = "general";
            if (catOriginal.includes("geog") || catOriginal.includes("mundo") || catOriginal.includes("pais") || catOriginal.includes("capital")) {
                catOficial = "geografia";
            } else if (catOriginal.includes("entreten") || catOriginal.includes("arte") || catOriginal.includes("pelis") || catOriginal.includes("juego") || catOriginal.includes("cine") || catOriginal.includes("musica")) {
                catOficial = "entretenimiento";
            } else if (catOriginal.includes("cien") || catOriginal.includes("nat") || catOriginal.includes("bio") || catOriginal.includes("fis") || catOriginal.includes("quim")) {
                catOficial = "ciencia";
            }

            let difOficial = "facil";
            if (difOriginal.includes("med") || difOriginal.includes("normal")) difOficial = "medio";
            if (difOriginal.includes("dif") || difOriginal.includes("pro") || difOriginal.includes("alta")) difOficial = "dificil";

            mazoPerfecto[catOficial][difOficial].push({
                Categoria: catOficial,
                Dificultad: difOficial,
                Pregunta: p,
                OpcionA: oA,
                OpcionB: oB,
                OpcionC: oC,
                Respuesta: r
            });

            contador[catOficial]++;
        });
    }

    // Comprobar que ninguna categoría se quedó en 0 (para evitar el fallo visual)
    const validCats = ['general', 'geografia', 'entretenimiento', 'ciencia'];
    const validDifs = ['facil', 'medio', 'dificil'];

    validCats.forEach(c => {
        validDifs.forEach(d => {
            if (mazoPerfecto[c][d].length === 0) {
                // Si faltaba alguna, agregamos un respaldo real basado en la categoría
                mazoPerfecto[c][d].push({
                    Categoria: c,
                    Dificultad: d,
                    Pregunta: `¿Cuál es una característica principal de la categoría ${c.toUpperCase()}?`,
                    OpcionA: "A) Es muy interesante",
                    OpcionB: "B) Tiene datos útiles",
                    OpcionC: "C) Todas las anteriores",
                    Respuesta: "C) Todas las anteriores"
                });
            }
        });
    });

    // Guardar el resultado definitivo y plano que lee admin.html
    let arregloFinal = [];
    validCats.forEach(c => {
        validDifs.forEach(d => {
            arregloFinal.push(...mazoPerfecto[c][d]);
        });
    });

    fs.writeFileSync('preguntas.json', JSON.stringify(arregloFinal, null, 2), 'utf8');
    
    console.log(`\n🎉 ¡REORGANIZACIÓN EXITOSA!`);
    console.log(`- General: ${contador.general} preguntas`);
    console.log(`- Geografía: ${contador.geografia} preguntas`);
    console.log(`- Entretenimiento: ${contador.entretenimiento} preguntas`);
    console.log(`- Ciencia: ${contador.ciencia} preguntas`);
    console.log(`Total guardado en 'preguntas.json': ${arregloFinal.length} preguntas listas.`);

} catch (error) {
    console.log("❌ Ocurrió un error:", error.message);
}