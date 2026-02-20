# 🍸 Buscador de Cócteles

Práctica – Consumo de APIs y Visualización Web

---
## Índice

1. [Introducción](#1-introducción)
2. [Arquitectura del proyecto](#2-arquitectura-del-proyecto)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [API utilizada](#4-api-utilizada)
5. [Servidor Flask](#5-servidor-flask)
6. [Explicación del Frontend](#6-explicación-del-fronted)
7. [Conceptos teóricos aplicados](#7-conceptos-aplicados)
8. [Instalación y ejecución](#8-instalación-y-ejecución)
9. [Conclusiones](#9-conclusiones)

---

## 1. Introducción

El objetivo de esta práctica es desarrollar una aplicación web capaz de consumir información desde una **API** externa utilizando peticiones asíncronas (fetch) y mostrar los datos dinámicamente en una página HTML.

Además, se ha implementado un **servidor de aplicaciones** utilizando Flask para reforzar el concepto de arquitectura cliente-servidor.

La aplicación permite buscar cócteles y visualizar:

- Nombre
- Imagen
- Categoría
- Tipo (alcohólico o no)
- Instrucciones de preparación

---

## 2. Arquitectura del proyecto
La aplicación sigue una arquitectura **cliente-servidor**.

### Flujo de comunicación:

1. El navegador realiza una petición al servidor `Flask`.
2. Flask actúa como `intermediario`.
3. Flask consulta la `API externa`.
4. Devuelve los datos al cliente en formato `JSON`.
5. JavaScript renderiza la información dinámicamente.

Esto demuestra comprensión del modelo REST y separación de responsabilidades.

---

## 3. Estructura del proyecto

<pre>

proyecto/
│
├── app.py  → Servidor Flask
├── requirements.txt
├── venv/   → Entorno virtual de Python
│
├── templates/  → Plantillas HTML
│   └── index.html  
│
├── static/   → Archivos estáticos (CSS y JS)
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── script.js
│
└── docs/   → Documentación del proyecto
    └── README.md  

</pre>

---

## 4. API Utilizada
[TheCocktailDB](https://www.thecocktaildb.com/api.php)

### 🔹Endpoint consumido:
```
https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Margarita
```
### 🔹Método HTTP utilizado:
`GET`

### 🔹Tipo de respuesta:
`JSON`

Ejemplo de respuesta:
```JSON
{
  "drinks": [
    {
      "strDrink": "Margarita",
      "strCategory": "Cocktail",
      "strAlcoholic": "Alcoholic",
      "strInstructions": "Mix ingredients...",
      "strDrinkThumb": "https://..."
    }
  ]
} 
```

---

## 5. Servidor Flask
Se han definido tres rutas:

`/` → Renderiza la vista principal.

`/api/cocktails` → Endpoint propio que actúa como proxy hacia la API externa.

`/api/demo` → Endpoint simulado que devuelve datos estáticos creados manualmente.

## 🔸 Explicación (`app.py`)
```py
# Importamos las clases y funciones necesarias de Flask:
# Flask -> para crear la aplicación
# render_template -> para renderizar archivos HTML
# jsonify -> para devolver datos en formato JSON
# request -> para acceder a los datos que envía el cliente (por ejemplo parámetros en la URL)
from flask import Flask, render_template, jsonify, request

# Importamos la librería requests para poder hacer peticiones HTTP
# a APIs externas desde el servidor
import requests


# Creamos la instancia principal de la aplicación Flask
# __name__ indica a Flask dónde está ubicada la aplicación
app = Flask(__name__) 


# Definimos la ruta principal "/"
# Cuando el usuario entra en http://127.0.0.1:5000/
# se ejecuta esta función
@app.route("/")
def home():
    # render_template busca el archivo index.html dentro de la carpeta "templates"
    # y lo envía al navegador
    return render_template("index.html")


# Creamos un endpoint propio llamado "/api/cocktails"
# Este endpoint será consumido desde el frontend mediante fetch()
@app.route("/api/cocktails")
def get_cocktails():
    
    # Obtenemos el parámetro "name" de la URL
    # Ejemplo: /api/cocktails?name=margarita
    # request.args.get("name") extrae el valor "margarita"
    name = request.args.get("name")
    
    # Validación de seguridad:
    # Si el usuario no envía ningún nombre, devolvemos error 400 (Bad Request)
    if not name:
        return jsonify({"error": "No se proporcionó el nombre del cóctel"}), 400

    # Construimos la URL de la API externa (TheCocktailDB)
    # Insertamos el nombre del cóctel en la URL
    url = f"https://www.thecocktaildb.com/api/json/v1/1/search.php?s={name}"
    
    try:
        # Hacemos una petición GET a la API externa
        # timeout=5 evita que la petición quede colgada indefinidamente
        response = requests.get(url, timeout=5)

        # raise_for_status() genera una excepción si la respuesta HTTP es error (404, 500, etc.)
        response.raise_for_status()

        # Convertimos la respuesta a formato JSON (diccionario de Python)
        data = response.json()

    # Si ocurre cualquier error de conexión o HTTP,
    # capturamos la excepción para evitar que el servidor se rompa
    except requests.RequestException as e:
        return jsonify({
            "error": "Error al conectar con la API externa",
            "details": str(e)
        }), 500

    # Si todo va bien, devolvemos los datos al frontend en formato JSON
    return jsonify(data)


# Creamos otro endpoint llamado "/api/demo"
# Este endpoint simula una API propia (datos creados manualmente)
@app.route("/api/demo")
def demo_api():

    # Creamos un diccionario que imita la estructura real de la API externa
    data = {
        "drinks": [
            {
                "strDrink": "Cóctel Simulado",
                "strCategory": "Demo Category",
                "strAlcoholic": "Non alcoholic",
                "strInstructions": "Mezclar ingredientes imaginarios y servir frío.",
                "strDrinkThumb": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRst5iDaj9RDfp6FpW3uLWFE0nnPSDAoPPWsg&s"
            }
        ]
    }

    # Devolvemos los datos en formato JSON
    return jsonify(data)


# Este bloque solo se ejecuta si el archivo se ejecuta directamente
# (no si es importado desde otro archivo)
if __name__ == "__main__":

    # Iniciamos el servidor en modo debug
    # debug=True permite ver errores detallados y recargar automáticamente
    app.run(debug=True)
```


## 6. Explicación del fronted 

## 🔸 Código HTML explicado 
- Input de búsqueda
- Botón de búsqueda y botón API simulada
- Contenedor para mostrar tarjetas
- Se enlazan correctamente los archivos estáticos:
```html
<link rel="stylesheet" href="{{ url_for('static', filename='css/styles.css') }}">
<script src="{{ url_for('static', filename='js/script.js') }}"></script>
```

---

## 🔸 Código CSS explicado (`static/css/styles.css`)
- Grid responsivo para tarjetas
- Estilo de tarjetas, sombras y colores

---


## 🔸 Código JavaScript explicado (`static/js/script.js`)

- Función `renderCocktails()` para crear tarjetas dinámicamente
- Fetch a API externa y API simulada
- Manejo de errores y validación de input

---
## 7. Conceptos aplicados

- Arquitectura `cliente-servidor`
- Endpoints `REST`
- Peticiones `HTTP GET`
- Formato `JSON`
- Uso de `fetch()`
- Manipulación del `DOM`
- Validación de input y manejo de errores en backend
- Separación frontend/backend
- Organización modular del proyecto

---

## 8. Instalación y ejecución

1. Crear entorno virtual:

```python -m venv venv```

2. Activar entorno:

Windows:

```venv\Scripts\activate```

3. Mac/Linux:

```source venv/bin/activate```

4. Instalar dependencias:

```pip install -r requirements.txt```

5. Ejecutar servidor:

```python app.py```

6. Abrir navegador en:

```http://127.0.0.1:5000/```

## 9. Conclusiones
Esta práctica demuestra la comprensión del consumo de APIs externas mediante `fetch()`, la creación de endpoints propios con `Flask` y la integración dinámica de datos en una aplicación web estructurada bajo el modelo cliente-servidor.

La inclusión de un endpoint simulado refuerza el entendimiento del diseño de `APIs REST` y permite desacoplar el frontend de servicios externos.

El uso de validaciones y manejo de errores asegura que la aplicación no falle ante entradas inválidas ni errores en la API externa, mostrando mensajes claros al usuario.