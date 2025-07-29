// colores.js

// Mapa de colores por producto
const coloresPorProducto = {
  "AirMax Runner Pro":    ["#2a2a72", "#1e1e24", "#ffa400"],
  "Urban Flex 2023":      ["#1e1e24", "#6c757d", "#f8f9fa"],
  "Retro 90's Edition":   ["#ffa400", "#ff6b6b", "#2a2a72"],
  "Trail Blazer XT":      ["#1e1e24", "#2a2a72", "#6c757d"],
  "Court Classic":        ["#ffffff", "#000000", "#888888"],
  "Ultra Light 2.0":      ["#f1c40f", "#e74c3c", "#3498db"],
  "Performance Run":      ["#27ae60", "#8e44ad", "#d35400"],
  "Street Style Pro":     ["#34495e", "#7f8c8d", "#ecf0f1"]
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-card').forEach(card => {
    const nombre = card.querySelector('.product-info h3').textContent.trim();
    const container = card.querySelector('.color-options');
    const colores = coloresPorProducto[nombre] || [];

    // limpia cualquier opción previa
    container.innerHTML = '';

    // crea cada .color-option
    colores.forEach(code => {
      const div = document.createElement('div');
      div.classList.add('color-option');
      div.dataset.color = code;
      div.style.backgroundColor = code;
      container.appendChild(div);
    });
  });
});

