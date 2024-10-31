const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");
const arrayDayWeek = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sabado"]

const dialogPonto = document.getElementById("dialog-ponto");



function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            }
            resolve(userLocation);
        },
        (error) => {
            reject(error);
        })
    })
}


let proxPonto = {
    "entrada": "intervalo",
    "intervalo": "volta-intervalo",
    "volta-intervalo": "saida",
    "saida": "entrada"
}


let dialogHora = document.getElementById("dialog-hora");
let dialogData = document.getElementById("dialog-data");

dialogData.textContent = "Data: " + dataCompleta();

const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
btnRegistrarPonto.addEventListener("click", () => {
    let dialogSelect = document.getElementById("select-tipos-ponto");
    let ultimoPonto = localStorage.getItem("tipoUltimoPonto");
    dialogSelect.value = proxPonto[ultimoPonto];
    

    dialogPonto.showModal();
});


const btnDialogFechar = document.getElementById("btn-dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});


function recuperaPontosLocalStorage() {
    let todosOsPontos = localStorage.getItem("registro");

    if(!todosOsPontos) {
        return [];
    }

    return JSON.parse(todosOsPontos);
}



function salvarRegistroLocalStorage(ponto) {
    let pontos = recuperaPontosLocalStorage();
    if (!Array.isArray(pontos)) {
        pontos = [];
    }
    pontos.push(ponto);

    localStorage.setItem("registro", JSON.stringify(pontos));
}

const divAlerta = document.getElementById("div-alerta");

const btnDialogRegistrarPonto = document.getElementById("btn-dialog-registrar-ponto");
btnDialogRegistrarPonto.addEventListener("click", async () => {
    let data = dataCompleta();
    let hora = horaCompleta();
    let tipoPonto = document.getElementById("select-tipos-ponto").value;
    let observacao = document.getElementById("observacao").value || "";
    let location = await getUserLocation();

    let ponto = {
        "data": data,
        "hora": hora,
        "tipo": tipoPonto,
        "observacao": observacao,
        "location": location,
        "id": 1
    };

    salvarRegistroLocalStorage(ponto);
    localStorage.setItem("tipoUltimoPonto", tipoPonto);

    dialogPonto.close();
    divAlerta.classList.remove("hidden");
    divAlerta.classList.add("show");

    setTimeout(() => {
        divAlerta.classList.remove("show");
        divAlerta.classList.add("hidden");
    }, 5000);
});

function daySemana() {
    const date = new Date();
    return arrayDayWeek[date.getDay()];
}

function dataCompleta() {
    const date = new Date();
    return String(date.getDate()).padStart(2, '0') + "/" + String(date.getMonth() + 1).padStart(2, '0') + "/" + date.getFullYear();
}

function horaCompleta() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

function atualizaHora() {
    horaMinSeg.textContent = horaCompleta();
}

function atualizaHoraDialog() {
    dialogHora.textContent = "Hora: " + horaCompleta();
}

atualizaHora();
setInterval(atualizaHora, 1000);

atualizaHoraDialog()
setInterval(atualizaHoraDialog, 1000);

diaSemana.textContent = daySemana();
diaMesAno.textContent = dataCompleta();



const btnPontoPassado = document.getElementById("ponto-passado");
const dialogPontoPassado = document.getElementById("dialog-ponto-passado");
btnPontoPassado.addEventListener("click", () => { 

    dialogPontoPassado.showModal();
});
const btnDialogFecharPontoPassado = document.getElementById("btn-dialog-fechar-ponto-passado");
btnDialogFecharPontoPassado.addEventListener("click", () => {
    dialogPontoPassado.close();
});

const btnDialogRegistrarPontoPassado = document.getElementById("btn-dialog-reg-ponto-passado");
btnDialogRegistrarPontoPassado.addEventListener("click", async () => {
    let data = document.getElementById("data-passada").value;
    let hora = document.getElementById("hora-passada").value;
    let tipoPontoPassado = document.getElementById("select-tipos-ponto-passado").value;
    let justificativaFalta = document.getElementById("justificativa").value;

    let dataObj = new Date(data);
    let dataFormatada = String(dataObj.getDate()).padStart(2, '0') + "/" +
                        String(dataObj.getMonth() + 1).padStart(2, '0') + "/" +
                        dataObj.getFullYear();

    let pontoPassado = {
       "data": dataFormatada,
       "hora": hora,
       "tipo": tipoPontoPassado,
       "id": 2,
       "justificativa": justificativaFalta,
       "status": "passado"
    };

    salvarRegistroLocalStorage(pontoPassado);
    
    dialogPontoPassado.close();
    divAlerta.classList.remove("hidden");
    divAlerta.classList.add("show");

    setTimeout(() => {
        divAlerta.classList.remove("show");
        divAlerta.classList.add("hidden");
    }, 5000);
});

function salvarRegistroLocalStoragePassado(pontopassado) {
    let pontos = recuperaPontosLocalStorage();
    if (!Array.isArray(pontos)) {
        pontos = [];
    }
    pontos.push(pontopassado);
    localStorage.setItem("registro", JSON.stringify(pontos));
}


const inputDate = document.getElementById('data-passada');

const today = new Date();
today.setDate(today.getDate() - 1); 
const yesterday = today.toISOString().split('T')[0];
inputDate.max = yesterday;