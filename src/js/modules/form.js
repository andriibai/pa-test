document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form-request__request-js');
  const submitButton = form.querySelector('.form-request__submit-js');
  const spanElement = submitButton.querySelector('span');

  if (!form) {
    return;
  }

  let animation;

  animation = lottie.loadAnimation({
    container: submitButton,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'loader-btn.json',
  });

  animation.hide();

  const fieldsWrap = form.querySelectorAll('.form-request__fields-wrap');

  fieldsWrap.forEach((fieldWrap) => {
    const input = fieldWrap.querySelector('input');
    const validIcon = fieldWrap.querySelector('.form-request__valid-icon');
    const errorElement = fieldWrap.querySelector('.form-request__error');

    input.addEventListener('input', () => {
      validateField(input, validIcon, errorElement);
    });

    input.addEventListener('input', () => {
      if (input.value === '') {
        clearField(input, validIcon, errorElement);
      }
    });
  });

  const validateField = (input, validIcon, errorElement) => {
    const inputValue = input.value;
    const fieldName = input.name;
    let isValid = true;

    if (fieldName === 'email') {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      isValid = emailRegex.test(inputValue) && inputValue.length <= 320;
    } else if (fieldName === 'cname') {
      isValid = inputValue.length >= 3 && inputValue.length <= 64;
    } else if (fieldName === 'url') {
      const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}([/a-zA-Z0-9.-]*)*$/;
      isValid = urlRegex.test(inputValue) && inputValue.length <= 2000;
    } else if (fieldName === 'first-name' || fieldName === 'last-name') {
      isValid = inputValue.length >= 2 && inputValue.length <= 64;
    }

    input.classList.toggle('error', !isValid);
    validIcon.classList.toggle('valid', isValid);
    errorElement.classList.toggle('error', !isValid);

    const requiredMessage = errorElement.dataset.required_message;
    const errorMessage = errorElement.dataset.error_message;
    errorElement.innerText = !isValid ? errorMessage : input.value === '' ? requiredMessage : '';
  };

  const clearField = (input, validIcon, errorElement) => {
    input.classList.remove('error');
    validIcon.classList.remove('valid');
    errorElement.classList.remove('error');
    errorElement.innerText = '';
  };

  const validateForm = () => {
    const fields = form.querySelectorAll('input');
    let isFormValid = true;

    fields.forEach((field) => {
      const fieldWrap = field.closest('.form-request__fields-wrap');
      const validIcon = fieldWrap.querySelector('.form-request__valid-icon');
      const errorElement = fieldWrap.querySelector('.form-request__error');

      if (field.value === '') {
        clearField(field, validIcon, errorElement);
        isFormValid = false;
        errorElement.classList.add('error');

        const requiredMessage = errorElement.dataset.required_message;
        errorElement.innerText = requiredMessage;
      } else if (field.classList.contains('error')) {
        isFormValid = false;
      }
    });

    return isFormValid;
  };

  const clearFormFields = () => {
    const fields = form.querySelectorAll('input');
    fields.forEach((field) => {
      const fieldWrap = field.closest('.form-request__fields-wrap');
      const validIcon = fieldWrap.querySelector('.form-request__valid-icon');
      const errorElement = fieldWrap.querySelector('.form-request__error');
      clearField(field, validIcon, errorElement);
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (isFormValid) {
      // All fields are valid, so you can send the data to the server
      const companyName = form.querySelector('[name="cname"]').value;
      const websiteLink = form.querySelector('[name="url"]').value;
      const businessEmail = form.querySelector('[name="email"]').value;
      const firstName = form.querySelector('[name="first-name"]').value;
      const lastName = form.querySelector('[name="last-name"]').value;

      const formData = {
        'Company Name': companyName,
        'Website Link': websiteLink,
        'Business Email': businessEmail,
        'First Name': firstName,
        'Last Name': lastName,
      };

      animation.show();
      animation.play();
      spanElement.classList.add('hidden-text');

      // Simulate sending to a server (you can replace this with a real fetch request)
      const fakeServerResponse = await simulateServerRequest(formData);

      animation.stop();
      animation.hide();
      spanElement.classList.remove('hidden-text');

      // Display the response on the screen
      console.log('Server Response:', fakeServerResponse);
      alert('Form data has been successfully submitted!');
      clearFormFields();
      form.reset();
    } else {
      // If not all fields are valid, do not send the data and display an error
      //alert('Please fill in all fields correctly.');
    }
  };

  const simulateServerRequest = (formData) => {
    // Simulate a server request with a delay (replace with a real fetch request)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate a server response with a success status
        const fakeResponse = {
          status: 'success',
          message: 'Form data has been successfully submitted!',
          data: formData,
        };
        resolve(fakeResponse);
      }, 3000); // Artificial delay of 3 seconds
    });
  };

  // Add an event listener to the form submit button
  submitButton.addEventListener('click', handleFormSubmit);
});
