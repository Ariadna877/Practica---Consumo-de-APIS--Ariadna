from flask import Flask, render_template, jsonify, request
import requests


app = Flask(__name__) 


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/cocktails")
def get_cocktails():
    name = request.args.get("name")
    
    if not name:  # Validación de seguridad
        return jsonify({"error": "No se proporcionó el nombre del cóctel"}), 400

    url = f"https://www.thecocktaildb.com/api/json/v1/1/search.php?s={name}"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()  # Lanza excepción si hay error HTTP
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
                "strCategory": "Demo Category",
                "strAlcoholic": "Non alcoholic",
                "strInstructions": "Mezclar ingredientes imaginarios y servir frío.",
                "strDrinkThumb": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRst5iDaj9RDfp6FpW3uLWFE0nnPSDAoPPWsg&s"
            }
        ]
    }
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)