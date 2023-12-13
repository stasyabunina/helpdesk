import Ticket from './ticket';

export default class TicketElement {
  constructor(list, data) {
    this.list = list;
    this.ticket = new Ticket(data);
    this.element;
    this.deleteBtn;
    this.editBtn;
    this.title;
    this.descripton;
    this.checkbox;
  }

  createElement() {
    const ticketElement = document.createElement('li');
    this.element = ticketElement;
    ticketElement.className = 'desk__item ticket';

    const ticketContent = document.createElement('div');
    ticketContent.classList.add('ticket__content');

    const label = document.createElement('label');
    label.classList.add('ticket__label');
    const checkbox = document.createElement('input');
    const visibleCheckbox = document.createElement('span');
    visibleCheckbox.classList.add('ticket__visible-checkbox');

    checkbox.type = 'checkbox';
    checkbox.className = 'ticket__checkbox visually-hidden';
    if (this.ticket.status === true) {
      checkbox.checked = 'true';
    }
    this.checkbox = checkbox;

    const title = document.createElement('h3');
    title.classList.add('ticket__title');
    title.textContent = `${this.ticket.name}`;

    const time = document.createElement('span');
    time.classList.add('ticket__time');
    const formattedDataArr = this.formatData(this.ticket.created).split(', ');
    const formattedTimeArr = formattedDataArr[1].split(':');
    const formattedData = formattedDataArr[0] + ' ' + formattedTimeArr[0] + ':' + formattedTimeArr[1];
    time.textContent = formattedData;

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">
    <path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"></path>
    </svg>`;
    editBtn.querySelector('svg').classList.add('ticket__svg');
    editBtn.className = 'ticket__edit btn';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.innerHTML = '&#10006;';
    deleteBtn.className = 'ticket__delete btn';

    const div = document.createElement('div');
    div.className = 'ticket__desc-wrapper ticket__desc-wrapper--hidden';
    const desc = document.createElement('p');
    desc.textContent = this.ticket.description;
    if (desc.textContent === '') {
      desc.textContent = 'Описание отсутствует.';
      desc.classList.add('ticket__no-desc');
    } else {
      desc.classList.add('ticket__desc');
    }

    this.list.append(ticketElement);
    ticketElement.append(ticketContent);
    ticketContent.append(label);
    label.append(checkbox);
    checkbox.after(visibleCheckbox);
    ticketContent.append(title);
    ticketContent.append(time);
    ticketElement.querySelector('.ticket__content').after(div);
    div.append(desc);

    ticketContent.append(editBtn);
    ticketContent.append(deleteBtn);

    this.description = desc;
    this.title = title;
    this.deleteBtn = deleteBtn;
    this.editBtn = editBtn;

    this.expandTicketEventListener(this.element, this.ticket.description);
  }

  formatData(data) {
    const date = new Date(data);
    const formattedDate = date.toLocaleString('ru-RU');

    return formattedDate;
  }

  expandTicketEventListener(id) {
    id.addEventListener('click', (e) => {
      let target = e.target;
      const list = document.querySelector('.desk__list');

      if (!target.closest('.btn')) {
        id.querySelector('.ticket__desc-wrapper').classList.toggle('ticket__desc-wrapper--hidden');
      }

      if (document.querySelectorAll('.desk__item').length === 2) {
        if (list.lastChild.classList.contains('ticket_second')) {
          list.lastChild.classList.remove('ticket_second');
        } else {
          list.lastChild.classList.add('ticket_second')
        }
      }
    })
  }
}
