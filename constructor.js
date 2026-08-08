const fs = require('fs');

console.log("🔍 Escaneando con VISIÓN TODOTERRENO (Límite ampliado: 22 palabras)...");

try {
    let raw = fs.readFileSync('preguntas.json', 'utf8');
    let datos = JSON.parse(raw);

    let mazoPerfecto = {
        general: { facil: [], medio: [], dificil: [] },
        geografia: { facil: [], medio: [], dificil: [] },
        entretenimiento: { facil: [], medio: [], dificil: [] },
        ciencia: { facil: [], medio: [], dificil: [] }
    };

    function procesarPregunta(item, catInferida, difInferida) {
        let llaves = Object.keys(item);
        let itemMin = {};
        llaves.forEach(k => itemMin[k.toLowerCase()] = item[k]);

        let p = itemMin.pregunta || itemMin.p || itemMin.q || "";
        
        let oA = itemMin.opciona || itemMin.opcion1 || itemMin.a || (itemMin.o && itemMin.o[0] ? itemMin.o[0] : "") || (itemMin.opciones && itemMin.opciones[0] ? itemMin.opciones[0] : "");
        let oB = itemMin.opcionb || itemMin.opcion2 || itemMin.b || (itemMin.o && itemMin.o[1] ? itemMin.o[1] : "") || (itemMin.opciones && itemMin.opciones[1] ? itemMin.opciones[1] : "");
        let oC = itemMin.opcionc || itemMin.opcion3 || itemMin.c || (itemMin.o && itemMin.o[2] ? itemMin.o[2] : "") || (itemMin.opciones && itemMin.opciones[2] ? itemMin.opciones[2] : "");
        
        let r = itemMin.respuesta || itemMin.r || itemMin.resp || "";

        if (p.includes("creador pronto pondrá")) return;
        if (!p || p.trim() === "") return; 

        // 🚨 NUEVO FILTRO: LÍMITE DE 22 PALABRAS 🚨
        let numeroPalabras = p.trim().split(/\s+/).length;
        if (numeroPalabras > 22) return; 

        if (!oA || oA === "") oA = "A) -";
        if (!oB || oB === "") oB = "B) -";
        if (!oC || oC === "") oC = "C) -";
        if (!r || r === "") r = oA; 

        let catStr = (itemMin.categoria || itemMin.cat || catInferida || "general").toLowerCase();
        let catOficial = "general";
        if (catStr.includes("geog") || catStr.includes("mundo")) catOficial = "geografia";
        if (catStr.includes("entre") || catStr.includes("arte") || catStr.includes("cine") || catStr.includes("musi")) catOficial = "entretenimiento";
        if (catStr.includes("cien") || catStr.includes("nat") || catStr.includes("bio")) catOficial = "ciencia";

        let difStr = (itemMin.dificultad || itemMin.dif || difInferida || "facil").toLowerCase();
        let difOficial = "facil";
        if (difStr.includes("med") || difStr.includes("norm")) difOficial = "medio";
        if (difStr.includes("dif") || difStr.includes("pro")) difOficial = "dificil";

        mazoPerfecto[catOficial][difOficial].push({
            Categoria: catOficial, Dificultad: difOficial,
            Pregunta: p, OpcionA: oA, OpcionB: oB, OpcionC: oC, Respuesta: r
        });
    }

    if (Array.isArray(datos)) {
        datos.forEach(item => procesarPregunta(item, "general", "facil"));
    } else {
        for (let cat in datos) {
            for (let dif in datos[cat]) {
                if (Array.isArray(datos[cat][dif])) {
                    datos[cat][dif].forEach(item => procesarPregunta(item, cat, dif));
                }
            }
        }
    }

    let categorias = ['general', 'geografia', 'entretenimiento', 'ciencia'];
    categorias.forEach(cat => {
        if (mazoPerfecto[cat].facil.length === 0) mazoPerfecto[cat].facil.push({ Categoria: cat, Dificultad: "facil", Pregunta: `PREGUNTA DE ${cat.toUpperCase()}: ¿El cielo es azul?`, OpcionA: "A) Sí", OpcionB: "B) No", OpcionC: "C) Tal vez", Respuesta: "A) Sí" });
        if (mazoPerfecto[cat].medio.length === 0) mazoPerfecto[cat].medio = JSON.parse(JSON.stringify(mazoPerfecto[cat].facil)).map(q => { q.Dificultad = "medio"; return q; });
        if (mazoPerfecto[cat].dificil.length === 0) mazoPerfecto[cat].dificil = JSON.parse(JSON.stringify(mazoPerfecto[cat].facil)).map(q => { q.Dificultad = "dificil"; return q; });
    });

    let arregloFinal = [];
    categorias.forEach(c => {
        ['facil', 'medio', 'dificil'].forEach(d => {
            arregloFinal.push(...mazoPerfecto[c][d]);
        });
    });

    fs.writeFileSync('mazo_final.json', JSON.stringify(arregloFinal, null, 2), 'utf8');
    console.log(`✅ ¡RESCATE COMPLETADO! Se generó 'mazo_final.json' con ${arregloFinal.length} preguntas salvadas (Máx. 22 palabras).`);
} catch(e) {
    console.log("❌ Error:", e.message);
}