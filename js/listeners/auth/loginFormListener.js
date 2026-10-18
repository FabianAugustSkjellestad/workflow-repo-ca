import { login } from "../../api/auth/login.js";
import { displayMessage } from "../../ui/common/displayMessage.js";
import { saveToken, saveUser } from "../../utils/storage.js";
import { validateLoginForm } from "../../utils/validation.js";

async function handleLoginSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const messageContainer = document.querySelector("#message-container");
  const fieldset = form.querySelector("fieldset");
  const submitButton = form.querySelector('button[type="submit"]');

  messageContainer.innerHTML = "";

  const formData = new FormData(form);
  const profile = Object.fromEntries(formData.entries());

  const validationResult = validateLoginForm(profile.email, profile.password);

  if (!validationResult.isValid) {
    const errorHtml = validationResult.errors
      .map((error) => `<p class="text-red-500">${error}</p>`)
      .join("");
    displayMessage(messageContainer, "error", errorHtml);
    return;
  }

  fieldset.disabled = true;
  submitButton.textContent = "Logging in...";

  try {
    const {
      data: { accessToken, ...user },
    } = await login(profile);
    saveToken(accessToken);
    saveUser(user);
    window.location.href = "/";
  } catch (error) {
    displayMessage(messageContainer, "error", error.message);
  } finally {
    fieldset.disabled = false;
    submitButton.textContent = "Login";
  }
}

export function loginFormListener() {
  const form = document.querySelector("#loginForm");

  if (form) {
    form.addEventListener("submit", handleLoginSubmit);
  }
}
