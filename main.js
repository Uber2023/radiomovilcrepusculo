const WHATSAPP_PHONE = '59179999938';
// Cambiado a la URL moderna universal para apps móviles
const WHATSAPP_BASE_URL = 'https://wa.me'; 

const heroCta = document.getElementById('hero-cta');
const heroCtaStatus = document.getElementById('hero-cta-status');

function updateHeroStatus(message, isError = false) {
    if (!heroCtaStatus) return;
    heroCtaStatus.textContent = message;
    heroCtaStatus.style.color = isError ? '#fca5a5' : '#cbd5e1';
}

function buildWhatsappUrl(message) {
    const encoded = encodeURIComponent(message);
    // Cambiada la estructura para el formato wa.me/numero?text=...
    return `${WHATSAPP_BASE_URL}/${WHATSAPP_PHONE}?text=${encoded}`;
}

function openWhatsapp(message) {
    updateHeroStatus('Abriendo WhatsApp...');
    window.location.href = buildWhatsappUrl(message);
}

function buildLocationMessage(latitude, longitude) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    return `Hola Radio Móvil Crepúsculo, deseo solicitar un móvil. Mi ubicación actual es: ${mapsUrl} (Lat:${latitude.toFixed(5)}, Lon:${longitude.toFixed(5)})`;
}

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 6000, // Reducido a 6 segundos para mejorar la experiencia móvil
            maximumAge: 0,
        });
    });
}

// Eliminamos la función 'canRequestGeolocation' porque causaba falsos positivos
// en Safari móvil y manejamos todo directamente en el try/catch principal.

async function enviarUbicacionPorWhatsApp() {
    // Alerta inmediata si no es HTTPS o no tiene GPS el navegador
    if (!navigator.geolocation || window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        updateHeroStatus('Entorno no seguro o GPS no soportado. Abriendo sin ubicación...', true);
        openWhatsapp('Hola Radio Móvil Crepúsculo, deseo solicitar un móvil.');
        return;
    }

    updateHeroStatus('Buscando tu ubicación satelital...');

    try {
        const position = await getCurrentLocation();
        const message = buildLocationMessage(position.coords.latitude, position.coords.longitude);
        openWhatsapp(message);
    } catch (error) {
        // Si el usuario deniega el permiso o el GPS tarda más de 6 segundos, entra aquí
        console.error(error);
        updateHeroStatus('No se pudo obtener el GPS. Abriendo WhatsApp sin ubicación...', true);
        openWhatsapp('Hola Radio Móvil Crepúsculo, deseo solicitar un móvil.');
    }
}

if (heroCta) {
    heroCta.addEventListener('click', enviarUbicacionPorWhatsApp);
}
