const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "linethrough";

var id = 1;
const restAPI = "https://jsonplaceholder.typicode.com/todos"
const option = { weekday : "long", month:"short", day:"numeric"};
const today = new Date();

var todos = Array()




clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
});


dateElement.innerHTML = today.toLocaleDateString(['ban', 'id']);


$(document).ready(function() {
    $.ajax({
        url : restAPI,
        type : 'GET',
        success : function(result) {
            todos = result
            result.forEach(element => {
                addTodo(element.userId, element.id, element.title, element.completed)
                id = element.id++
            });
        },
        error : function(error) {
            console.error("Gagal panggil API")
        }
    })
})

function addTodo(userId, id, title, completed){

    let todoItem = {
        userId : userId,
        title: title,
        id : id,
        completed : false
    }
    let position = "beforeend"
    updateUIAfterAddition(todoItem, position)
}

function createTodo(userId, id, title) {
    let todoItem = {
        userId : userId,
        title: title,
        id : id
    }
    $.ajax({
        url : restAPI,
        type : 'POST',
        data : todoItem,
        beforeSend : function() {
            console.log("Sedang menambah")
        },
        success : function(result) {
            // update UI
            console.log("Berhasil menambah")        
            let position = "afterbegin"
            updateUIAfterAddition(todoItem, position)
            todos.push(todoItem)
            id = id++
        },
        error : function(error) {
            alert("Gagal mengupdate: ",error)
            console.error("Gagal update item")
        }
    })
} 

function updateUIAfterAddition(todoItem, position) {
    let DONE = todoItem.completed ? CHECK : UNCHECK;
    let LINE = todoItem.completed ? LINE_THROUGH : "";

    let item =  `<li class= "item">
                        <i class="fa ${DONE} co" job="complete" id="${todoItem.id}"></i>
                        <p class="text ${LINE}">${todoItem.title}</p>
                        <i class="fa fa-trash-o de" job="delete" id="${todoItem.id}"></i>
                    </li>
                   `;
    list.insertAdjacentHTML(position, item);
}

document.addEventListener("keyup", function(even){
    if(event.keyCode == 13){
        let title = input.value;
        if(title){
            // userId dibuat sama seperti id
            let userId = id
            id = id++;
            createTodo(userId, id, title); 
        } else {
            console.log("Masukkan title")
        }
        input.value = "";
    }
});

function completetodo(element) {
    let selectedItem = todos[element.id]
    // update completion status
    selectedItem.completed = selectedItem.completed ? false : true;
    todos[selectedItem.id].completed = selectedItem.completed
    console.log("ID yang dipilih: ", element.id)
    $.ajax({
        url : restAPI+"/"+element.id,
        type : 'PUT',
        data : selectedItem,
        beforeSend : function() {
            console.log("Sedang mengupdate")
        },
        success : function(result) {
            // update UI
            console.log("Berhasil mengupdate")
            element.classList.toggle(CHECK);
            element.classList.toggle(UNCHECK);
            element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);        
        },
        error : function(error) {
            alert("Gagal mengupdate: ",error)
            console.error("Gagal update item")
        }
    })
}

function removetodo(element) {
    $.ajax({
        url : restAPI+"/"+element.id,
        type : 'DELETE',
        beforeSend : function() {
            console.log("Sedang menghapus")
        },
        success : function(result) {
            console.log("Berhasil menghapus")
            element.parentNode.parentNode.removeChild(element.parentNode);
        },
        error : function(error) {
            console.error("Gagal update item")
        }
    })
    
}

list.addEventListener("click", function(event){
    let element = event.target;
    let elementJob = element.attributes.job.value;
    if(elementJob == "complete"){
        completetodo(element);
    }else if(elementJob == "delete"){
        removetodo(element);
    }
});
