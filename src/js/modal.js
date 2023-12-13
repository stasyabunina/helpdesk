export default class Modal {
  constructor(modalName, checkModalForm, ticket, ticketTitle, ticketDesc) {
    if (['add', 'edit', 'delete'].includes(modalName) !== true) {
      throw new Error('Such modal can not exist.');
    }
    this.modalName = modalName;
    this.checkModalForm = checkModalForm;
    this.ticket = ticket;
    if (typeof checkModalForm !== 'boolean') {
      throw new Error('Instance "checkModalForm" can only be boolean.');
    }
    if (checkModalForm === true) {
      this.modalForm;
    } else {
      this.modalDescription;
    }
    this.modal;
    this.modalTitle;
    this.ticketTitle = ticketTitle;
    this.ticketDesc = ticketDesc;
    this.executeBtn;
    this.form;
    this.cancelBtn;
    this.titleInput;
    this.descInput;
  }

  createModal(titleName) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    this.modal = modal;

    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal__container');

    const title = document.createElement('h2');
    title.classList.add('modal__title');
    this.modalTitle = title;
    title.textContent = titleName;

    const executeBtn = document.createElement('button');
    executeBtn.className = 'modal__btn btn';
    this.executeBtn = executeBtn;
    executeBtn.textContent = 'Ок';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'modal__btn btn';
    this.cancelBtn = cancelBtn;
    cancelBtn.textContent = 'Отмена';
    cancelBtn.type = 'button';
    this.cancelModalEventListener(cancelBtn, modal);

    document.body.append(modal);
    modal.append(modalContainer);
    modalContainer.append(title);

    const btnWrapper = document.createElement('div');
    btnWrapper.classList.add('modal__btn-wrapper');
    btnWrapper.append(cancelBtn);
    btnWrapper.append(executeBtn);

    if (this.checkModalForm === true) {
      const form = document.createElement('form');
      form.classList.add('modal__form');
      this.modalForm = form;
      title.after(form);

      const ticketTitleLabel = document.createElement('label');
      ticketTitleLabel.classList.add('modal__label');
      form.append(ticketTitleLabel);

      const ticketDescLabel = document.createElement('label');
      ticketDescLabel.classList.add('modal__label');
      this.form = form;
      form.append(ticketDescLabel);

      const ticketTitle = document.createElement('span');
      ticketTitle.classList.add('modal__input-title');
      ticketTitle.textContent = 'Краткое описание';
      ticketTitleLabel.append(ticketTitle);

      const ticketDesc = document.createElement('span');
      ticketDesc.classList.add('modal__input-title');
      ticketDesc.textContent = 'Подробное описание';
      ticketDescLabel.append(ticketDesc);

      const ticketTitleInput = document.createElement('input');
      ticketTitleInput.classList.add('modal__input');
      ticketTitleInput.placeholder = 'Название тикета';
      ticketTitleLabel.append(ticketTitleInput);

      const ticketDescInput = document.createElement('textarea');
      ticketDescInput.classList.add('modal__input');
      ticketDescInput.placeholder = 'Описание тикета';
      ticketDescLabel.append(ticketDescInput);

      if (this.modalName === 'edit') {
        ticketTitleInput.value = this.ticketTitle.textContent;
        ticketDescInput.value = this.ticketDesc.textContent;

        if (this.ticket.querySelector('.ticket__no-desc')) {
          ticketDescInput.value = '';
        }
      }

      this.titleInput = ticketTitleInput;
      this.descInput = ticketDescInput;

      form.append(btnWrapper);
      ticketTitleInput.focus();
    }

    if (this.checkModalForm === false) {
      const text = document.createElement('p');
      text.classList.add('modal__text');
      this.modalDescription = text;
      text.textContent = 'Вы уверены, что хотите удалить тикет? Это действие необратимо.';
      title.after(text);

      modalContainer.append(btnWrapper);
    }
  }

  cancelModalEventListener() {
    this.cancelBtn.addEventListener('click', () => {
      if (this.checkModalForm === true) {
        this.modalForm.reset();
      }

      this.modal.remove();
    })
  }
}
