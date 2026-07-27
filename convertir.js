const fs = require('fs');

try {
    // Leemos el archivo crudo y eliminamos comas sueltas o errores de sintaxis comunes
    let contenido = fs.readFileSync('preguntas_crudas.json', 'utf8');
    
    // Si el archivo no empieza con corchete, se lo agregamos a la fuerza
    if (!contenido.trim().startsWith('[')) {
        contenido = '[' + contenido + ']';
    }

    // Limpiamos comas flotantes entre bloques que causan el fallo
    contenido = contenido.replace(/}\s*,\s*,/g, '},');

    const datosLista = JSON.parse(contenido);

    const formatoCorrecto = {
        general: { facil: [], medio: [], dificil: [] },
        geografia: { facil: [], medio: [], dificil: [] },
        entretenimiento: { facil: [], medio: [], dificil: [] },
        ciencia: { facil: [], medio: [], dificil: [] }
    };

    datosLista.forEach(item => {
        let cat = item.Categoria ? item.Categoria.toLowerCase() : 'general';
        let dif = item.Dificultad ? item.Dificultad.toLowerCase() : 'facil';
        
        if (formatoCorrecto[cat] && formatoCorrecto[cat][dif]) {
            formatoCorrecto[cat][dif].push({
                p: item.Pregunta,
                o: [item.OpcionA, item.OpcionB, item.OpcionC],
                r: item.Respuesta
            });
        }
    });

    // Guardamos el resultado final perfecto en preguntas.json
    fs.writeFileSync('preguntas.json', JSON.stringify(formatoCorrecto, null, 2));
    console.log("¡ÉXITO! Tu archivo preguntas.json ha sido reparado y formateado correctamente.");

} catch (error) {
    console.error("Error al procesar el JSON. Revisa si hay comillas o llaves mal cerradas:", error);
}