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
        <button type="submit">Enviar</button>
      </form>
      <table>
        <tr>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Acciones</th>
        </tr>
        <tr v-for="data in storedData" :key="data.id">
          <td>{{ data.nombre }}</td>
          <td>{{ data.direccion }}</td>
          <td>
            <button @click="editData(data)">Editar</button>
            <button @click="deleteData(data.id)">Eliminar</button>
          </td>
        </tr>
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
        editId: null
      };
    },
    methods: {
      async submitForm() {
        if (this.editId === null) {
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
      editData(data) {
        this.editId = data.id;
        this.form.nombre = data.nombre;
        this.form.direccion = data.direccion;
      },
      cancelEdit() {
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