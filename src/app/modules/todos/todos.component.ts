import { Component, OnInit } from '@angular/core';
import { Todos } from 'src/app/shared/models/todos';
import { TodosService } from 'src/app/shared/services/todos.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  todos!: Todos[];
  selectedTodo: Todos = { _id: '', title: '', description: '', completed: false, isDeleted: false };

  constructor(private todosService: TodosService) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  /**
   * Loads todos by subscribing to the todos service and updating the component's todos property.
   * @returns None
   */
  loadTodos() {
    this.todosService.getTodos().subscribe((todos) => {
      this.todos = todos;
    });
  }

  /**
   * Adds a new todo item with the given title and description.
   * @param {HTMLInputElement} titleInput - The input element containing the title of the todo.
   * @param {HTMLTextAreaElement} descriptionInput - The textarea element containing the description of the todo.
   * @returns None
   */
  addTodo(titleInput: HTMLInputElement, descriptionInput: HTMLTextAreaElement) {
    const newTodo = {
      title: titleInput.value,
      description: descriptionInput.value,
      completed: false,
      isDeleted: false,
    };

    this.todosService.createTodo(newTodo).subscribe(() => {
      this.loadTodos();
      titleInput.value = '';
      descriptionInput.value = '';
    });
  }

  /**
   * Deletes a todo item with the given id.
   * @param {string} id - The id of the todo item to delete.
   * @returns None
   */
  deleteTodo(id: string) {
    this.todosService.deleteTodo(id).subscribe(() => {
      this.loadTodos();
    });
  }

  /**
   * Opens the edit modal for a specific todo item.
   * @param {Todos} todo - The todo item to be edited.
   * @returns None
   */
  openEditModal(todo: Todos) {
    this.selectedTodo = { ...todo };
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

  /**
   * Updates the selected todo item by calling the todosService to update the todo in the database.
   * If the selected todo's ID is undefined, an error is logged and the function returns.
   * After updating the todo, it reloads the list of todos.
   * It also hides the edit modal if it exists, otherwise logs an error.
   * @returns None
   */
  updateTodo() {
    if (!this.selectedTodo._id) {
      console.error('Todo ID is undefined.');
      return;
    }

    this.todosService.updateTodo(this.selectedTodo._id, this.selectedTodo).subscribe(() => {
      this.loadTodos();
      const modalElement = document.getElementById('editModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        } else {
          console.error('Modal instance not found.');
        }
      } else {
        console.error('Modal element not found.');
      }
    });
  }

  /**
   * Toggles the completion status of a todo item.
   * If the todo item has an _id, it updates the completion status using the todosService.
   * If the todo item does not have an _id, it logs an error message.
   * @param {Todos} todo - The todo item to toggle completion status for.
   * @returns None
   */
  toggleComplete(todo: Todos) {
    if (todo._id) {
      this.todosService.updateTodo(todo._id, { completed: !todo.completed }).subscribe(() => {
        this.loadTodos();
      });
    } else {
      console.error("Non-existent Todo");
    }
  }
}

