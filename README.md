# Finmobil — sitio web

Landing institucional de Finmobil S.A.S.: crédito privado respaldado por cartera de créditos con descuento de nómina en Colombia y México.

Es un sitio estático, sin build. HTML, CSS en línea y JavaScript puro.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Landing principal |
| `simulador.js` | Lógica del simulador de inversión (tasa entre 6% y 24% anual) |
| `legal.html` | Política de privacidad y datos, términos de uso y aviso legal |
| `gracias.html` | Página de confirmación del formulario de inversionistas |
| `assets/` | Logos de aliados |
| `favicon.svg` | Ícono del sitio |
| `netlify.toml` | Configuración de publicación y encabezados de seguridad |

## Publicación

Netlify está conectado a este repo: cada `push` a `main` publica el sitio automáticamente.
Para probar cambios sin publicarlos, crea una rama y abre un pull request; Netlify genera una vista previa.

## Formulario

El formulario de inversionistas usa Netlify Forms (`data-netlify="true"`).
Los envíos aparecen en Netlify, en la sección **Forms** del sitio. Ahí mismo se configuran las notificaciones por correo a info@finmobilsas.com.

## Ver el sitio en local

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
```
