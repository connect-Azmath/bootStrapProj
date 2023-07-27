//console.log("Hello World");
// const state = {
//     taskList: [
//         // const taskList = [
//         {
//             image: "",
//             title: "",
//             type: "",
//             description: "",
//         },
//          {
//             image: "",
//             title: "",
//             type: "",
//             description: "",
//         },
//          {
//             image: "",
//             title: "",
//             type: "",
//             description: "",
//         },
//          {
//             image: "",
//             title: "",
//             type: "",
//             description: "",
//         },
//          {
//             image: "",
//             title: "",
//             type: "",
//             description: "",
//         },
//     ]
// }


const state = {
    taskList: [],
};

// DOM 
const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");

console.log(taskContents);
console.log(taskModal);


const htmlTaskContent = ({id, title, description, type, url}) => `
    <div class='col-md-6 col-lg-4 mt-3'  id=${id} key=${id}>
        <div class='card shadow task__card'>
            <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
                <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick='editVehicle.apply(this,arguments)'><i class='fas fa-pencil-alt'></i></button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick='deletVehicle.apply(this,arguments)'><i class='fas fa-trash-alt'></i></button>
            </div>
            <div class='card-body'>
                ${
                    url &&
                     `<img src=${url} alt='card image class='card-img-top md-3 rounded-md' />`
                }
                <h4 class='card-title'>${title}</h4>
                <p class='card-text text-muted'>${description}</p>
                <div class='tags d-flex flex-wrap'>
                    <span class='badge text-white bg-primary m-1'>${type}</span>
                </div>
            </div>
           <div class='card-footer'>
                <button type='button' class='btn btn-outline-primary float-end' data-bs-toggle='modal' 
                data-bs-target='#vehicleDetails' id=${id} onclick='openTask.apply(this, arguments)'>Open Task</button>
            </div>
        </div>
    </div>
`



const htmlModalContent = ({id, title, description, url}) => {
    const date = new Date(parseInt(id));
    return `
    <div id=${id}>
        ${
                    url ?
                     `<img src=${url} alt='card image' class='img-fluid rounded place__holder__image mb-3'  />` :
                     `<img src='image/path' alt='card image' class='card-img-top md-3 rounded-md' />`
                }
        <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>    
         <h4 class='my-2'>${title}</h4>  
          <p class='lead text-muted'>${description}</p>  
    </div>
    `
};

// convert json data into string
const updateLocalStorage = () => {
    localStorage.setItem('task', JSON.stringify({
        tasks:  state.taskList,
    }));
};

// create a copy of local storage so that it works on page reload
const loadInitialData = () => {
 const localStorageCopy = JSON.parse(localStorage.task);

 if(localStorageCopy) state.taskList = localStorageCopy.tasks;

//  <!-- beforebegin -->
// <p>
//   <!-- afterbegin -->
//   foo
//   <!-- beforeend -->
// </p>
// <!-- afterend -->
// https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML


 state.taskList.map((cardDate) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
 });
};

const handleSubmit = () =>{
    const id = '${Date.now()}';
    const input = {
        url: document.getElementById('imageUrl').value,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('vehicleDescription').value,
        type: document.getElementById('tags').value,
    };
    console.log(input);
//{id, title, description, type, url

    if(input.title === '' || input.description=== '' || input.type===''){
        return alert("Please fill out the fields");
    }    

    taskContents.insertAdjacentHTML(
        "beforeend", htmlTaskContent({...input, id,})
    );

    state.taskList.push({...input, id});

    updateLocalStorage();

};

//Add default image in the code 2 places with tertiory condition

const openTask = (e) => {
    if(!e) e = window.event;
    console.log("Event --- ", e);
    const getTask = state.taskList.find(({id}) => id === e.target.id )
    taskModal.innerHTML = htmlModalContent(getTask);
}


//CRUD - Delete 
const deletVehicle = (e) => {
    if(!e) e = window.event;
    const targetID = e.target.getAttribute("name");
    console.log(targetID);
    const type = e.target.tagName;
    console.log(type);
    const removeVehicle = state.taskList.filter(({id}) => id !== targetID);
    console.log(removeVehicle);
    state.taskList = removeVehicle;

    console.log("Current vehicles list : ", state.taskList);
    updateLocalStorage();

    if(type === "BUTTON"){
        console.log(e.target.parentNode.parentNode.parentNode);
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
            );
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
        );
}

const editVehicle = (e) => {
    if(!e) e = window.event;
    const targetID = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let vehicleDescription;
    let taskType;
    let submitButton;

    if(type === "BUTTON"){
        parentNode = e.target.parentNode.parentNode;
        console.log(parentNode);
    }else{
        parentNode = e.target.parentNode.parentNode.parentNode;
        console.log(parentNode);
    }
    // taskTitle = parentNode.childNodes;
    // console.log(taskTitle);

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[3];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    console.log(taskTitle, "\n" , taskDescription, "\n", taskType)
    submitButton = parentNode.childNodes[5].childNodes[1];
    console.log(submitButton);

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    
    submitButton.setAttribute('onclick', "saveEdit.apply(this,arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
    if(!e) e=window.event;
    
    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    console.log(targetID, parentNode);

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];
    
    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };

    // updating the latest data on local copy
    let stateCopy = state.taskList;

    stateCopy = stateCopy.map((task) => task.id === targetID 
    ? {
        id: task.id,
        title: updateData.taskTitle,
        taskDescription: updateData.taskDescription,
        taskType: updateData.taskType,

    } 
    : 
    task
    );

    state.taskList = stateCopy;
    updateLocalStorage();
    
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
        
    submitButton.setAttribute('onclick', "openTask.apply(this,arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#vehicleDetails");
    submitButton.innerHTML = "Open Task";

}

//Search Vehicles
const searchVehicle = (e) => {
    if(!e) e = window.event;

    while (taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild)        
    }

    const resultData = state.taskList.filter(({title}) => title.includes(e.target.value));
    
    console.log(resultData);
    resultData.map((cardData) => {
        taskContents.innerAdjacentHTML("beforeEnd", htmlTaskContent(cardData))
    });
}