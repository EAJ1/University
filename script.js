const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton.hidden = false;
navigation.classList.add('collapsed');
function closeMenu() {
  navigation.classList.add('collapsed');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('collapsed', !open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

const searchForm = document.querySelector('.program-search');
const searchInput = document.querySelector('#program-query');
const programCards = [...document.querySelectorAll('.program-card')];
searchForm.hidden = false;
function filterPrograms() {
  const query = searchInput.value.trim().toLowerCase();
  let count = 0;
  programCards.forEach(card => {
    card.hidden = !card.textContent.toLowerCase().includes(query);
    if (!card.hidden) count++;
  });
  document.querySelector('.empty-state').hidden = count > 0;
  document.querySelector('#search-status').textContent = query ? `${count} field${count === 1 ? '' : 's'} of study found.` : '';
}
searchInput.addEventListener('input', filterPrograms);
searchForm.addEventListener('submit', event => { event.preventDefault(); filterPrograms(); });
// Subject guides link back to the draft form with their selection.
const requestedProgram = new URLSearchParams(window.location.search).get('program');
const selectedCard = programCards.find(card =>
  new URL(card.href).pathname.endsWith(`/programs/${requestedProgram}.html`)
);
if (selectedCard) {
  document.querySelector('#program-interest').value = selectedCard.dataset.program;
}

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
let lastGalleryLink;
if (typeof lightbox.showModal === 'function') {
  document.querySelectorAll('.gallery-item').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    lastGalleryLink = link;
    lightboxImage.src = link.href;
    lightboxImage.alt = link.querySelector('img').alt;
    lightbox.querySelector('p').textContent = link.querySelector('h3').textContent;
    lightbox.showModal();
  }));
  lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    const bounds = lightbox.getBoundingClientRect();
    if (event.target === lightbox && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) lightbox.close();
  });
  lightbox.addEventListener('close', () => lastGalleryLink?.focus());
}

const contactForm = document.querySelector('.contact-form');
// This static site has no admissions endpoint. Export the enquiry without claiming delivery.
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const content = `INSANE UNIVERSITY — ENQUIRY DRAFT\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nField of study: ${data.get('program') || 'Undecided'}\n\n${data.get('message')}\n\nThis enquiry has not been sent.\n`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const download = document.createElement('a');
  download.href = url;
  download.download = 'university-enquiry.txt';
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#form-status').textContent = 'Your enquiry download is ready. No message has been sent to admissions.';
});
document.querySelector('#year').textContent = new Date().getFullYear();
