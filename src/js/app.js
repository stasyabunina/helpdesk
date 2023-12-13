import HelpDesk from './HelpDesk';

const container = document.querySelector('.desk__wrapper');
const url = 'http://localhost:3000/';

const helpDesk = new HelpDesk(container, url);

helpDesk.init();
