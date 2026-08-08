const fs = require('fs');

console.log("🛡️ Iniciando el BLINDAJE ABSOLUTO de tus preguntas...");

try {
    let rawData = fs.readFileSync('preguntas.json', 'utf8');
    let preguntas = JSON.parse(rawData);
    
    let mazoBlindado = {
        general: { facil: [], medio: [], dificil: [] },
        geografia: { facil: [], medio: [], dificil: [] },
        entretenimiento: { facil: [], medio: [], dificil: [] },
        ciencia: { facil: [], medio: [], dificil: [] }
    };

    let validCats = ['general', 'geografia', 'entretenimiento', 'ciencia'];
    let validDifs = ['facil', 'medio', 'dificil'];

    preguntas.forEach(item => {
        // Extraer info sin importar cómo se llame la variable
        let p = item.Pregunta || item.p || "¿Pregunta vacía?";
        let o = item.OpcionA ? [item.OpcionA, item.OpcionB, item.OpcionC] : (item.o || ["A) -", "B) -", "C) -"]);
        let r = item.Respuesta || item.r || o[0];
        
        let cat = (item.Categoria || item.cat || "general").toLowerCase();
        let dif = (item.Dificultad || item.dif || "facil").toLowerCase();

        // Si la categoría o dificultad viene rota, la reparamos automáticamente
        if (!validCats.includes(cat)) cat = "general";
        if (!validDifs.includes(dif)) dif = "facil";

        // Guardamos con la estructura perfecta que exige el tablero
        mazoBlindado[cat][dif].push({
            Categoria: cat,
            Dificultad: dif,
            Pregunta: p,
            OpcionA: o[0],
            OpcionB: o[1],
            OpcionC: o[2],
            Respuesta: r
        });
    });

    let arregloFinal = [];
    
    // Rellenamos cualquier hueco vacío para que el dado NUNCA crashee
    validCats.forEach(c => {
        validDifs.forEach(d => {
            if (mazoBlindado[c][d].length === 0) {
                mazoBlindado[c][d].push({
                    Categoria: c,
                    Dificultad: d,
                    Pregunta: `¿El creador pronto pondrá preguntas de ${c.toUpperCase()}?`,
                    OpcionA: "A) Sí",
                    OpcionB: "B) Claro",
                    OpcionC: "C) Por supuesto",
                    Respuesta: "A) Sí"
                });
            }
            // Juntamos todo en un solo bloque macizo
            arregloFinal.push(...mazoBlindado[c][d]);
        });
    });

    fs.writeFileSync('preguntas.json', JSON.stringify(arregloFinal, null, 2), 'utf8');
    
    console.log(`✅ ¡BLINDAJE EXITOSO! Tienes ${arregloFinal.length} preguntas impecables y a prueba de fallos.`);
} catch (e) {
    console.log("❌ Error:", e.message);
}