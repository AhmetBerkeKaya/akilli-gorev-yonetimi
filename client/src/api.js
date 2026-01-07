const API_URL = 'http://localhost:3000';

export const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`);
    return res.json();
};

export const createTask = async (task) => {
    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    return res.json();
};