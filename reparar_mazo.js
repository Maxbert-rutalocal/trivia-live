const fs = require('fs');

console.log("🔍 Escaneando las 3000 preguntas...");

// 1. Leemos el archivo de texto donde pegaste todo (aunque esté roto)
let textoRaw = '';
try {
    textoRaw = fs.readFileSync('mis_preguntas.txt', 'utf8');
} catch (e) {
    console.log("❌ ERROR: No se encontró el archivo 'mis_preguntas.txt'. Créalo y pega tus preguntas ahí.");
    process.exit();
}

// 2. Expresión regular mágica que extrae las preguntas ignorando errores de sintaxis JSON
const regex = /"p"\s*:\s*"(.*?)"\s*,\s*"o"\s*:\s*\[\s*"(.*?)"\s*,\s*"(.*?)"\s*,\s*"(.*?)"\s*\]\s*,\s*"r"\s*:\s*"(.*?)"/gs;
let match;
let todasLasPreguntas = [];

while ((match = regex.exec(textoRaw)) !== null) {
    todasLasPreguntas.push({
        p: match[1].replace(/\\"/g, "'"), // Por si hay comillas dobles adentro
        o: [match[2].replace(/\\"/g, "'"), match[3].replace(/\\"/g, "'"), match[4].replace(/\\"/g, "'")],
        r: match[5].replace(/\\"/g, "'")
    });
}

console.log(`✅ ¡Se rescataron ${todasLasPreguntas.length} preguntas exitosamente!`);

// 3. Creamos los cajones obligatorios para que el juego no se trabe
let mazoPerfecto = {
    general: { facil: [], medio: [], dificil: [] },
    geografia: { facil: [], medio: [], dificil: [] },
    entretenimiento: { facil: [], medio: [], dificil: [] },
    ciencia: { facil: [], medio: [], dificil: [] }
};

// 4. Clasificamos automáticamente leyendo las palabras clave de cada pregunta
todasLasPreguntas.forEach((item) => {
    let texto = item.p.toLowerCase();
    let categoria = "general"; // Por defecto
    
    if (texto.includes("país") || texto.includes("capital") || texto.includes("océano") || texto.includes("continente") || texto.includes("río") || texto.includes("ciudad") || texto.includes("bandera")) {
        categoria = "geografia";
    } else if (texto.includes("película") || texto.includes("juego") || texto.includes("superhéroe") || texto.includes("disney") || texto.includes("marvel") || texto.includes("personaje") || texto.includes("mario") || texto.includes("nintendo")) {
        categoria = "entretenimiento";
    } else if (texto.includes("animal") || texto.includes("planeta") || texto.includes("cuerpo") || texto.includes("sol") || texto.includes("luna") || texto.includes("insecto") || texto.includes("ave") || texto.includes("mamífero") || texto.includes("pez") || texto.includes("reptil") || texto.includes("hueso")) {
        categoria = "ciencia";
    }

    // Metemos todas en nivel 'facil'
    mazoPerfecto[categoria].facil.push(item);
});

// 5. Rellenamos con 1 pregunta comodín los espacios vacíos para evitar que el tablero colapse si el dado cae ahí
const categorias = ['general', 'geografia', 'entretenimiento', 'ciencia'];
categorias.forEach(cat => {
    let comodin = { p: `¿Pregunta de relleno para ${cat.toUpperCase()}?`, o: ["A) Sí", "B) No", "C) Tal vez"], r: "A) Sí" };
    if (mazoPerfecto[cat].facil.length === 0) mazoPerfecto[cat].facil.push(comodin);
    if (mazoPerfecto[cat].medio.length === 0) mazoPerfecto[cat].medio.push(comodin);
    if (mazoPerfecto[cat].dificil.length === 0) mazoPerfecto[cat].dificil.push(comodin);
});

// 6. Generamos el archivo oficial limpio y sin un solo error
fs.writeFileSync('preguntas.json', JSON.stringify(mazoPerfecto, null, 2), 'utf8');
console.log("🎉 ¡Archivo 'preguntas.json' reconstruido, ordenado y listo para subir a GitHub!");