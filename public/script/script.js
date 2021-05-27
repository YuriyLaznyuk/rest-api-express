let btnReset = document.getElementById('reset');
let tbody = document.getElementById('tbody');
let list = "";
const form = document.forms["userForm"];

btnReset.addEventListener('click', (e) => {
    e.preventDefault();
    reset();
});

// render row
function row(i) {
    return (
        `<tr class="list" id=${i.id}>
<td>${i.id}</td>
<td>${i.name}</td>
<td>${i.level}</td>
<td class="td_btn">
<button data-id=${i.id}
 onclick="getUserId(this.dataset.id)">
update</button>
<button class="del" 
onclick="deleteUsers(this.dataset.id)" 
data-id=${i.id}>delete</button>
</td>
</tr>`
    );

}

function getUsers() {
    fetch("/api/users").then(res => res.json()).then(json => {
        json.forEach(i => tbody.innerHTML += row(i));
    });

}

function getUserId(id) {
    fetch("/api/users/" + id, {
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

    });

}

function deleteUsers(id) {
    fetch("/api/users/" + id, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=utf-8"}
    }).then(res => {
        if (res.ok) {
            document.getElementById(`${id}`).remove();

        }
    });
}

function createUsers(userName, userLevel) {
    fetch("/api/users", {
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

        tbody.innerHTML += row(json);
        reset();
    });
}

function updateUser(userId, userName, userLevel) {
    fetch("/api/users", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(
            {
                id: userId,
                name: userName,
                level: userLevel
            }
        )

    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(json => {
        reset();
     document.getElementById(`${userId}`)
         .innerHTML=row(json);

    });

}

// reset form
function reset() {
    form.elements['name'].value = '';
    form.elements['level'].value = '';
    form.elements["id"].value = 0;

}

// submit form
form.addEventListener('submit', e => {

    e.preventDefault();
    let id = form.elements['id'].value;
    let name = form.elements['name'].value;
    let level = form.elements['level'].value;
    (id == 0) ?
    createUsers(name, level)
    : updateUser(id, name, level);
});

getUsers();