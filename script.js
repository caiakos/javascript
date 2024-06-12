let taskList = [];
let taskDoneList = [];
let taskRemovedList = [];

function taskLoad(){ // inicia ao abrir a página
    taskList = JSON.parse(localStorage.getItem('taskList')) || []; // pega as informações salvas do localStorage
    taskRemovedList = JSON.parse(localStorage.getItem('taskRemovedList')) || [];
    taskDoneList = JSON.parse(localStorage.getItem('taskDoneList')) || [];

    console.log("taskList:", taskList);
    console.log("taskRemovedList:", taskRemovedList);
    console.log("taskDoneList:", taskDoneList);

    updateTasks();
}

function addTask(event) { // SEM MUDANÇAS
    event.preventDefault(); // impede a página de recarregar
    let description = document.getElementById('description');
    if (description.value == '') { // checa se a descripton é vazia, null ou undefined
        showMessage(); // Chama "Mensagem de erro"
    } else {
        taskList.push(description.value);
        localStorage.setItem('taskList', JSON.stringify(taskList)) // armazena a tasklist em formato string json no localStorage
        description.value = ''; // limpa o campo
        updateTasks(); // Chama "Adicionar a tarefa"
    }
}

function closeMessage() { // Fechar mensagem de erro SEM MUDANÇAS
    let alert = document.getElementById('alert');
    alert.style.display = 'none'; // torna a mensagem de erro invisível
}

function showMessage() { // Mensagem de erro SEM MUDANÇAS
    let message_type = document.getElementById('message_type');
    message_type.innerText = 'Erro: '; // define o texto a ser exibido

    let message = document.getElementById('message');
    message.innerText = 'Você precisa descrever a nova tarefa.'; // define o texto a ser exibido

    let alert = document.getElementById('alert');
    alert.style.display = 'block';
    setTimeout(() => { // inicia um timer de 4s (4000 ms)
        closeMessage(); // Chama "Fechar mensagem de erro"
    }, 4000); 
}

function updateTasks() { // Adicionar a tarefa 
    let divTasks = document.getElementById('tasks');
    const button = document.getElementById ('randomButton'); // cria uma variável

    if (taskList.length > 0) {
        let newOl = document.createElement('ol'); // cria uma lista ordenada 

        taskList.forEach((task, task2) => {
            let newLi = document.createElement('li'); // cria um li
            newLi.innerText = task; // adiciona o texto da task no li

            let removeButton = document.createElement('button'); // cria um button
            removeButton.innerText = 'x'; // adiciona o texto "x" no button
            removeButton.classList.add('removebutton'); // cria a classe "removebutton" para o button
            removeButton.onclick = () => removeTask(task2); // chama a função removeTask com o argumento da task removida

            let doneButton = document.createElement('button'); // cria um button
            doneButton.innerText = '✔'; // adiciona o texto "✔" no button
            doneButton.classList.add('donebutton'); // cria a classe "donebutton" para o button
            doneButton.onclick = () => doneTask(task2); // chama a função doneTask com o argumento da Li que está sendo criada

            newLi.appendChild(doneButton); // adiciona o donebutton como "filho" do li
            newLi.appendChild(removeButton); // adiciona o removebutton como "filho" do li

            if (taskDoneList.includes(task2)) { // checa se a task2 está na taskDoneList
                newLi.classList.add('donetask'); // adiciona a classe 'donetask' ao newLi
            }

            newOl.appendChild(newLi); // adiciona o li como "filho" do ol
            
        });

        divTasks.replaceChildren(newOl); // substitui tudo que tinha dentro da div tasks pelo ol
        button.removeAttribute('disabled'); // ativa o botão (quando houver task)
    }else{ // faz aparecer o texto caso não tenha nenhuma task 
        let p = document.createElement('p'); // cria um parágrafo
        p.innerText = 'Insira a primeira tarefa para começar....'; // adiciona o texto no button
        divTasks.replaceChildren(p); // substitui tudo que tinha dentro da div tasks pelo p

        button.setAttribute('disabled', ''); // desativa o botão (quando não houver task)
    }
    
}

