// Every form marked data-service-form sends to the outside service in its
// action attribute (Formspree, the email tool, etc.) without leaving the page,
// then shows its thank-you message. If the service won't answer a background
// request (some email tools block them), the form falls back to a normal
// submit so nothing is lost.

const forms = document.querySelectorAll<HTMLFormElement>('[data-service-form]');

forms.forEach((form) => {
  const success = form.querySelector<HTMLElement>('[data-form-success]');
  const error = form.querySelector<HTMLElement>('[data-form-error]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  const show = (el: HTMLElement | null) => {
    if (success) success.hidden = el !== success;
    if (error) error.hidden = el !== error;
    el?.focus();
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // A bot filled in the hidden field: act as if it worked, send nothing.
    const trap = form.querySelector<HTMLInputElement>('[name="_gotcha"]');
    if (trap?.value) {
      form.reset();
      show(success);
      return;
    }

    // Not connected to a service yet (the action is empty in site.yaml).
    const action = form.getAttribute('action');
    if (!action) {
      show(error);
      return;
    }

    if (button) button.disabled = true;
    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      show(success);
    } catch (err) {
      if (err instanceof TypeError) {
        // The service refused a background request: submit the usual way
        // (form.submit() skips this listener).
        form.submit();
        return;
      }
      show(error);
    } finally {
      if (button) button.disabled = false;
    }
  });
});
