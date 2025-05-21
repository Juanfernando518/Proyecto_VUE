<template>
  <div>
    <form @submit.prevent="submitForm">
      <div>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="form.nombre" required />
      </div>
      <div>
        <label for="direccion">Dirección:</label>
        <input type="text" id="direccion" v-model="form.direccion" required />
      </div>
      <button type="submit">{{ editIndex === null ? 'Enviar' : 'Actualizar' }}</button>
      <button v-if="editIndex !== null" type="button" @click="cancelEdit">Cancelar</button>
    </form>

    <table v-if="storedData.length" class="styled-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in storedData" :key="data.id">
          <td>{{ data.nombre }}</td>
          <td>{{ data.direccion }}</td>
          <td>
            <button @click="editData(index)">Editar</button>
            <button @click="deleteData(data.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default {
  data() {
    return {
      form: {
        nombre: '',
        direccion: ''
      },
      storedData: [],
      editIndex: null,
      editId: null
    };
  },
  methods: {
    async submitForm() {
      console.log("Enviando a Firestore:", this.form.nombre, this.form.direccion);
      if (this.editIndex === null) {
        // Crear nuevo
        await addDoc(collection(db, "usuarios"), {
          nombre: this.form.nombre,
          direccion: this.form.direccion
        });
      } else {
        // Actualizar existente
        const ref = doc(db, "usuarios", this.editId);
        await updateDoc(ref, {
          nombre: this.form.nombre,
          direccion: this.form.direccion
        });
      }
      this.form.nombre = '';
      this.form.direccion = '';
      this.editIndex = null;
      this.editId = null;
      this.loadStoredData();
    },
    async loadStoredData() {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      this.storedData = [];
      querySnapshot.forEach((docu) => {
        this.storedData.push({ id: docu.id, ...docu.data() });
      });
    },
    async deleteData(id) {
      await deleteDoc(doc(db, "usuarios", id));
      this.loadStoredData();
    },
    editData(index) {
      this.editIndex = index;
      this.editId = this.storedData[index].id;
      this.form.nombre = this.storedData[index].nombre;
      this.form.direccion = this.storedData[index].direccion;
    },
    cancelEdit() {
      this.editIndex = null;
      this.editId = null;
      this.form.nombre = '';
      this.form.direccion = '';
    }
  },
  mounted() {
    this.loadStoredData();
  }
};
</script>

<style>
form {
  margin-bottom: 20px;
  text-align: center;
}

form div {
  margin-bottom: 10px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 5px;
}

button:hover {
  background-color: #45a049;
}

.styled-table {
  border-collapse: collapse;
  margin: 25px auto;
  font-size: 18px;
  font-family: Arial, sans-serif;
  min-width: 400px;
  width: 80%;
  text-align: left;
  border: 1px solid #ddd;
}

.styled-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
</style>