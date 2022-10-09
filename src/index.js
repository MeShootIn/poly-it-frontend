/**
 * Асинхронный GET-запрос на сервер через fetch.
 * @param {string} url адрес.
 * @param {number} timeout таймаут в миллисекундах.
 * @returns {Promise<any>} промис, резолвящийся в JSON-объект.
 */
function request(url, timeout) {
  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, timeout);

  return fetch(url, {
    signal: abortController.signal
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }

      throw response;
    })
    .catch(err => {
      throw err;
    })
    .finally(() => {
      clearTimeout(timer);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
  const url = 'http://localhost:8080/employees'
  const timeout = 3000;
  let employees = null;

  try {
    employees = await request(url, timeout);
  } catch (e) {
    console.error(`Fetch error: ${e}`);
    return;
  }

  const tableBodyTemplateHTML = document
    .querySelector('#table-body-template')
    .innerHTML;
  const fillTemplate = _.template(tableBodyTemplateHTML);
  const tableBody = document.querySelector('.employee-table__body');

  employees = employees.map(employee => {
    const birthdayDate = new Date(+employee.birthday);
    const month = birthdayDate.getUTCMonth() + 1;
    const day = birthdayDate.getUTCDate();
    const year = birthdayDate.getUTCFullYear();
    const birthday = day + '.' + month + '.' + year;

    return {
      ...employee,
      birthday,
      salary: `₽ ${+employee.salary}`,
    }
  });

  tableBody.innerHTML += fillTemplate({employees});
});