function removeAll() { // Remove todas as tasks 
    taskList = [];
    taskDoneList = [];
    taskRemovedList = [];
    localStorage.removeItem('taskList'); // Remove o 'taskList' da localStorage
    localStorage.removeItem('taskDoneList'); // Remove o 'taskDoneList' da localStorage
    localStorage.removeItem('taskRemovedList'); // Remove o 'taskRemovedList' da localStorage
    updateTasks(); // Chama "Adicionar a tarefa" para que o texto reapareça
}

function randomTask() { // Escolhe uma task aleatória
    if (taskList.length > 0) { // faz a função só ser executada caso tenha tasks na lista
        let randomNumber = Math.floor(taskList.length*Math.random()); // escolhe um número aleatório entre 0 e o total de tasks
        alertTask(taskList[randomNumber]);  // chama a função alertTask usando taskList[randomNumber] como argumento
    }
}

function alertTask(task) { // Alerta a task
    alert("Você deve fazer: " + task) // mostra um alerta com a task selecionada
}

function removeTask(removedTask) { // Remove a task escolhida
    console.log("Tarefa removida:", taskList[removedTask]);
    taskList.splice(removedTask,1); // remove a task da taskList
    taskRemovedList.push(removedTask); // adiciona a task removida à taskRemovedList
    let checkr = taskDoneList.indexOf(removedTask); // encontra a posição do removed na taskDoneList (caso não tenha, checkr = -1)
    if (checkr !== -1) { // verifica se a task está na taskDoneList
        taskDoneList.splice(checkr, 1); // remove o removedTask (se encontrado) da taskDoneList
    }

    taskDoneList = taskDoneList.map(taskIndex => taskIndex > removedTask ? taskIndex - 1 : taskIndex); 
    /* map() itera sobre cada elemento da taskDoneList /// taskIndex é a variável que representa cada elemento da taskDoneList /// => função que define o que vai acontecer com cada elemento da iteração ///
    caso o taskIndex seja maior que a removedTask, taskIndex -1, caso seja menor ou igual, nada acontece*/

    localStorage.setItem('taskList', JSON.stringify(taskList)); // atualiza a localStorage taskList
    localStorage.setItem('taskRemovedList', JSON.stringify(taskRemovedList)); // atualiza a localStorage taskRemovedList
    localStorage.setItem('taskDoneList', JSON.stringify(taskDoneList)); // atualiza a localStorage taskDoneList
    console.log("taskRemovedList atualizado:", taskRemovedList);
    updateTasks();
}

function doneTask(checkTask) {  // Adiciona ou remove a task da taskDoneList
    let check = taskDoneList.indexOf(checkTask); // encontra a posição do checkTask na taskDoneList (caso não tenha, check = -1)
    if (check !== -1) { // verifica se a task está na taskDoneList
        taskDoneList.splice(check, 1); // remove o checkTask (se encontrado) da taskDoneList
    } else {
        taskDoneList.push(checkTask); // adiciona a task na taskDoneList
    }

    localStorage.setItem('taskDoneList', JSON.stringify(taskDoneList)); // atualiza a localStorage taskDoneList

    console.log("Tarefa concluída:", taskList[checkTask]);
    console.log("taskDoneList atualizado:", taskDoneList);

    updateTasks();
}

function filterTask(){
    let filter = document.getElementById('filter').value.toLowerCase(); // toLowerCase -> minúscula
    let tasks = document.getElementsByTagName('li');

    for (let i = 0; i < tasks.length; i++) { // passa por todas as tasks
        let taskText = tasks[i].innerText.toLowerCase(); // pega o texto da tarefa em minúsculas
        if (taskText.indexOf(filter) > -1) { // verifica se a task tem o que está sendo filtrado (caso não tenha = -1)
            tasks[i].style.display = ''; // exibe a task ('' = display padrão)
        } else {
            tasks[i].style.display = 'none'; // oculta a task
        }
    }
}

function filterClear() {
    document.getElementById('filter').value = ''; // limpa o input filtro
    filterTask(); // chama a função filterTask para atualizar as tasks exibidas
}