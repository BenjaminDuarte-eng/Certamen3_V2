import React, { useState, useEffect } from 'react';
import './App.css';

// Componente principal de la aplicación
function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', asignatura: '', promedio: '' });
  const [editId, setEditId] = useState(null);

  // Cargar datos desde localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('students')) || [];
    setStudents(stored);
  }, []);

  // Guardar datos en localStorage al actualizar
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  // Calcular escala de apreciación desde el promedio
  const calcularEscala = (promedio) => {
    const p = parseFloat(promedio);
    if (p < 4) return 'Deficiente';
    if (p <= 5.5) return 'Con mejora';
    if (p <= 6.4) return 'Buen trabajo';
    return 'Destacado';
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const { nombre, asignatura, promedio } = formData;

    // Validación básica
    if (!nombre || !asignatura || isNaN(promedio)) {
      alert('Todos los campos son obligatorios y el promedio debe ser un número');
      return;
    }

    const nuevoEstudiante = {
      id: editId || Date.now(),
      nombre,
      asignatura,
      promedio,
      escala: calcularEscala(promedio)
    };

    if (editId) {
      setStudents(students.map(s => s.id === editId ? nuevoEstudiante : s));
      setEditId(null);
    } else {
      setStudents([...students, nuevoEstudiante]);
    }

    setFormData({ nombre: '', asignatura: '', promedio: '' });
  };

  // Eliminar estudiante
  const handleDelete = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  // Editar estudiante
  const handleEdit = (estudiante) => {
    setFormData({
      nombre: estudiante.nombre,
      asignatura: estudiante.asignatura,
      promedio: estudiante.promedio
    });
    setEditId(estudiante.id);
  };

  return (
    <div className="App">
      <h1>Evaluación de Alumnos</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Asignatura"
          value={formData.asignatura}
          onChange={(e) => setFormData({ ...formData, asignatura: e.target.value })}
        />
        <input
          type="number"
          placeholder="Promedio"
          value={formData.promedio}
          onChange={(e) => setFormData({ ...formData, promedio: e.target.value })}
        />
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Asignatura</th>
            <th>Promedio</th>
            <th>Escala</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.nombre}</td>
              <td>{s.asignatura}</td>
              <td>{s.promedio}</td>
              <td>{s.escala}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Editar</button>
                <button onClick={() => handleDelete(s.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
