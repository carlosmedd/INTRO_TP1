# GYMFIT
Aplicación web destinada exclusivamente a personas que entrenan con levantamientos de pesas. Su objetivo es proporcionar una plataforma donde los usuarios puedan registrar y gestionar sus ejercicios diarios, ver un historial de sus entrenamientos, crear y guardar rutinas personalizadas, y participar en una comunidad donde se comparten otras rutinas y se discuten temas relacionados.

### Características
- Registro y autenticación de usuarios: Los usuarios pueden registrarse y autenticarse utilizando un nombre de usuario y una contraseña.
- Registro de ejercicios diarios: Los usuarios pueden registrar y gestionar sus ejercicios diarios con detalles como nombre del ejercicio, peso, series y repeticiones.
- Historial de ejercicios: Visualización de un historial detallado de ejercicios realizados en días anteriores.
- Mis rutinas: Creación, edición y eliminación de plantillas de ejercicios personalizadas.
- Rutinas compartidas: Navegación y almacenamiento de rutinas compartidas por otros usuarios.
- Comunidad: Participación en discusiones sobre levantamiento de pesas, recomendaciones y consejos.
- Listado de ejercicios: Visualizacion de una lista completa de todos los ejercicios que el usuario puede realizar.

## Instalación

#### Prerrequisitos
- Python 3
- pip
- Git

#### 1. Clonar el repositorio:
> git clone git@github.com:usuario/INTRO_TP1.git
> 
> cd INTRO_TP1

#### 2. Crear y activar el entorno virtual:
> pip install virtualenv
> 
> virtualenv venv
> 
> source venv/bin/activate

#### 3. Instalar las dependencias:
> pip install -r requirements.txt

## Uso

El proyecto consta de dos partes principales: backend y frontend.

#### 1. Iniciar el servidor backend:
> cd backend
> 
> python3 app.py

#### 2. En una nueva terminal, iniciar el servidor frontend:
> cd frontend
> 
> python -m http.server

#### 3. Abrir un navegador y acceder a la aplicación en `http://localhost:8000` (o el puerto que se indique en la terminal).
