export async function onRequest(context) {
  const request = context.request;
  const ua = request.headers.get('user-agent') || '';
  
  // Lista de firmas de BOTS de Facebook y revisores comunes
  const isBot = /facebookexternalhit|Facebot|FB_IAB|FBAN|FBAV|facebookplatform|AdsBot-Google/i.test(ua);

  if (isBot) {
    // Si es un BOT, le servimos una versión "limpia" sin el script de redirección
    // Esto asegura que Facebook vea la miniatura pero no la oferta real
    const response = await context.next();
    return new HTMLRewriter()
      .on('script', { element(el) { el.remove(); } }) // Borra el JS para el bot
      .transform(response);
  }

  // Si es un humano, cargamos todo normal
  return await context.next();
}
