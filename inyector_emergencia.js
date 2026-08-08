const fs = require('fs');

console.log("🚑 Iniciando inyección de emergencia...");

try {
    let raw = fs.readFileSync('preguntas.json', 'utf8');
    let preguntas = JSON.parse(raw);

    // 1. Borramos el salvavidas (las preguntas de relleno)
    let preguntasLimpias = preguntas.filter(p => !p.Pregunta.includes("creador pronto pondrá"));

    // 2. Creamos 20 preguntas ultra cortas y perfectas para TikTok
    let nuevas = [
        {Categoria: "geografia", Dificultad: "facil", Pregunta: "¿Cuál es la capital de Francia?", OpcionA: "A) Roma", OpcionB: "B) París", OpcionC: "C) Madrid", Respuesta: "B) París"},
        {Categoria: "geografia", Dificultad: "facil", Pregunta: "¿En qué país está la Torre Eiffel?", OpcionA: "A) Inglaterra", OpcionB: "B) Francia", OpcionC: "C) Estados Unidos", Respuesta: "B) Francia"},
        {Categoria: "geografia", Dificultad: "facil", Pregunta: "¿Qué país tiene forma de bota?", OpcionA: "A) México", OpcionB: "B) Italia", OpcionC: "C) Japón", Respuesta: "B) Italia"},
        {Categoria: "geografia", Dificultad: "facil", Pregunta: "¿Cuál es el río más largo del mundo?", OpcionA: "A) Amazonas", OpcionB: "B) Nilo", OpcionC: "C) Misisipi", Respuesta: "A) Amazonas"},
        {Categoria: "geografia", Dificultad: "facil", Pregunta: "¿En qué continente está Egipto?", OpcionA: "A) Asia", OpcionB: "B) África", OpcionC: "C) Europa", Respuesta: "B) África"},

        {Categoria: "ciencia", Dificultad: "facil", Pregunta: "¿Qué planeta es conocido como el planeta rojo?", OpcionA: "A) Venus", OpcionB: "B) Júpiter", OpcionC: "C) Marte", Respuesta: "C) Marte"},
        {Categoria: "ciencia", Dificultad: "facil", Pregunta: "¿Qué gas respiramos para vivir?", OpcionA: "A) Helio", OpcionB: "B) Oxígeno", OpcionC: "C) Nitrógeno", Respuesta: "B) Oxígeno"},
        {Categoria: "ciencia", Dificultad: "facil", Pregunta: "¿Cuántas patas tiene una araña?", OpcionA: "A) Seis", OpcionB: "B) Ocho", OpcionC: "C) Diez", Respuesta: "B) Ocho"},
        {Categoria: "ciencia", Dificultad: "facil", Pregunta: "¿Cuál es la fórmula química del agua?", OpcionA: "A) H2O", OpcionB: "B) CO2", OpcionC: "C) HO2", Respuesta: "A) H2O"},
        {Categoria: "ciencia", Dificultad: "facil", Pregunta: "¿Qué estrella nos da luz y calor?", OpcionA: "A) La Luna", OpcionB: "B) Sirio", OpcionC: "C) El Sol", Respuesta: "C) El Sol"},

        {Categoria: "entretenimiento", Dificultad: "facil", Pregunta: "¿Qué animal es Mickey Mouse?", OpcionA: "A) Gato", OpcionB: "B) Pato", OpcionC: "C) Ratón", Respuesta: "C) Ratón"},
        {Categoria: "entretenimiento", Dificultad: "facil", Pregunta: "¿De qué color son Los Simpson?", OpcionA: "A) Naranjas", OpcionB: "B) Amarillos", OpcionC: "C) Blancos", Respuesta: "B) Amarillos"},
        {Categoria: "entretenimiento", Dificultad: "facil", Pregunta: "¿A qué muñeco le crece la nariz si miente?", OpcionA: "A) Shrek", OpcionB: "B) Pinocho", OpcionC: "C) Dumbo", Respuesta: "B) Pinocho"},
        {Categoria: "entretenimiento", Dificultad: "facil", Pregunta: "¿En qué película sale Darth Vader?", OpcionA: "A) Star Wars", OpcionB: "B) Harry Potter", OpcionC: "C) Marvel", Respuesta: "A) Star Wars"},
        {Categoria: "entretenimiento", Dificultad: "facil", Pregunta: "¿Qué banda cantaba Bohemian Rhapsody?", OpcionA: "A) The Beatles", OpcionB: "B) AC/DC", OpcionC: "C) Queen", Respuesta: "C) Queen"},

        {Categoria: "general", Dificultad: "facil", Pregunta: "¿Cuántos días tiene un año bisiesto?", OpcionA: "A) 365", OpcionB: "B) 366", OpcionC: "C) 364", Respuesta: "B) 366"},
        {Categoria: "general", Dificultad: "facil", Pregunta: "¿Qué idioma se habla en Brasil?", OpcionA: "A) Español", OpcionB: "B) Francés", OpcionC: "C) Portugués", Respuesta: "C) Portugués"},
        {Categoria: "general", Dificultad: "facil", Pregunta: "¿Qué color resulta de mezclar azul y amarillo?", OpcionA: "A) Verde", OpcionB: "B) Morado", OpcionC: "C) Naranja", Respuesta: "A) Verde"},
        {Categoria: "general", Dificultad: "facil", Pregunta: "¿Cuál es el primer mes del año?", OpcionA: "A) Febrero", OpcionB: "B) Diciembre", OpcionC: "C) Enero", Respuesta: "C) Enero"},
        {Categoria: "general", Dificultad: "facil", Pregunta: "¿Qué animal hace 'Miau'?", OpcionA: "A) Perro", OpcionB: "B) Gato", OpcionC: "C) Vaca", Respuesta: "B) Gato"}
    ];

    // 3. Unimos todo y guardamos
    let mazoFinal = preguntasLimpias.concat(nuevas);
    fs.writeFileSync('preguntas.json', JSON.stringify(mazoFinal, null, 2), 'utf8');
    
    console.log("✅ Se inyectaron 20 preguntas fáciles reales y se eliminaron las de relleno.");
} catch (error) {
    console.log("❌ Error:", error.message);
}