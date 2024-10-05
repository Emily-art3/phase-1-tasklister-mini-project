document.addEventListener('DOMContentLoaded', () => {
  // Ensures the script runs only after the HTML file has fully loaded.
  
  const form = document.getElementById('create-task-form'); // Grabs the form element
  const taskList = document.getElementById('tasks'); // Grabs the task container
  const taskCount = document.getElementById('task-count'); // Grabs the task count element


  // Validate if important elements exist in the DOM
  if (!form || !taskList || !taskCount) {
    console.error('Critical DOM elements are missing!');
    return;
  }

  // Function to update the task count dynamically
  const updateTaskCount = () => {
    const tasks = taskList.getElementsByTagName('li'); // Counts number of tasks
    taskCount.textContent = `Total Tasks: ${tasks.length}`; // Updates the task count display
  };

  // Function to load tasks from localStorage (Persistent data feature)
  const loadTasksFromLocalStorage = () => {
    try {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Fetches tasks or initializes with empty array
      tasks.forEach(task => {
        createTask(task.description, task.priority, task.dueDate); // Creates task items in the DOM
      });
    } catch (error) {
      console.error('Error loading tasks from localStorage', error);
      localStorage.removeItem('tasks');
    }
  };
    
  // Function to save tasks to localStorage
  const saveTasksToLocalStorage = () => {
    const tasks = Array.from(taskList.children).map(task => ({
      description: task.querySelector('span').textContent, // Gets task description
      priority: task.getAttribute('data-priority'), // Gets task priority
      dueDate: task.querySelector('.due-date').textContent // Gets due date
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Stores tasks in localStorage as JSON
  };

  // Function to create and add tasks to the DOM
    const createTask = (description, priority, dueDate) => {
      try {
        console.log('Creating task:', description, priority, dueDate); // Debugging line
    const newTaskItem = document.createElement('li'); // Creates a new list item for the task
    newTaskItem.setAttribute('data-priority', priority); // Sets task priority as a data attribute
    newTaskItem.classList.add(`${priority}-priority`); // Adds class based on priority (for color styling)

    // Task content (description)
    const taskContent = document.createElement('span');
    taskContent.textContent = description;
    newTaskItem.appendChild(taskContent);

    // Due date
    const dueDateElement = document.createElement('span');
    dueDateElement.classList.add('due-date'); // Adds a class for the due date span
    dueDateElement.textContent = ` (Due: ${dueDate})`; // Formats the due date
    newTaskItem.appendChild(dueDateElement);

    // Edit button to modify the task
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(newTaskItem)); // Adds click event to trigger editing
    newTaskItem.appendChild(editButton);

    // Delete button to remove the task
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      taskList.removeChild(newTaskItem); // Removes task from DOM
      updateTaskCount(); // Updates task count
      saveTasksToLocalStorage(); // Saves remaining tasks
    });
    newTaskItem.appendChild(deleteButton);

    // Adds the task to the task list in the DOM
    taskList.appendChild(newTaskItem); 
    updateTaskCount(); // Updates task count after adding
     saveTasksToLocalStorage(); // Saves tasks to localStorage
 } catch (error) {
    console.error('Error creating task:', error); // Log the error details
    }
  };
    // Function to handle task editing
  const editTask = (taskItem) => {
    const currentDescription = taskItem.querySelector('span').textContent; // Grabs current task description
    const newDescription = prompt('Edit task description:', currentDescription); // Prompts the user to edit
    if (newDescription) {
      taskItem.querySelector('span').textContent = newDescription; // Updates task description with new input
      saveTasksToLocalStorage(); // Saves changes to localStorage
    }
  };

  // Event listener for the form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents default form submission behavior

    const taskInput = document.getElementById('new-task-description'); // Task description input
    const taskDescription = taskInput.value; // Get task description
    const taskPriority = document.getElementById('task-priority').value; // Get task priority from dropdown
    const dueDate = document.getElementById('due-date').value; // Get task due date

    // Validate that all required fields have input
    if (!taskDescription || !dueDate) {
      alert('Please enter both a task description and a due date.'); // Shows an alert if fields are empty
      return;
    }

    createTask(taskDescription, taskPriority, dueDate); // Create a new task with the provided data
    taskInput.value = ''; // Clear the task description input field after adding
    document.getElementById('due-date').value = ''; // Clear the due date field after adding
  });

  // Sort tasks functionality (Sorting tasks by priority)
  document.getElementById('sort-tasks').addEventListener('click', () => {
    const tasks = Array.from(taskList.children); // Convert task list items to an array

    tasks.sort((a, b) => {
      const priorityA = a.getAttribute('data-priority'); // Get the priority of task A
      const priorityB = b.getAttribute('data-priority'); // Get the priority of task B

    // Sorting logic: High > Medium > Low
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[priorityA] - priorityOrder[priorityB];
  });

    // Clear the list and re-add sorted tasks
    tasks.forEach(task => taskList.appendChild(task)); // Re-appends tasks in sorted order
    saveTasksToLocalStorage(); // Saves the sorted tasks to localStorage
  });

   // Load tasks from localStorage on page load (Persistent tasks)
   const isLocalStorageAvailable = () => {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  };
  // Load tasks if localStorage is available
  if (isLocalStorageAvailable()) {
    loadTasksFromLocalStorage();
  } else {
    console.warn('localStorage is not available.');
  }
});
