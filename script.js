let orderNumber = 1;
let totalEfectivo = 0;
let totalQR = 0;
let totalVehicles = 0;

// Cargar datos desde localStorage si existen
window.onload = () => {
  loadHistory();
  updateSummary();
};

const form = document.getElementById('vehicleForm');
const historyTable = document.querySelector('#historyTable tbody');
const totalEfectivoSpan = document.getElementById('totalEfectivo');
const totalQRSpan = document.getElementById('totalQR');
const totalVehiclesSpan = document.getElementById('totalVehicles');
const clearHistoryButton = document.getElementById('clearHistory');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Obtener datos del formulario
  const vehicleType = document.getElementById('vehicleType').value;
  const licensePlate = document.getElementById('licensePlate').value;
  const ownerName = document.getElementById('ownerName').value;
  const ownerPhone = document.getElementById('ownerPhone').value;
  const observations = document.getElementById('observations').value;
  const worker = document.getElementById('worker').value;
  const entryTime = document.getElementById('entryTime').value;
  const exitTime = document.getElementById('exitTime').value;
  const paymentMethod = document.getElementById('paymentMethod').value;
  const discount = document.getElementById('discount').checked;

  // Procesos seleccionados
  const processes = [];
  const processCheckboxes = document.querySelectorAll('#processes input[type="checkbox"]:checked');
  processCheckboxes.forEach(checkbox => processes.push(checkbox.value));

  // Precios de procesos
  const prices = {
    "lavadoSencillo": { "automovil": 40.000, "camioneta": 45.000, "moto": 0 },
    "brilladoVIP": { "automovil": 80.000, "camioneta": 90.000, "moto": 35.000 },
    "lavadoPremium": { "automovil": 130.000, "camioneta": 140.000, "moto": 0 },
    "lavadoDiamante": { "automovil": 230.000, "camioneta": 250.000, "moto": 0 },
    "detailingDiamante": { "automovil": 400.000, "camioneta": 500.000, "moto": 0 },
    "ceramicoDiamante": { "automovil": 700.000, "camioneta": 800.000, "moto": 0 },
    "lavadoVIPMoto": { "automovil": 0, "camioneta": 0, "moto": 35000 }
  };

  let totalPrice = 0;

  // Sumar precio de los procesos
  processes.forEach(process => {
    totalPrice += prices[process][vehicleType];
  });

  // Aplicar descuento si es necesario
  if (discount) {
    totalPrice *= 0.9;
  }

  // Sumar servicios adicionales
  const additionalServices = document.querySelectorAll('#additionalServices input[type="checkbox"]:checked');
  additionalServices.forEach(service => {
    if (service.value === 'exterior' || service.value === 'interior') {
      totalPrice += 4000;
    } else {
      totalPrice += 5000;
    }
  });

  // Crear fila de historial
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${orderNumber}</td>
    <td>${vehicleType}</td>
    <td>${licensePlate}</td>
    <td>${worker}</td>
    <td>${totalPrice}</td>
    <td>${paymentMethod}</td>
  `;
  historyTable.appendChild(row);

  // Guardar datos en localStorage
  saveToLocalStorage(orderNumber, vehicleType, licensePlate, worker, totalPrice, paymentMethod);

  // Actualizar totales
  if (paymentMethod === 'efectivo') {
    totalEfectivo += totalPrice;
  } else {
    totalQR += totalPrice;
  }

  totalVehicles++;
  totalEfectivoSpan.textContent = totalEfectivo;
  totalQRSpan.textContent = totalQR;
  totalVehiclesSpan.textContent = totalVehicles;

  // Incrementar número de orden
  orderNumber++;

  // Limpiar el formulario
  form.reset();
});

clearHistoryButton.addEventListener('click', function () {
  historyTable.innerHTML = '';
  localStorage.clear();
  totalEfectivo = 0;
  totalQR = 0;
  totalVehicles = 0;
  totalEfectivoSpan.textContent = totalEfectivo;
  totalQRSpan.textContent = totalQR;
  totalVehiclesSpan.textContent = totalVehicles;
});

function saveToLocalStorage(orderNumber, vehicleType, licensePlate, worker, totalPrice, paymentMethod) {
  let history = JSON.parse(localStorage.getItem('vehicleHistory')) || [];
  history.push({ orderNumber, vehicleType, licensePlate, worker, totalPrice, paymentMethod });
  localStorage.setItem('vehicleHistory', JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem('vehicleHistory')) || [];
  historyTable.innerHTML = '';
  history.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.orderNumber}</td>
      <td>${record.vehicleType}</td>
      <td>${record.licensePlate}</td>
      <td>${record.worker}</td>
      <td>${record.totalPrice}</td>
      <td>${record.paymentMethod}</td>
    `;
    historyTable.appendChild(row);
  });
}

function updateSummary() {
  let history = JSON.parse(localStorage.getItem('vehicleHistory')) || [];
  history.forEach(record => {
    if (record.paymentMethod === 'efectivo') {
      totalEfectivo += record.totalPrice;
    } else {
      totalQR += record.totalPrice;
    }
  });
  totalVehicles = history.length;
  totalEfectivoSpan.textContent = totalEfectivo;
  totalQRSpan.textContent = totalQR;
  totalVehiclesSpan.textContent = totalVehicles;
}