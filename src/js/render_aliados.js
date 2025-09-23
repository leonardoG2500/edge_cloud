fetch('/data/aliados.json')
  .then(res => res.json())
  .then(aliados => {
    const container = document.getElementById('aliados-container');
    aliados.forEach(aliado => {
      const card = document.createElement('div');
      card.className = 'col-lg-4 col-md-6 card-contact';
      card.innerHTML = `
        <div class="service-item-contact position-relative h-100 d-flex justify-content-center align-items-center">
          <div class="preview-img" style="background-image: url('${aliado.preview}')"></div>
          <a href="${aliado.url}" target="_blank" rel="noopener noreferrer">
            <div class="service-text-contact rounded text-center">
              <div class="btn-square rounded-circle mx-auto" style="width: 150px; height: 150px;">
                <img class="img-fluid" src="${aliado.logo}" alt="${aliado.nombre}">
              </div>
            </div>
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  });
