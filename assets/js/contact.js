document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementById('contact-form');
  const submit = (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      return;
    }

    const data = new FormData(event.target);

    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      document.querySelector('#contact-status .success').classList.add('visible');
      form.reset();
    }).catch(error => {
      document.querySelector('#contact-status .failure').classList.add('visible');
    });
  }
  form.addEventListener('submit', submit)
});
