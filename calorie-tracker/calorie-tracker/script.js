// This file contains the JavaScript code for the calorie tracker functionality.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calorie-form');
    const foodInput = document.getElementById('food-item');
    const caloriesInput = document.getElementById('calories');
    const calorieList = document.getElementById('calorie-list');
    const totalSpan = document.getElementById('total');
    const filterInput = document.getElementById('filter-food');
    const motivation = document.getElementById('motivation');
    const progressBar = document.getElementById('progress-bar');
    const goalValue = document.getElementById('goal-value');
    const goalStatus = document.getElementById('goal-status');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const goalInput = document.getElementById('goal-input');
    const closeSettings = document.getElementById('close-settings');
    const saveSettings = document.getElementById('save-settings');
    const calorieFilter = document.getElementById('calorie-filter');

    let items = [];
    let dailyGoal = parseInt(localStorage.getItem('dailyGoal')) || 2000;

    // Motivational messages
    const messages = [
        "Great choice! 🥗",
        "Keep it up! 💪",
        "You're on track! 🚀",
        "Healthy habits, healthy life! 🌱",
        "Awesome! 🎉"
    ];

    function renderList(filter = '') {
        calorieList.innerHTML = '';
        let filtered = items.filter(item =>
            item.food.toLowerCase().includes(filter.toLowerCase())
        );
        // Apply calorie filter
        if (calorieFilter) {
            if (calorieFilter.value === 'above') {
                filtered = filtered.filter(item => item.calories > 50);
            } else if (calorieFilter.value === 'below') {
                filtered = filtered.filter(item => item.calories <= 50);
            }
        }
        filtered.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.className = "transition-all duration-300 hover:bg-gray-800";
            tr.innerHTML = `
                <td class="px-4 py-2">${item.food}</td>
                <td class="px-4 py-2">${item.calories}</td>
                <td class="px-4 py-2">
                    <button data-idx="${idx}" class="delete-btn text-red-400 hover:text-red-600 transition" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" class="inline h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </td>
            `;
            calorieList.appendChild(tr);
        });
        updateTotal(filtered);
    }

    function updateTotal(list) {
        const sum = (list || items).reduce((acc, item) => acc + item.calories, 0);
        totalSpan.textContent = sum;
        updateProgress(sum);
    }

    function updateProgress(current) {
        goalValue.textContent = dailyGoal;
        let percent = Math.min(100, Math.round((current / dailyGoal) * 100));
        progressBar.style.width = percent + "%";
        if (current < dailyGoal) {
            goalStatus.textContent = `${dailyGoal - current} kcal left`;
            progressBar.className = "bg-blue-500 h-4 rounded-full transition-all duration-500";
        } else {
            goalStatus.textContent = `Goal reached! 🎯`;
            progressBar.className = "bg-green-500 h-4 rounded-full transition-all duration-500";
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const food = foodInput.value.trim();
        const calories = parseInt(caloriesInput.value);
        if (food && !isNaN(calories) && calories > 0) {
            items.push({ food, calories });
            foodInput.value = '';
            caloriesInput.value = '';
            renderList(filterInput.value);
            // Show motivational message
            motivation.textContent = messages[Math.floor(Math.random() * messages.length)];
            motivation.classList.remove('hidden');
            setTimeout(() => motivation.classList.add('hidden'), 2000);
        }
    });

    filterInput.addEventListener('input', () => {
        renderList(filterInput.value);
    });

    calorieList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const idx = parseInt(e.target.closest('.delete-btn').getAttribute('data-idx'));
            // Find the correct index in the filtered list
            const filter = filterInput.value.toLowerCase();
            const filtered = items.filter(item =>
                item.food.toLowerCase().includes(filter)
            );
            const itemToDelete = filtered[idx];
            // Remove from the main items array
            const realIdx = items.findIndex(item => item === itemToDelete);
            if (realIdx > -1) items.splice(realIdx, 1);
            renderList(filterInput.value);
        }
    });

    // Settings modal logic
    settingsBtn.addEventListener('click', () => {
        goalInput.value = dailyGoal;
        settingsModal.classList.remove('hidden');
    });
    closeSettings.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });
    saveSettings.addEventListener('click', () => {
        const newGoal = parseInt(goalInput.value);
        if (!isNaN(newGoal) && newGoal > 0) {
            dailyGoal = newGoal;
            localStorage.setItem('dailyGoal', dailyGoal);
            settingsModal.classList.add('hidden');
            updateProgress(items.reduce((acc, item) => acc + item.calories, 0));
        }
    });

    // Quick Add Foods
    document.querySelectorAll('.quick-add').forEach(btn => {
        btn.addEventListener('click', () => {
            const food = btn.getAttribute('data-food');
            const calories = parseInt(btn.getAttribute('data-calories'));
            if (food && !isNaN(calories)) {
                items.push({ food, calories });
                renderList(filterInput.value);
                motivation.textContent = messages[Math.floor(Math.random() * messages.length)];
                motivation.classList.remove('hidden');
                setTimeout(() => motivation.classList.add('hidden'), 2000);
            }
        });
    });

    // Initial render
    goalValue.textContent = dailyGoal;
    renderList();

    // Close modal on outside click
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });
});