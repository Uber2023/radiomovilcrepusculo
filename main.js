const gpsBtn = document.getElementById('gpsBtn');
const gpsBtnIcon = document.getElementById('gpsBtnIcon');
const gpsBtnLabel = document.getElementById('gpsBtnLabel');
const gpsBtnSub = document.getElementById('gpsBtnSub');
const gpsStatus = document.getElementById('gpsStatus');

const phoneNumber = '59179999938';
const defaultMessage = 'Hola Radio Móvil Crepúsculo, deseo solicitar un móvil. Mi ubicación es:';

function setGpsState({ label, sub, icon, status, busy = false }) {
    if (gpsBtnLabel) gpsBtnLabel.textContent = label;
    if (gpsBtnSub) gpsBtnSub.textContent = sub;
    if (gpsBtnIcon) gpsBtnIcon.textContent = icon;
    if (gpsBtn) {
        gpsBtn.disabled = busy;
        gpsBtn.setAttribute('aria-busy', busy ? 'true' : 'false');
    }
    if (gpsStatus) {
        gpsStatus.textContent = status;
        gpsStatus.hidden = !status;
    }
}

function buildWhatsAppLink(latitude, longitude) {
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const encodedText = encodeURIComponent(`${defaultMessage} ${mapsUrl}`);
    return `https://wa.me/${phoneNumber}?text=${encodedText}`;
}

function handleGeoError(error) {
    let message = 'No se pudo obtener tu ubicación. Intenta nuevamente.';

    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = 'Permiso de ubicación denegado. Habilita la geolocalización en tu navegador.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'La ubicación no está disponible en este momento.';
            break;
        case error.TIMEOUT:
            message = 'Se agotó el tiempo para obtener tu ubicación.';
            break;
        default:
            message = 'Ocurrió un problema al obtener tu ubicación.';
            break;
    }

    setGpsState({
        label: 'Enviar mi ubicación GPS',
        sub: 'Toca para compartir tu ubicación por WhatsApp',
        icon: '📍',
        status: message,
        busy: false
    });
}

if (gpsBtn) {
    gpsBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            setGpsState({
                label: 'Enviar mi ubicación GPS',
                sub: 'Tu navegador no admite geolocalización',
                icon: '⚠️',
                status: 'Tu navegador no admite geolocalización. Prueba desde un teléfono o un navegador compatible.',
                busy: false
            });
            return;
        }

        setGpsState({
            label: 'Obteniendo ubicación...',
            sub: 'Esperando tu posición actual',
            icon: '⏳',
            status: 'Solicitando tu ubicación...',
            busy: true
        });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude.toFixed(6);
                const longitude = position.coords.longitude.toFixed(6);
                const whatsappLink = buildWhatsAppLink(latitude, longitude);

                window.open(whatsappLink, '_blank', 'noopener,noreferrer');

                setGpsState({
                    label: 'Ubicación lista',
                    sub: 'Se abrió WhatsApp con tu posición',
                    icon: '✅',
                    status: `Ubicación lista: ${latitude}, ${longitude}`,
                    busy: false
                });
            },
            handleGeoError,
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            }
        );
    });
}

const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}
