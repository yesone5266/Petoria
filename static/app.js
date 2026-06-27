const savedPet = localStorage.getItem('pet_info');
if (savedPet && localStorage.getItem('pet_state')) {
    const petInfo = JSON.parse(savedPet);
    location.href = `/play?pet_name=${petInfo.name}&pet_tpye=${petInfo.type}`;
}

const [left_btn, right_btn] = document.querySelectorAll('#choose>button');
const images = document.querySelector('#images')
const input = document.querySelector('#name>input')
const complete = document.querySelector('#complete')

let step = 0;

left_btn.addEventListener('click', () => {
    if (step < 0) {
        step += 1
        images.style.transform = `translateX(${step * 100}%)`;
    }
})

right_btn.addEventListener('click', () => {
    if (step > -5) {
        step -= 1
        images.style.transform = `translateX(${step * 100}%)`;
    }
})

input.addEventListener('input', () => {
    if (input.value === '') {
        complete.disabled = true
    }
    else {
        complete.disabled = false
    }
})

complete.addEventListener('click', () => {
    const pet_tpye = ['치즈_고양이', '흰색_고양이', '푸들', '리트리버', '베이지색_토끼', '흰색_토끼'][-step]
    
    localStorage.setItem('pet_info', JSON.stringify({ name: input.value, type: pet_tpye }));
    location.href = `/play?pet_name=${input.value}&pet_tpye=${pet_tpye}`
})