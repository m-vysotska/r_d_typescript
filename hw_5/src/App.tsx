import { CreateTaskForm } from './components/CreateTaskForm';
import './App.css';

function App() {
  const handleTaskCreated = () => {
    console.log('Task created successfully!');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Task Manager</h1>
        <p>Create and manage your tasks</p>
      </header>
      <main className="app-main">
        <CreateTaskForm onTaskCreated={handleTaskCreated} />
      </main>
    </div>
  );
}

export default App;
