const API_URL = 'http://localhost:8080/api';
const TODO_API_URL = `${API_URL}/todos`;

const loader = '<div class="loader"></div>';
const TODO_LIST = document.getElementById('todo-list');

function initWelcome() {
    const CODE_TO_EMOJI = {
        'pl': '🇵🇱',
        'en': '🇺🇸',
        'de': '🇩🇪'
    };

    fetch(`${API_URL}/langs`)
        .then(processOkResponse)
        .then(langArr => {
            document.getElementById('langs').innerHTML = langArr.map(lang => `
                <label class="lang-container">
                    <input type="radio" name="lang" value="${lang.id}">
                    ${CODE_TO_EMOJI[lang.code]}
                </label>
            `).join('\n');
            document.getElementById('submit-btn').addEventListener('click', event => submitWelcomeForm(event));
        });
}

function submitWelcomeForm(event) {
    event.preventDefault();
    const todoInput = document.getElementById('todoInput');
    let lang;
    try {
        lang = document.querySelector('input[name="lang"]:checked').value;
    } catch (e) { lang = ''; }
    const formObj = {
        name: todoInput.value,
        lang: lang
    }
    fetch(`${API_URL}?${new URLSearchParams(formObj)}`)
        .then(response => response.text())
        .then(txt => {
            document.getElementById('title').innerText = txt;
            todoInput.setAttribute('placeholder', 'add new todo');
            todoInput.value = '';
            TODO_LIST.style.display = '';
            document.getElementById('lang-form').remove();
            todoInput.addEventListener('keypress', event => {
                if (event.key === 'Enter' && todoInput.value.trim() !== '') {
                    event.preventDefault();
                    addTodo(todoInput.value.trim());
                    todoInput.value = '';
                }
            })
        })

    fetch(TODO_API_URL)
        .then(processOkResponse)
        .then(todos => todos.forEach(createTodo))
        .catch(console.warn);
}

function addTodo(todo) {
    fetch(TODO_API_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: todo })
    })
        .then(processOkResponse)
        .then(createTodo)
        .catch(console.warn)
}

function createTodo(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-app__item');
    li.setAttribute('id', `todo-id-${todo.id}`);

    const div = document.createElement('div');
    div.classList.add('todo-app__checkbox');

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.checked = todo.done;

    const label = document.createElement('label');
    label.setAttribute('htmlFor', `todo-id-${todo.id}`);

    div.appendChild(input);
    div.appendChild(label);

    const h1 = document.createElement('h1');
    h1.innerText = todo.text;
    h1.setAttribute('class', input.checked? 'todo-app__item-detail-completed': 'todo-app__item-detail');

    div.addEventListener('click', event => {
        event.preventDefault();
        fetch(`${TODO_API_URL}/${todo.id}`, { method: 'PUT' })
            .then(processOkResponse)
            .then(todo => {
                input.checked = !!todo.done;
                h1.setAttribute('class', input.checked? 'todo-app__item-detail-completed': 'todo-app__item-detail');
            })
            .catch(console.warn);
    });

    let img = document.createElement('img');
    img.classList.add('todo-app__item-x');
    img.setAttribute('src', './img/x.png');
    img.addEventListener('click', event => {
        event.preventDefault();
        fetch(`${TODO_API_URL}/${todo.id}`, { method: 'DELETE' })
            .then(processOkResponse)
            .then(_ => removeById(todo.id))
            .catch(console.warn);
    });

    li.appendChild(div);
    li.appendChild(h1);
    li.appendChild(img);

    TODO_LIST.appendChild(li);
}

function removeById(id) {
    document.getElementById(`todo-id-${id}`).remove();
}

function processOkResponse(response = {}) {
    if (response.ok) {
        return response.json();
    }
    throw new Error(`Status not 200 (${response.status})`);
}

window.onload = () => initWelcome();