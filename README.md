# SPOTLIGHT ⚡ - Plataforma Premium de Eventos, Espacios y Canchas

¡Bienvenido a **SPOTLIGHT**! Este es un proyecto de desarrollo de software y organización de eventos de nivel profesional (Colombo-Estadounidense), diseñado para el piloto inicial en Barranquilla, Colombia.

---

## 🚀 Guía de Despliegue en GitHub Pages

Para compartir este proyecto con tus instructores del SENA y permitirles visualizar la aplicación e interactuar con ella directamente desde sus celulares mediante un enlace web público, sigue estos pasos utilizando **Git** y **GitHub**:

### Paso 1: Crear un repositorio en GitHub
1. Abre tu navegador e ingresa a tu cuenta de GitHub (asociada a `brayansolinsainea@gmail.com`).
2. Haz clic en el botón **New** (Nuevo Repositorio) en la esquina superior izquierda.
3. Asigna el nombre exacto de: `spotlight`.
4. Configura el repositorio como **Public** (Público) para que tu profesor pueda acceder.
5. **No** agregues archivos de inicio (deja desmarcados README, .gitignore y licencia). Haz clic en **Create repository**.

### Paso 2: Subir el proyecto desde tu computadora
Abre una terminal (PowerShell o Git Bash) en tu carpeta de proyecto `C:\Users\braya\.gemini\antigravity-ide\scratch\spotlight` y ejecuta los siguientes comandos ordenadamente:

```bash
# 1. Inicializar el repositorio local de Git
git init

# 2. Agregar todos los archivos al seguimiento de Git
git add .

# 3. Guardar los archivos en un commit inicial
git commit -m "feat: MVP inicial de Spotlight con Google Maps, dashboard y Pitch SENA"

# 4. Cambiar el nombre de la rama principal a 'main'
git branch -M main

# 5. Conectar tu repositorio local con tu repositorio en GitHub
# (Reemplaza 'TU_USUARIO' con tu nombre de usuario real de GitHub)
git remote add origin https://github.com/TU_USUARIO/spotlight.git

# 6. Subir tus archivos a GitHub
git push -u origin main
```

*(Nota: Si Git te solicita credenciales, inicia sesión usando tu cuenta de GitHub en el navegador o mediante un Personal Access Token).*

### Paso 3: Activar GitHub Pages (El Enlace Público)
Una vez que hayas subido los archivos a tu cuenta de GitHub:
1. En la página de tu repositorio en GitHub, dirígete a la pestaña **Settings** (Configuración) en la parte superior derecha.
2. En el menú lateral izquierdo, haz clic en **Pages** (dentro de la sección *Code and automation*).
3. En la sección **Build and deployment**, localiza la opción **Source** y asegúrate de que esté en `Deploy from a branch`.
4. Debajo, en **Branch**, cambia el valor de `None` a `main` (o la rama donde subiste el código), deja la carpeta en `/ (root)` y haz clic en **Save** (Guardar).
5. Espera aproximadamente 1 o 2 minutos. Recarga la página de Configuración de Pages.
6. En la parte superior aparecerá un recuadro verde que dice:
   > **Your site is live at:** `https://TU_USUARIO.github.io/spotlight/`

**¡Y listo!** Ese es el enlace que puedes pasarle a tu profesor por WhatsApp o correo. Al abrirlo, se cargará la aplicación completa, adaptada para dispositivos móviles y con todas las animaciones y mapas Google Maps interactivos funcionando.

---

## 🛠️ Tecnologías Utilizadas en el MVP
- **HTML5 Semántico**: Para estructurar y clasificar adecuadamente las secciones y modales.
- **CSS3 Vanilla Premium**: HSL variables, animaciones optimizadas para móviles, y transiciones aceleradas por hardware para un rendimiento impecable.
- **JavaScript Modular**: Sistema SPA (Single Page Application) sin librerías externas que simula:
  - Geolocalización de usuario real para recomendar espacios cercanos.
  - CRUD completo para propietarios de espacios (persistido en `localStorage`).
  - Pasarela de pago simulada ( Visa, Mastercard, PSE, Nequi ) con deducción de balances y comisiones.
  - Mapa dinámico real usando **Google Maps Embed API**.
  - Soporte de soporte interactivo (Chatbot).
  - Pitch de presentación automatizada.
