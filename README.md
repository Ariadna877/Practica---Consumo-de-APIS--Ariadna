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

El objetivo de esta práctica es desarrollar una aplicación web capaz de consumir información desde una API externa utilizando peticiones asíncronas (fetch) y mostrar los datos dinámicamente en una página HTML.

Además, se ha implementado un servidor de aplicaciones utilizando Flask para reforzar el concepto de arquitectura cliente-servidor.

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

1. El navegador realiza una petición al servidor Flask.
2. Flask actúa como intermediario.
3. Flask consulta la API externa.
4. Devuelve los datos al cliente en formato JSON.
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

`/`

Renderiza la vista principal.

`/api/cocktails`

Endpoint propio que actúa como proxy hacia la API externa.

`/api/demo`

Endpoint simulado que devuelve datos estáticos creados manualmente.

## 🔸 Código relevante (`app.py`)
```py
@app.route("/api/cocktails")
def get_cocktails():
    name = request.args.get("name")
    
    if not name:
        return jsonify({"error": "No se proporcionó el nombre del cóctel"}), 400

    url = f"https://www.thecocktaildb.com/api/json/v1/1/search.php?s={name}"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        return jsonify({"error": "Error al conectar con la API externa", "details": str(e)}), 500

    return jsonify(data)

@app.route("/api/demo")
def demo_api():
    data = {
        "drinks": [
            {
                "strDrink": "Cóctel Simulado",
                "strCategory": "Demo",
                "strAlcoholic": "Non alcoholic",
                "strInstructions": "Mezclar ingredientes imaginarios.",
                "strDrinkThumb": "https://via.placeholder.com/300"
            }
        ]
    }
    return jsonify(data)
```
Este endpoint demuestra la capacidad de diseñar y servir una API REST propia.

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


## 🔸 Código JavaScript explicado (static/js/script.js)

- Función renderCocktails() para crear tarjetas dinámicamente
- Fetch a API externa y API simulada
- Manejo de errores y validación de input

---
## 7. Conceptos aplicados

- Arquitectura cliente-servidor
- Endpoints REST
- Peticiones HTTP GET
- Formato JSON
- Uso de fetch()
- Manipulación del DOM
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
Esta práctica demuestra la comprensión del consumo de APIs externas mediante fetch(), la creación de endpoints propios con Flask y la integración dinámica de datos en una aplicación web estructurada bajo el modelo cliente-servidor.

La inclusión de un endpoint simulado refuerza el entendimiento del diseño de APIs REST y permite desacoplar el frontend de servicios externos.

El uso de validaciones y manejo de errores asegura que la aplicación no falle ante entradas inválidas ni errores en la API externa, mostrando mensajes claros al usuario.