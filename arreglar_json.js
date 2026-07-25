const fs = require('fs');

const archivo = 'preguntas.json';

try {
    console.log('Leyendo el archivo preguntas.json...');
    let text = fs.readFileSync(archivo, 'utf8');

    // 1. Quitamos el primer corchete de apertura y el último de cierre del archivo global
    let cleanText = text.trim();
    
    // 2. Reemplazamos cualquier unión de corchetes de cierre y apertura (ej: "]\n[") por una coma
    cleanText = cleanText.replace(/\]\s*[\r\n]+\s*\[/g, ',');
    cleanText = cleanText.replace(/\]\s*\[/g, ',');

    // 3. Eliminamos cualquier corchete sobrante al inicio o al final si quedó alguno aislado
    cleanText = cleanText.replace(/^\[+|\]+$/g, '');

    // 4. Envolvemos todo el contenido limpio en un ÚNICO par de corchetes válidos
    let finalJson = '[' + cleanText + ']';

    // 5. Probamos que el JSON sea 100% válido antes de guardarlo
    JSON.parse(finalJson);

    // Si pasa la prueba, sobrescribimos el archivo con la estructura perfecta
    fs.writeFileSync(archivo, finalJson, 'utf8');
    
    console.log('✅ ¡Perfecto! El archivo preguntas.json ha sido unificado y validado con éxito.');
    console.log('✅ Ahora todas las preguntas están dentro de un único arreglo válido.');

} catch (err) {
    console.error('❌ Error crítico al procesar el JSON:', err.message);
}