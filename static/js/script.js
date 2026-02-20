const searchBtn = document.getElementById("searchBtn");
const demoBtn = document.getElementById("demoBtn");
const resultDiv = document.getElementById("result");
const searchInput = document.getElementById("searchInput");

/* Función reutilizable para renderizar cócteles */
function renderCocktails(data) {
    resultDiv.innerHTML = "";

    if (data.drinks) {
        data.drinks.forEach(drink => {
            const card = document.createElement("div");
            card.classList.add("cocktail-card");

            card.innerHTML = `
                <h2>${drink.strDrink}</h2>
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <p><strong>Categoría:</strong> ${drink.strCategory}</p>
                <p><strong>Tipo:</strong> ${drink.strAlcoholic}</p>
                <p><strong>Instrucciones:</strong> ${drink.strInstructions}</p>
            `;

            resultDiv.appendChild(card);
        });
    } else {
        resultDiv.innerHTML = "<p>No se encontró ningún cóctel.</p>";
    }
}

/* Búsqueda real (API externa vía Flask) */
searchBtn.addEventListener("click", () => {
    const cocktailName = searchInput.value.trim();

    if (cocktailName === "") {
        resultDiv.innerHTML = "<p>Por favor, escribe el nombre de un cóctel.</p>";
        return;
    }

    fetch(`/api/cocktails?name=${cocktailName}`)
        .then(response => response.json())
        .then(data => renderCocktails(data))
        .catch(error => {
            resultDiv.innerHTML = "<p>Error al conectar con la API.</p>";
            console.error(error);
        });
});

/* API simulada */
demoBtn.addEventListener("click", () => {
    fetch("/api/demo")
        .then(response => response.json())
        .then(data => renderCocktails(data))
        .catch(error => {
            resultDiv.innerHTML = "<p>Error en la API simulada.</p>";
            console.error(error);
        });
});