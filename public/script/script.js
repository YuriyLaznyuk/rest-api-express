const btnReset = document.getElementById('reset');
const tbody = document.getElementById('tbody');
const form = document.forms["userForm"];
const host=window.location.origin;

// reset form
function reset() {
    form.elements['name'].value = '';
    form.elements['level'].value = '';
    form.elements["id"].value = 0;
}

btnReset.addEventListener('click', (e) => {
    e.preventDefault();
    reset();
});

function getUserId(id) {
    fetch(host+"/api/users/" + id, {
        method: "GET",
        headers: { "Content-Type": "application/json; charset=utf-8"}
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(json => {
        form.elements['id'].value = json.id;
        form.elements['name'].value = json.name;
        form.elements['level'].value = json.level;
    }).catch((err) => console.log(err));
}

function deleteUsers(id) {
    fetch(host+"/api/users/" + id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=utf-8"}
    }).then(res => {
        if (res.ok) {
            document.getElementById(`${id}`).remove();
        }
    }).catch((err) => console.log(err));
}


// render row
function renderRow(item) {
    const { id, name, level } = item;
    return (
        `<tr class="list" id=${id}>
            <td>${id}</td>
            <td>${name}</td>
            <td>${level}</td>
            <td class="td_btn">
            
            <button data-id=${id}
                onclick="getUserId(this.dataset.id)"
            >
                Edit
            </button>
            <button 
                onclick="deleteUsers(this.dataset.id)" 
                data-id=${id}
            >
                Delete
            </button>
            </td>
        </tr>`
    );
}

function getUsers() {
    fetch(host+"/api/users")
        .then(res => res.json())
        .then(json => {
            json.forEach(i => tbody.innerHTML += renderRow(i));
        })
        .catch((err) => console.log(err));
}

function createUsers(userName, userLevel) {
    fetch(host+"/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            name: userName,
            level: userLevel
        })
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(json => {
        tbody.innerHTML += renderRow(json);
        reset();
    }).catch((err) => console.log(err));
}

function updateUser(userId, userName, userLevel) {
    fetch(host+"/api/users", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            id: userId,
            name: userName,
            level: userLevel
        })
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(json => {
        reset();
     document.getElementById(`${userId}`)
         .innerHTML=renderRow(json);
    }).catch((err) => console.log(err));
}

// submit form
form.addEventListener('submit', e => {
    e.preventDefault();
    let id = form.elements['id'].value;
    let name = form.elements['name'].value;
    let level = form.elements['level'].value;
    (id == 0)
        ? createUsers(name, level)
        : updateUser(id, name, level);
});

getUsers();