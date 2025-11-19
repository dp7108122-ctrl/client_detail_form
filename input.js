/* ------------- Select DOM elements ------------- */
const form = document.getElementById('clientForm');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const editBtn = document.getElementById('editBtn');
const darkToggle = document.getElementById('darkToggle');

const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const contact = document.getElementById('contact');
const urgent = document.getElementById('urgent');
const company = document.getElementById('company');
const services = document.getElementById('services');
const budget = document.getElementById('budget');
const description = document.getElementById('description');
const terms = document.getElementById('terms');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const contactError = document.getElementById('contactError');
const companyError = document.getElementById('companyError');
const servicesError = document.getElementById('servicesError');
const budgetError = document.getElementById('budgetError');
const descError = document.getElementById('descError');
const termsError = document.getElementById('termsError');

const outputCard = document.getElementById('outputCard');
const outputContent = document.getElementById('outputContent');
const outEdit = document.getElementById('outEdit');
const outClear = document.getElementById('outClear');

/* ------------- Helper validators ------------- */
function showError(el, msg) {
  el.textContent = msg;
  el.classList.add('error');
}
function clearError(el) {
  el.textContent = '';
  el.classList.remove('error');
}

function validateName() {
  const v = fullName.value.trim();
  if (v.length < 3) { showError(nameError, 'Name must be at least 3 characters'); return false; }
  clearError(nameError); return true;
}

function validateEmail() {
  const v = email.value.trim();
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i;
  if (!re.test(v)) { showError(emailError, 'Enter a valid email'); return false; }
  clearError(emailError); return true;
}

function validateContact() {
  const v = contact.value.trim();
  const re = /^[6-9]\d{9}$/;
  if (!re.test(v)) { showError(contactError, 'Enter a valid 10-digit number starting with 6-9'); return false; }
  clearError(contactError); return true;
}

function validateServices() {
  const count = [...services.options].filter(o => o.selected).length;
  if (count === 0) { showError(servicesError, 'Select at least one service'); return false; }
  clearError(servicesError); return true;
}

function validateBudget() {
  const v = budget.value;
  if (!v || Number(v) < 1000) { showError(budgetError, 'Enter budget (min $1000)'); return false; }
  clearError(budgetError); return true;
}

function validateDesc() {
  const v = description.value.trim();
  if (v.length < 10) { showError(descError, 'Description must be at least 10 characters'); return false; }
  clearError(descError); return true;
}

function validateTerms() {
  if (!terms.checked) { showError(termsError, 'You must agree to the terms'); return false; }
  clearError(termsError); return true;
}

/* ------------- Real-time listeners ------------- */
fullName.addEventListener('input', validateName);
email.addEventListener('input', validateEmail);
contact.addEventListener('input', validateContact);
services.addEventListener('change', validateServices);
budget.addEventListener('input', validateBudget);
description.addEventListener('input', validateDesc);
terms.addEventListener('change', validateTerms);

/* ------------- Submit handler ------------- */
let lastSubmission = null;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // run all validators
  const ok = [
    validateName(),
    validateEmail(),
    validateContact(),
    validateServices(),
    validateBudget(),
    validateDesc(),
    validateTerms()
  ].every(Boolean);

  if (!ok) {
    // focus first invalid field
    const firstErr = document.querySelector('.hint.error');
    if (firstErr) {
      const parent = firstErr.closest('.field');
      const input = parent && parent.querySelector('input,textarea,select');
      if (input) input.focus();
    }
    return;
  }

  // prepare data
  const selectedServices = [...services.options].filter(o => o.selected).map(o => o.value);
  const data = {
    fullName: fullName.value.trim(),
    email: email.value.trim(),
    contact: contact.value.trim(),
    company: company.value.trim() || 'N/A',
    services: selectedServices,
    budget: Number(budget.value),
    description: description.value.trim(),
    urgent: urgent.checked,
    agreed: terms.checked,
    submittedAt: new Date().toLocaleString()
  };

  lastSubmission = data;
  renderOutput(data);
  editBtn.disabled = false;
});

/* ------------- Render output ------------- */
function renderOutput(d) {
  outputContent.innerHTML = `
    <div class="info"><span class="k">Name:</span> ${escapeHtml(d.fullName)}</div>
    <div class="info"><span class="k">Email:</span> ${escapeHtml(d.email)}</div>
    <div class="info"><span class="k">Contact:</span> ${escapeHtml(d.contact)}</div>
    <div class="info"><span class="k">Company:</span> ${escapeHtml(d.company)}</div>
    <div class="info"><span class="k">Urgent:</span> ${d.urgent ? 'Yes' : 'No'}</div>
    <div class="info"><span class="k">Services:</span> ${d.services.map(s => escapeHtml(s)).join(', ')}</div>
    <div class="info"><span class="k">Budget:</span> $${escapeHtml(String(d.budget))}</div>
    <h4>Project Brief</h4>
    <div class="brief">${escapeHtml(d.description)}</div>
    <div class="info" style="margin-top:8px;color:var(--muted);font-size:12px">Submitted: ${escapeHtml(d.submittedAt)}</div>
  `;
  outputCard.classList.remove('hidden');
  // scroll into view on small screens
  outputCard.scrollIntoView({behavior:'smooth', block:'center'});
}

/* ------------- Edit / Clear buttons ------------- */
function loadSubmissionToForm(data) {
  if (!data) return;
  fullName.value = data.fullName;
  email.value = data.email;
  contact.value = data.contact;
  company.value = (data.company === 'N/A') ? '' : data.company;
  budget.value = data.budget;
  description.value = data.description;
  urgent.checked = !!data.urgent;
  terms.checked = !!data.agreed;

  // set services selection
  [...services.options].forEach(opt => {
    opt.selected = data.services.includes(opt.value);
  });

  // hide output, enable edit Btn
  outputCard.classList.add('hidden');
  editBtn.disabled = false;

  // re-run validators to update UI
  validateName(); validateEmail(); validateContact(); validateServices(); validateBudget(); validateDesc(); validateTerms();
}

editBtn.addEventListener('click', () => {
  if (!lastSubmission) return;
  loadSubmissionToForm(lastSubmission);
});

outEdit.addEventListener('click', () => {
  if (!lastSubmission) return;
  loadSubmissionToForm(lastSubmission);
});

clearBtn.addEventListener('click', () => {
  form.reset();
  outputCard.classList.add('hidden');
  lastSubmission = null;
  editBtn.disabled = true;
  // clear all errors
  [nameError,emailError,contactError,companyError,servicesError,budgetError,descError,termsError].forEach(clearError);
});

outClear.addEventListener('click', () => {
  clearBtn.click();
});

/* ------------- Dark mode toggle ------------- */
darkToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

/* ------------- Small security helper ------------- */
function escapeHtml(unsafe) {
  return String(unsafe)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

/* ------------- Initialize UI state ------------- */
(function init(){
  // add placeholder attributes needed for floating label CSS trick
  document.querySelectorAll('.floating input, .floating textarea').forEach(inp => {
    if (!inp.getAttribute('placeholder')) inp.setAttribute('placeholder',' ');
  });
  editBtn.disabled = true;
})();
