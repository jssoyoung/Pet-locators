//this is for the about and pets button
const aboutBtn = document.getElementById('btn__about');
const petsBtn = document.getElementById('btn__pets');
const aboutDiv = document.getElementById('div__about');
const petsDiv = document.getElementById('div__pets')

aboutBtn.addEventListener('click', () => {
    aboutDiv.classList.remove('hidden');
    petsDiv.classList.add('hidden');
})

petsBtn.addEventListener('click', () => {
  aboutDiv.classList.add('hidden');
    petsDiv.classList.remove('hidden');
})