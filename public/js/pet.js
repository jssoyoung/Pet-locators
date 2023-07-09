const editPetProfileBtn = document.getElementById('btn__editPetProfile');
const closeEditPetProfileBtn = document.getElementById(
  'btn__closeEditPetProfile'
);
const editPetProfileModal = document.getElementById('modal__petProfileUpdate');
const editPetProfileOverlay = document.getElementById(
  'overlay__petProfileUpdate'
);

const petProfilePictureUpdateForm = document.getElementById(
  'form__updatePetProfilePicture'
);
const petProfileDetailUpdateForm = document.getElementById(
  'form__updatePetProfileDetails'
);

const petProfileUpdatePicture = document.getElementById(
  'picture__petProfileUpdate'
);

const petProfilePicture = document.getElementById('div__petProfilePicture');

const openModal = (e) => {
  e.preventDefault();
  editPetProfileModal.classList.remove('hidden');
  editPetProfileOverlay.classList.remove('hidden');
};

const closeModal = (e) => {
  e.preventDefault();
  editPetProfileModal.classList.add('hidden');
  editPetProfileOverlay.classList.add('hidden');
};

editPetProfileBtn.addEventListener('click', openModal);
editPetProfileOverlay.addEventListener('click', closeModal);
closeEditPetProfileBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !editPetProfileModal.classList.contains('hidden')) {
    closeModal(e);
  }
});

petProfilePictureUpdateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(petProfilePictureUpdateForm);
  try {
    const response = await fetch('/pets/update/upload', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      if (response.status === 200) {
        petProfileUpdatePicture.style.backgroundImage = `url('${data.profile_picture}')`;
        petProfilePicture.style.backgroundImage = `url('${data.profile_picture}')`;
      }
    }
  } catch (err) {}
});

petProfileDetailUpdateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(petProfileDetailUpdateForm);
  const updatedPetDetails = Object.fromEntries(formData);
  try {
    const response = await fetch('/pets/update/details', {
      method: 'POST',
      body: JSON.stringify(updatedPetDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (response.status === 200) {
        window.location.reload();
      }
    }
  } catch (err) {}
});
