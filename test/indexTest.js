// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-task-form'); // Get the form element for adding tasks
  const taskList = document.getElementById('tasks'); // Get the UL element where tasks will be displayed
  const taskCount = document.getElementById('task-count'); // Get the element displaying the task count
  const sortButton = document.getElementById('sort-button'); // Get the button for sorting tasks

  // Function to update the task count displayed on the page
  const updateTaskCount = () => {
    const tasks = taskList.getElementsByTagName('li'); // Get all task list items
    taskCount.textContent = `Total Tasks: ${tasks.length}`; // Update the task count display
  };

  // Function to load tasks from localStorage when the page is loaded
  const loadTasksFromLocalStorage = () => {
    try {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Retrieve tasks or initialize to an empty array
      tasks.forEach(task => createTask(task.description, task.user, task.duration, task.priority, task.dueDate)); // Create tasks in the DOM
    } catch (error) {
      console.error('Error loading tasks from localStorage', error); // Log any errors encountered
      localStorage.removeItem('tasks'); // Clear localStorage if there’s an error
    }
  };

  // Function to save the current tasks in the task list to localStorage
  const saveTasksToLocalStorage = () => {
    const tasks = Array.from(taskList.children).map(task => ({
      description: task.querySelector('.task-description').textContent, // Get task description
      user: task.querySelector('.task-user').textContent, // Get task user
      duration: task.querySelector('.task-duration').textContent, // Get task duration
      priority: task.getAttribute('data-priority'), // Get task priority from data attribute
      dueDate: task.querySelector('.due-date').textContent // Get task due date
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks to localStorage as JSON
  };

  // Function to create and add tasks to the DOM
  const createTask = (description, user, duration, priority, dueDate) => {
    const newTaskItem = document.createElement('li'); // Create a new list item for the task
    newTaskItem.setAttribute('data-priority', priority); // Set task priority as a data attribute
    newTaskItem.classList.add(`priority-${priority}`); // Add a class based on task priority

    // Set the inner HTML of the new task item
    newTaskItem.innerHTML = `
      <strong class="task-description">Description:</strong> ${description} <br>
      <strong class="task-user">User:</strong> ${user} <br>
      <strong class="task-duration">Duration:</strong> ${duration} hours <br>
      <span class="due-date">Due: ${dueDate}</span> <br>
    `;

    // Create an Edit button for modifying the task
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit'; // Set the button text
    editButton.addEventListener('click', () => editTask(newTaskItem, description, user, duration, dueDate, priority)); // Event listener for editing the task
    newTaskItem.appendChild(editButton); // Append the Edit button to the task item

    // Create a Delete button for removing the task
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete'; // Set the button text
    deleteButton.addEventListener('click', () => {
      taskList.removeChild(newTaskItem); // Remove the task from the DOM
      updateTaskCount(); // Update the task count
      saveTasksToLocalStorage(); // Save the remaining tasks
    });
    newTaskItem.appendChild(deleteButton); // Append the Delete button to the task item

    taskList.appendChild(newTaskItem); // Add the task item to the task list in the DOM
    updateTaskCount(); // Update task count after adding
    saveTasksToLocalStorage(); // Save tasks to localStorage
  };

  // Function to handle editing a task
  const editTask = (taskItem, description, user, duration, dueDate, priority) => {
    // Replace the task's content with input fields for editing
    taskItem.innerHTML = `
      <strong>Description:</strong> <input type="text" value="${description}" class="edit-description"> <br>
      <strong>User:</strong> <input type="text" value="${user}" class="edit-user"> <br>
      <strong>Duration:</strong> <input type="number" value="${duration}" class="edit-duration"> hours <br>
      <strong>Due Date:</strong> <input type="date" value="${dueDate}" class="edit-due-date"> <br>
    `;

    // Create a Save button to save the edits
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save'; // Set the button text
    saveButton.addEventListener('click', () => {
      const newDescription = taskItem.querySelector('.edit-description').value; // Get the new description
      const newUser = taskItem.querySelector('.edit-user').value; // Get the new user
      const newDuration = taskItem.querySelector('.edit-duration').value; // Get the new duration
      const newDueDate = taskItem.querySelector('.edit-due-date').value; // Get the new due date

      // Update the task item with the new details
      taskItem.innerHTML = `
        <strong class="task-description">Description:</strong> ${newDescription} <br>
        <strong class="task-user">User:</strong> ${newUser} <br>
        <strong class="task-duration">Duration:</strong> ${newDuration} hours <br>
        <span class="due-date">Due: ${newDueDate}</span> <br>
      `;
      
      taskItem.appendChild(editButton); // Append the Edit button back
      taskItem.appendChild(deleteButton); // Append the Delete button back
      saveTasksToLocalStorage(); // Save updated tasks to localStorage
    });
    taskItem.appendChild(saveButton); // Append Save button to the task item
  };

  // Event listener for the form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const taskInput = document.getElementById('new-task-description'); // Get task description input
    const userInput = document.getElementById('user'); // Get user input
    const durationInput = document.getElementById('duration'); // Get duration input
    const taskPriority = document.getElementById('task-priority').value; // Get selected task priority
    const dueDate = document.getElementById('due-date').value; // Get due date input

    // Validate that all required fields have input
    if (!taskInput.value || !dueDate) {
      alert('Please enter both a task description and a due date.'); // Alert user if validation fails
      return;
    }

    // Create a new task with provided inputs
    createTask(taskInput.value, userInput.value, durationInput.value, taskPriority, dueDate);
    // Clear input fields after task creation
    taskInput.value = '';
    userInput.value = '';
    durationInput.value = '';
    document.getElementById('due-date').value = '';
  });

  // Event listener for the sort button to sort tasks by priority
  sortButton.addEventListener('click', () => {
    const tasks = Array.from(taskList.children); // Convert NodeList to Array for sorting
    const priorityOrder = { high: 1, medium: 2, low: 3 }; // Define priority order for sorting

    // Sort tasks based on their priority
    tasks.sort((a, b) => {
      const priorityA = priorityOrder[a.getAttribute('data-priority')]; // Get priority for task A
      const priorityB = priorityOrder[b.getAttribute('data-priority')]; // Get priority for task B
      return priorityA - priorityB; // Sort in ascending order
    });

    // Append sorted tasks back to the task list in the correct order
    tasks.forEach(task => taskList.appendChild(task));
    saveTasksToLocalStorage(); // Save sorted tasks to localStorage
  });

  // Load tasks from localStorage when the page is loaded
  loadTasksFromLocalStorage();
});
