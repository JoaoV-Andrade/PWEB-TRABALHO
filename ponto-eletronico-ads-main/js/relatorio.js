function formatarData(date) {
    return String(date.getDate()).padStart(2, '0') + "/" +
           String(date.getMonth() + 1).padStart(2, '0') + "/" +
           date.getFullYear();
}

document.getElementById("filtro-periodo").addEventListener("change", function() {
    criarRelatorio(this.value);
});


function criarRelatorio(filtro = "todos") {
    const containerRegistros = document.getElementById("container-registros");
    containerRegistros.innerHTML = "";

    let registros = JSON.parse(localStorage.getItem("registro")) || [];
    let agora = new Date();

    if (filtro === "semana") {
        let umaSemanaAtras = new Date();
        umaSemanaAtras.setDate(agora.getDate() - 7);
        registros = registros.filter(registro => {
            let dataRegistro = new Date(registro.data.split("/").reverse().join("-"));
            return dataRegistro >= umaSemanaAtras;
        });
    } else if (filtro === "mes") {
        let umMesAtras = new Date();
        umMesAtras.setMonth(agora.getMonth() - 1);
        registros = registros.filter(registro => {
            let dataRegistro = new Date(registro.data.split("/").reverse().join("-"));
            return dataRegistro >= umMesAtras;
        });
    }

    registros.forEach((registro, index) => {
        const divRegistro = document.createElement("div");
        divRegistro.classList.add("registro");
    
        if (registro.status === "passado") {
            divRegistro.classList.add("ponto-passado");
        } else if (registro.status === "editado") {
            divRegistro.classList.add("ponto-editado");
        }

        if (registro.observacao) {
            divRegistro.classList.add("ponto-observacao");
        }

    
        let conteudoRegistro = `${registro.tipo} | ${registro.data} | ${registro.hora}`;
        conteudoRegistro += registro.observacao ? ` | Observação: ${registro.observacao}` : "";
        conteudoRegistro += registro.justificativa ? ` | Justificativa: ${registro.justificativa}` : "";
        conteudoRegistro += registro.arquivo ? ` | Anexo: ${registro.arquivo}` : "";
    
        divRegistro.innerHTML = `<p> ${conteudoRegistro} </p>`;
        const buttonEditar = document.createElement("button");
        buttonEditar.textContent = "Editar";
        buttonEditar.classList.add("btn-editar"); // Adiciona a classe de estilo
        buttonEditar.addEventListener("click", () => editarRegistro(index));
    
        const buttonExcluir = document.createElement("button");
        buttonExcluir.textContent = "Excluir";
        buttonExcluir.classList.add("btn-excluir"); // Adiciona a classe de estilo
        buttonExcluir.addEventListener("click", () => {
            alert("O ponto não pode ser excluído!");
        });
    
        divRegistro.appendChild(buttonEditar);
        divRegistro.appendChild(buttonExcluir);
        containerRegistros.appendChild(divRegistro);
    });
}
    criarRelatorio("todos");

function editarRegistro(index) {
    let registros = JSON.parse(localStorage.getItem("registro")) || [];
    let registro = registros[index];
    let novaJustificativa = prompt("Editar justificativa:", registro.justificativa);

    if (novaJustificativa !== null) {
        registro.justificativa = novaJustificativa;
        registro.status = "editado";
        registros[index] = registro;
        localStorage.setItem("registro", JSON.stringify(registros));
        alert("Registro editado com sucesso!");
        location.reload();
    }
}