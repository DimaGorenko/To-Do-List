"use strict";

const view = {
  formId: "todoForm",
  todosContainerId: "todoItems",
  form: null,
  todoContainer: null,
  controller: null,
  removeAllBtn: null,
  currentItemId: 0,

  getForm() {
    if (!this.formId) throw new Error("No form id");
    this.form = document.getElementById(this.formId);
  },

  getTodosContainer() {
    if (!this.todosContainerId) throw new Error("No todoContainerId");
    this.todoContainer = document.getElementById(this.todosContainerId);
  },

  getRemoveAllBtn() {
    this.removeAllBtn = document.querySelector(".remove-all");
  },

  setEvents() {
    this.form.addEventListener("submit", this.submitHandler.bind(this));

    document.addEventListener("DOMContentLoaded", this.prefillData.bind(this));

    this.todoContainer.addEventListener(
      "change",
      this.checkTodoItem.bind(this)
    );

    this.todoContainer.addEventListener("click", this.removeElement.bind(this));

    this.removeAllBtn.addEventListener("click", this.removeAllTodos.bind(this));
  },

  prefillData() {
    const data = this.controller.getData(this.formId);
    if (!data || !data.length) return;

    this.currentItemId = data[data.length - 1].itemId;

    const iter = data[Symbol.iterator]();
    let nextItem = iter.next();

    while (!iter.done) {
      const elem = nextItem.value;
      if (nextItem.done) break;

      this.todoContainer.prepend(this.createTemplate(elem));
      nextItem = iter.next();
    }
  },

  submitHandler(event) {
    event.preventDefault();

    ++this.currentItemId;

    let data = {
      id: this.formId,
      completed: false,
      itemId: this.currentItemId,
      ...this.findInputsData(),
    };

    this.controller.setData(data);

    this.todoContainer.prepend(this.createTemplate(data));

    event.target.reset();
  },

  checkTodoItem({ target }) {
    const itemId = target.getAttribute("data-item-id");
    const status = target.checked;

    this.controller.changeCompleted(itemId, this.formId, status);
  },

  removeElement({ target }) {
    if (!target.classList.contains("delete-btn")) return;

    this.controller.removeItem(
      this.formId,
      target.getAttribute("data-item-id")
    );

    target.closest(".taskWrapper").parentElement.remove();
  },

  removeAllTodos() {
    this.controller.removeAll(this.formId);
    this.todoContainer.innerHTML = "";
  },

  findInputsData() {
    return Array.from(
      this.form.querySelectorAll("input[type=text], textarea")
    ).reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {});
  },

  createTemplate({ title, description, itemId, completed }) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("col-10");

    let wrapInnerContent = '<div class="taskWrapper">';
    wrapInnerContent += `<div class="taskHeading">${title}</div>`;
    wrapInnerContent += `<div class="taskDescription">${description}</div>`;
    wrapInnerContent += `<hr>`;
    wrapInnerContent += `<label class="completed form-check">`;
    wrapInnerContent += `<input data-item-id="${itemId}" type="checkbox" class="form-check-input" >`;
    wrapInnerContent += `<span>Completed ?</span>`;
    wrapInnerContent += `</label>`;
    wrapInnerContent += `<hr>`;
    wrapInnerContent += `<button class="btn btn-danger delete-btn" data-item-id="${itemId}">Remove</button>`;
    wrapInnerContent += "</div>";

    wrapper.innerHTML = wrapInnerContent;
    wrapper.querySelector("input[type=checkbox]").checked = completed;

    return wrapper;
  },

  init(controllerInstance) {
    this.getForm();
    this.getTodosContainer();
    this.getRemoveAllBtn();
    this.setEvents();
    this.controller = controllerInstance;
  },
};
