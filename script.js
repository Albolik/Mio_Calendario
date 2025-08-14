const calendarGrid = document.getElementById('calendarGrid');
const currentMonthYear = document.getElementById('currentMonthYear');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('newTaskInput');
const addTaskButton = document.getElementById('addTaskButton');

let currentDate = new Date();
let selectedDate = null;
let tasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};

function renderCalendar() {
    calendarGrid.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    currentMonthYear.textContent = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(currentDate);

    // Nuova sequenza di giorni della settimana
    const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    weekDays.forEach(dayName => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = dayName;
        dayHeader.classList.add('day-header');
        calendarGrid.appendChild(dayHeader);
    });

    // Calcola le celle vuote per far iniziare la settimana di lunedì
    let startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        calendarGrid.appendChild(emptyDay);
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const day = document.createElement('div');
        day.textContent = i;
        day.classList.add('day');
        day.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        day.addEventListener('click', () => selectDate(day));

        const dateKey = day.dataset.date;
        if (tasks[dateKey] && tasks[dateKey].length > 0) {
            day.classList.add('has-tasks');
            const taskCount = document.createElement('span');
            taskCount.classList.add('task-count');
            taskCount.textContent = tasks[dateKey].length;
            day.appendChild(taskCount);
        }

        calendarGrid.appendChild(day);
    }
}

function selectDate(dayElement) {
    if (selectedDate) {
        const prevSelected = document.querySelector('.day.selected');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }
    }

    dayElement.classList.add('selected');
    selectedDate = dayElement.dataset.date;
    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = '';
    if (selectedDate) {
        const tasksForDate = tasks[selectedDate] || [];
        if (tasksForDate.length > 0) {
            tasksForDate.forEach((task, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${task.text}</span>
                    <div>
                        <button class="toggle-complete">${task.completed ? 'Annulla' : 'Completa'}</button>
                        <button class="delete-task">Elimina</button>
                    </div>
                `;
                if (task.completed) {
                    li.classList.add('completed');
                }

                li.querySelector('.toggle-complete').addEventListener('click', () => {
                    toggleTaskComplete(index);
                });
                li.querySelector('.delete-task').addEventListener('click', () => {
                    deleteTask(index);
                });

                taskList.appendChild(li);
            });
        } else {
            taskList.textContent = "Nessuna attività per questa data.";
        }
    } else {
        taskList.textContent = "Seleziona una data per visualizzare le attività.";
    }
}

function addTask() {
    if (selectedDate && newTaskInput.value.trim() !== '') {
        const newTask = {
            text: newTaskInput.value,
            completed: false
        };

        if (!tasks[selectedDate]) {
            tasks[selectedDate] = [];
        }
        tasks[selectedDate].push(newTask);
        saveTasks();
        newTaskInput.value = '';
        displayTasks();
        renderCalendar();
    }
}

function toggleTaskComplete(index) {
    if (selectedDate && tasks[selectedDate]) {
        tasks[selectedDate][index].completed = !tasks[selectedDate][index].completed;
        saveTasks();
        displayTasks();
    }
}

function deleteTask(index) {
    if (selectedDate && tasks[selectedDate]) {
        tasks[selectedDate].splice(index, 1);
        if (tasks[selectedDate].length === 0) {
            delete tasks[selectedDate];
        }
        saveTasks();
        displayTasks();
        renderCalendar();
    }
}

function saveTasks() {
    localStorage.setItem('calendarTasks', JSON.stringify(tasks));
}

prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

addTaskButton.addEventListener('click', addTask);

// Inizializzazione
renderCalendar();
displayTasks();