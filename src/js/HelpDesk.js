import TicketService from "./TicketService";
import TicketElement from "./TicketElement";
import Modal from "./modal";

export default class HelpDesk {
  constructor(element, url) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("This is not HTML element.");
    }
    this.element = element;
    this.ticketService = new TicketService(url);
    this.ticketList;
  }

  async init() {
    await this.getTicketList();
    this.createTicketList();
    this.checkTicketsLength();

    this.addTicketModalEventListener();
  }

  async getTicketList() {
    const data = await this.ticketService.list();

    this.ticketList = Array.from(data);
  }

  async deleteTicket(id) {
    const result = await this.ticketService.delete(id);
    if (result !== null) {
      await this.getTicketList();
    }
  }

  async getTicket(name) {
    const list = await this.ticketService.list();
    const ticket = list.find((ticket) => ticket.name === name);
    return ticket;
  }

  async createTicket(data) {
    const result = await this.ticketService.create(data);
    if (result !== null) {
      await this.getTicketList();
    }
  }

  async updateTicket(id, newData) {
    const result = await this.ticketService.update(id, newData);
    if (result !== null) {
      await this.getTicketList();
    }
  }

  createTicketList() {
    if (this.ticketList.length !== 0 && this.ticketList !== undefined) {
      this.ticketList.forEach((item) => {
        const list = this.element.querySelector(".desk__list");

        const ticketElement = new TicketElement(list, item);
        ticketElement.createElement();
        this.checkBoxEventListener(ticketElement.checkbox, ticketElement);
        this.deleteTicketModalEventListener(
          ticketElement.deleteBtn,
          ticketElement.element,
          ticketElement
        );
        this.editTicketModalEventListener(
          ticketElement.editBtn,
          ticketElement.element,
          ticketElement.title,
          ticketElement.description,
          ticketElement
        );
      });
    }
  }

  addTicketModalEventListener() {
    const addTicketModalBtn = this.element.querySelector(".desk__add");

    addTicketModalBtn.addEventListener("click", () => {
      const addTicketModal = new Modal("add", true);

      addTicketModal.createModal("Добавить тикет");

      if (addTicketModal.checkModalForm === true) {
        this.executeBtnEventListener(
          addTicketModal.modal,
          addTicketModal.form,
          addTicketModal
        );
      }
    });
  }

  deleteTicketModalEventListener(btn, element, id) {
    btn.addEventListener("click", () => {
      const deleteTicketModal = new Modal("delete", false, element);

      deleteTicketModal.createModal("Удалить тикет");

      if (deleteTicketModal.checkModalForm === false) {
        this.executeBtnEventListener(
          deleteTicketModal.modal,
          deleteTicketModal.executeBtn,
          deleteTicketModal,
          id
        );
      }
    });
  }

  editTicketModalEventListener(btn, element, ticketTitle, ticketDesc, id) {
    btn.addEventListener("click", () => {
      const editTicketModal = new Modal(
        "edit",
        true,
        element,
        ticketTitle,
        ticketDesc
      );

      editTicketModal.createModal("Изменить тикет");

      if (editTicketModal.checkModalForm === true) {
        this.executeBtnEventListener(
          editTicketModal.modal,
          editTicketModal.form,
          editTicketModal,
          id
        );
      }
    });
  }

  checkBoxEventListener(checkbox, id) {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        id.ticket.status = true;
      } else {
        id.ticket.status = false;
      }

      this.updateTicket(id.ticket.id, id.ticket);
    });
  }

  executeBtnEventListener(modalElement, element, modal, id) {
    let type;

    if (element.tagName === "BUTTON") {
      type = "click";
    } else {
      type = "submit";
    }

    element.addEventListener(type, (e) => {
      e.preventDefault();

      if (modal.modalName === "add") {
        if (
          modal.titleInput.value.trim() === "" ||
          modal.titleInput.value.length > 60
        ) {
          this.showError(modal);
        } else {
          this.createNewTicket(modal);

          modalElement.remove();
        }
      } else if (modal.modalName === "edit") {
        if (
          modal.titleInput.value.trim() === "" ||
          modal.titleInput.value.length > 60
        ) {
          this.showError(modal);
        } else {
          modal.ticket.querySelector(".ticket__title").textContent =
            modal.titleInput.value;
          id.ticket.name = modal.titleInput.value;
          if (document.querySelector(".modal__error")) {
            document.querySelector(".modal__error").remove();
          }

          const descWrapper = modal.ticket.querySelector(
            ".ticket__desc-wrapper"
          );

          if (
            modal.descInput.value.trim() === "" &&
            descWrapper.querySelector("p").classList.contains("ticket__desc")
          ) {
            modal.ticket.querySelector(".ticket__desc").textContent =
              "Описание отсутствует.";
            modal.ticket.querySelector(".ticket__desc").className =
              "ticket__no-desc";
            id.ticket.description = "";
          } else if (
            modal.descInput.value.trim() === "" &&
            descWrapper.querySelector("p").classList.contains("ticket__no-desc")
          ) {
            modal.ticket.querySelector(".ticket__no-desc").textContent =
              "Описание отсутствует.";
            id.ticket.description = "";
          } else if (
            descWrapper
              .querySelector("p")
              .classList.contains("ticket__no-desc") &&
            modal.descInput.value.trim() !== ""
          ) {
            descWrapper.querySelector("p").className = "ticket__desc";
            modal.ticket.querySelector(".ticket__desc").textContent =
              modal.descInput.value;
            id.ticket.description = modal.descInput.value;
          } else if (
            descWrapper.querySelector("p").classList.contains("ticket__desc") &&
            modal.descInput.value.trim() !== ""
          ) {
            modal.ticket.querySelector(".ticket__desc").textContent =
              modal.descInput.value;
            id.ticket.description = modal.descInput.value;
          }

          this.updateTicket(id.ticket.id, id.ticket);
          modalElement.remove();
        }
      } else {
        modal.ticket.remove();
        this.deleteTicket(id.ticket.id);
        modalElement.remove();
      }

      this.checkTicketsLength();
    });
  }

  async createNewTicket(modal) {
    const list = this.element.querySelector(".desk__list");
    const newData = Date.now();
    const data = {
      id: undefined,
      name: modal.titleInput.value,
      description: modal.descInput.value,
      status: false,
      created: newData,
    };
    const newTicket = new TicketElement(list, data);
    newTicket.createElement();
    if (document.querySelector(".modal__error")) {
      document.querySelector(".modal__error").remove();
    }

    await this.createTicket(newTicket.ticket);
    const createdTicket = await this.getTicket(newTicket.ticket.name);

    newTicket.ticket = createdTicket;

    this.checkBoxEventListener(newTicket.checkbox, newTicket);
    this.deleteTicketModalEventListener(
      newTicket.deleteBtn,
      newTicket.element,
      newTicket
    );
    this.editTicketModalEventListener(
      newTicket.editBtn,
      newTicket.element,
      newTicket.title,
      newTicket.description,
      newTicket
    );
  }

  showError(modal) {
    if (document.querySelector(".modal__error")) {
      document.querySelector(".modal__error").remove();
    }

    modal.titleInput.classList.add("modal__input_error");
    const error = document.createElement("span");
    error.classList.add("modal__error");

    if (modal.titleInput.value.trim() === "") {
      error.textContent = "Поле не может быть пустым.";
    } else {
      error.textContent = "Поле не может быть длиной больше чем 60 символов.";
    }

    modal.titleInput.after(error);
  }

  checkTicketsLength() {
    const list = this.element.querySelector(".desk__list");

    if (this.element.querySelectorAll(".desk__item").length === 0) {
      if (this.element.querySelector(".no-tickets-text")) {
        this.element.querySelector(".no-tickets-text").remove();
      }

      const text = document.createElement("p");
      text.textContent =
        'У вас нет тикетов. Вы можете создать один, нажав на кнопку "Добавить тикет".';
      text.classList.add("no-tickets-text");

      this.element.querySelector(".desk__list-wrapper").append(text);
      this.element.querySelector(".desk__list-wrapper").style.justifyContent =
        "center";
    }

    if (this.element.querySelectorAll(".desk__item").length !== 0) {
      this.element.querySelector(".desk__list-wrapper").removeAttribute("style");
    }

    if (
      this.element.querySelectorAll(".desk__item").length !== 0 &&
      this.element.querySelector(".no-tickets-text")
    ) {
      this.element.querySelector(".no-tickets-text").remove();
    }

    if (
      this.element.querySelectorAll(".desk__item").length <= 2 &&
      this.element.querySelectorAll(".desk__item").length > 0
    ) {
      list.lastChild.classList.add("ticket_second");
    }
  }
}
