<template>
  <div class="search-bar">
    <div class="input-group">
      <div class="mainContainer">
        <div class="optionsContainer">
          <b-form-select
            v-model="selected"
            :options="options"
            required
          ></b-form-select>
        </div>
        <div class="inputContainer">
          <input
            v-if="selected === 'Nombre'"
            type="text"
            class="form-control"
            v-model="searchQuery"
            placeholder="Buscar por nombre..."
            @input="updateSearchQuery"
          />
          <input
            v-else-if="selected === 'Director'"
            type="text"
            class="form-control"
            v-model="searchQuery"
            placeholder="Buscar por director..."
            @input="updateSearchQuery"
          />
          <input
            v-else-if="selected === 'Género o categoría'"
            type="text"
            class="form-control"
            v-model="searchQuery"
            placeholder="Buscar por género/categoría..."
            @input="updateSearchQuery"
          />

          <div v-if="selected === 'Fecha de publicación'" class="dates">
            <b-form-group label="Desde...">
              <input type="date" class="form-control" v-model="date1" />
            </b-form-group>

            <b-form-group label="Hasta...">
              <input type="date" class="form-control" v-model="date2"
            /></b-form-group>
          </div>
        </div>
      </div>

      <div class="input-group-append" v-if="selected">
        <button class="btn btn-secondary" type="button" @click="search">
          Buscar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMoviesByOption,
  getMoviesByDate,
  getMoviesByDescending,
} from "../network/index";
export default {
  data() {
    return {
      searchQuery: "",
      date1: null,
      date2: null,
      selected: null,
      options: [
        { text: "Buscar por:", value: null, disabled: true },
        "Fecha de publicación",
        "Nombre",
        "Director",
        "Género o categoría",
        "Fecha de forma descendente",
      ],
      movies: [],
    };
  },
  methods: {
    async search() {
      if (this.selected === "Fecha de publicación") {
        this.movies = await getMoviesByDate(this.date1, this.date2);
        this.$emit("search", this.movies);
      } else if (this.selected === "Fecha de forma descendente") {
        this.movies = await getMoviesByDescending();
        this.$emit("search", this.movies);
      } else {
        this.movies = await getMoviesByOption(this.selected, this.searchQuery);
        this.$emit("search", this.movies);
      }
    },
    updateSearchQuery() {
      this.$emit("input", this.searchQuery);
    },
  },
};
</script>

<style scoped>
.inputContainer {
  margin-right: 10px;
}

.mainContainer {
  display: flex;
  align-items: center;
}

.optionsContainer {
  padding-right: 10px;
}
.dates {
  display: flex;
  flex-direction: row;
}
</style>
