const tableBody = document.querySelector('.employee-table__body');
const template = document.querySelector('#template-employee');

for (let i = 0; i < 3; i++) {
  tableBody.append(template.content.cloneNode(true));
}
