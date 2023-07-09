const openAddPetBtn = document.getElementById('btn__openAddPet');
const closeAddPetBtn = document.getElementById('btn__closeAddPet');
const addPetModal = document.getElementById('modal__addPet');
const addPetOverlay = document.getElementById('overlay__addPet');
const changeUserProfilePictureBtn = document.getElementById(
  'btn__changeUserProfilePicture'
);
const changeUserProfilePictureModal = document.getElementById(
  'modal__changeUserProfilePicture'
);
const changeUserProfilePictureOverlay = document.getElementById(
  'overlay__changeUserProfilePicture'
);
const changeUserProfilePictureForm = document.getElementById(
  'form__changeUserProfilePicture'
);
const changeUserProfilePicturePicture = document.getElementById(
  'picture__changeUserProfilePicture'
);

const userProfilePicture = document.getElementById('picture__userProfile');

const changeUserProfilePictureCloseBtn = document.getElementById(
  'btn__closeChangeUserProfilePicture'
);

const addPetProfileDetailForm = document.getElementById('form__addPetDetails');

const openAddPetModal = (e) => {
  e.preventDefault();
  console.log('Hello');
  addPetModal.classList.remove('hidden');
  addPetOverlay.classList.remove('hidden');
};

const closeAddPetModal = (e) => {
  e.preventDefault();
  addPetModal.classList.add('hidden');
  addPetOverlay.classList.add('hidden');
};

const openChangeProfilePictureModal = (e) => {
  e.preventDefault();
  console.log('Hello');
  changeUserProfilePictureModal.classList.remove('hidden');
  changeUserProfilePictureOverlay.classList.remove('hidden');
};

const closeChangeProfilePictureModal = (e) => {
  e.preventDefault();
  changeUserProfilePictureModal.classList.add('hidden');
  changeUserProfilePictureOverlay.classList.add('hidden');
};

openAddPetBtn.addEventListener('click', openAddPetModal);
addPetOverlay.addEventListener('click', closeAddPetModal);
closeAddPetBtn.addEventListener('click', closeAddPetModal);

changeUserProfilePictureBtn.addEventListener(
  'click',
  openChangeProfilePictureModal
);
changeUserProfilePictureOverlay.addEventListener(
  'click',
  closeChangeProfilePictureModal
);

changeUserProfilePictureCloseBtn.addEventListener(
  'click',
  closeChangeProfilePictureModal
);

document.addEventListener('keydown', function (e) {
  if (
    e.key === 'Escape' &&
    (!addPetModal.classList.contains('hidden') ||
      !changeUserProfilePictureModal.classList.contains('hidden'))
  ) {
    closeAddPetModal(e);
    closeChangeProfilePictureModal(e);
  }
});

addPetProfileDetailForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addPetProfileDetailForm);
  const addedPetDetails = Object.fromEntries(formData);
  try {
    const response = await fetch('/user/addPet/details', {
      method: 'POST',
      body: JSON.stringify(addedPetDetails),
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

changeUserProfilePictureForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(changeUserProfilePictureForm);
  try {
    const response = await fetch('/user/changeProfilePicture', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      if (response.status === 200) {
        changeUserProfilePicturePicture.style.backgroundImage = `url('${data.userPicture}')`;
        userProfilePicture.style.backgroundImage = `url('${data.userPicture}')`;
      }
    }
  } catch (err) {
    console.log(err);
  }
});
